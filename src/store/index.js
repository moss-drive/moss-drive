import { createStore } from "vuex";
import resourceStore from "./resource";
const SET_DATA = "setData";

const storInit = {
  loginData: {},
  stsData: {},
  userInfo: {},
  usageInfo: {},
  pointInfo: {},
  stoneList: null,
};
const storState = {
  ...storInit,
};
for (const key in storState) {
  let val = localStorage[key];
  try {
    if (val) storState[key] = JSON.parse(val);
  } catch (error) {
    console.log(key, error);
  }
}

const store = createStore({
  state: {
    ...storState,
    nowDate: new Date(),
    isFocus: true,
    showProgress: false,
  },
  mutations: {
    [SET_DATA](state, data) {
      for (const key in data) {
        state[key] = data[key];
      }
    },
  },
  actions: {
    login(_, data) {
      data.accessExpireAt = new Date(data.expiredAt).format();
      data.refreshExpireAt = new Date(data.refreshExpiredAt).format();
      setStore({
        loginData: data,
      });
    },
    logout() {
      localStorage.clear();
      setStore({
        ...storInit,
      });
    },
  },
  modules: {
    resourceStore,
  },
});

export const setState = (data) => {
  store.commit(SET_DATA, data);
};

export const setStore = (data) => {
  for (const key in data) {
    try {
      localStorage[key] = JSON.stringify(data[key]);
    } catch (error) {
      console.log(key, error);
    }
  }
  setState(data);
};

window.onblur = () => {
  setState({
    isFocus: false,
  });
};
window.onfocus = () => {
  setState({
    isFocus: true,
  });
};

setInterval(() => {
  setState({
    nowDate: new Date(),
  });
}, 1e3);

export default store;
