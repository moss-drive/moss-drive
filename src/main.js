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

router.beforeEach((to, _, next) => {
  setState({
    showProgress: true,
  });
  next();
});
router.afterEach((to) => {
  if (/^\/(mossy|\d+)$/.test(to.path)) {
    document.title = "Mossyland - Moss";
    const $icon = document.querySelector('link[rel="icon"]');
    $icon?.setAttribute("href", "/img/mossy.png");
  } else if (/\/s\//.test(to.path)) {
    document.title = "Save - Moss";
  }
  setState({
    showProgress: false,
  });
});

app.use(Components);

app.mount("#app");
