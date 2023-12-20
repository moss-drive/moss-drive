import Axios from "axios";
import store from "../store";
import router from "../router";

const { VITE_BASE_URL: baseURL, VITE_BUCKET_API, VITE_PAY_API } = import.meta.env;
// console.log(baseURL, authURL);
const http = Axios.create({
  baseURL,
});

let refreshing = false;
const pendingQueue = [];

function getToken(isRefresh) {
  const key = isRefresh ? "refreshToken" : "accessToken"; //"accessToken";
  return store.state.loginData[key];
}

http.interceptors.request.use(
  (config) => {
    config.url = config.url.replace("$bucket", VITE_BUCKET_API).replace("$pay", VITE_PAY_API);
    let token = getToken();
    if (token) {
      config.headers["Authorization"] = token; // "Bearer " +
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

http.interceptors.response.use(
  async (res) => {
    const data = res.data;
    if (typeof data == "object" && data && "code" in data) {
      if (data.code != 200 && data.code != "SUCCESS") {
        data.msg = data.message || `${data.code} error`;
        // handleMsg(200, data.code, msg, res.config);
        const pending = await handleError(200, res.config, data);
        if (pending) {
          return pending;
        }
        const error = new Error(data.msg);
        error.code = data.code;
        throw error;
      }
      if ("data" in data) {
        return data;
      }
    }
    return res;
  },
  async (error) => {
    // , status, statusText, config = {}
    const { data = {}, status, config = {} } = error.response || {};
    const msg = data.message || error.message;
    const pending = await handleError(status, config, {
      ...data,
      msg,
    });
    if (pending) {
      return pending;
    }
    error.message = msg;
    // error.code = data.code;
    return Promise.reject(error);
  }
);

async function handleError(status, config, data) {
  if (refreshing) {
    return new Promise((resolve) => {
      pendingQueue.push({
        config,
        resolve,
      });
    });
  }
  // console.log(data);
  if (status == 401 || data.code == 401 || data.code == "INVALID_TEAM_TOKEN") {
    refreshing = true;
    const isOk = await refreshToken();
    if (isOk) {
      pendingQueue.forEach(({ config, resolve }) => {
        resolve(http(config));
      });
      return http(config);
    } else {
      console.log("redirect to login");
      store.dispatch("logout");
      const loginPath = "/";
      if (location.pathname != loginPath) {
        localStorage.loginTo = location.pathname + location.search;
      }
      router.replace({
        path: loginPath,
      });
      return;
    }
  }
  if (!config.noTip) {
    window.$alert(data.msg);
  }
}

async function refreshToken() {
  const refreshToken = getToken(1);
  if (!refreshToken) {
    return false;
  }
  try {
    const res = await Axios.post(
      VITE_BASE_URL + "/login/refresh",
      {
        refreshToken,
      },
      {
        headers: {
          // Authorization: "Bearer " + getToken(),
        },
      }
    );
    store.dispatch("login", res.data.data);
    return res.status == 200;
  } catch (error) {
    console.log("refresh err", error);
  }
  return false;
}

export default http;
