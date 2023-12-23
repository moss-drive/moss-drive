import { createApp } from "vue";
import App from "./App.vue";

import { Quasar, Dialog, Notify, Loading } from "quasar";
import "@quasar/extras/material-icons/material-icons.css";
import "quasar/src/css/index.sass";

import router from "./router";
import store, { setState, setStore } from "./store";
import utils from "./utils";
import "./css/style.scss";
import Components from "./components";
import mitt from "mitt";
const bus = mitt();
const app = createApp(App);
const global = app.config.globalProperties;

app.use(Quasar, {
  plugins: {
    Dialog,
    Notify,
    Loading,
  },
});

app.use(utils);

app.use(router);
app.use(store);
global.$setState = setState;
global.$setStore = setStore;

app.config.globalProperties.$bus = bus;

router.beforeEach((to, _, next) => {
  setState({
    showProgress: true,
  });
  next();
});
router.afterEach((to) => {
  if (/\/mossy/.test(to.path)) {
    document.title = "Mossy";
  }
  setState({
    showProgress: false,
  });
});

app.use(Components);

app.mount("#app");
