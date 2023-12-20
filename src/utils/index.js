import "./extend";
import bucket from "./bucket";
import http from "./http";
import { EventBus } from "quasar";
import { utils } from "ethers";
const { VITE_BASE_URL } = import.meta.env;

export default {
  install(app) {
    const global = app.config.globalProperties;
    global.$bucket = bucket;
    global.$http = http;
    global.$ethUtils = utils;
    global.$genNonce = (len = 4) => {
      return Math.random().toString(36).slice(-len);
    };
    global.$getShareLink = (id) => {
      return `${location.origin}/s/${id}`;
    };
    global.$inDev = /foreverland/.test(VITE_BASE_URL);

    global.$openLink = (url) => {
      window.open(url);
    };

    const bus = new EventBus();
    global.$bus = bus;

    for (const func of ["toast", "alert", "confirm", "prompt", "loading", "loadingClose"]) {
      global["$" + func] = (...args) => {
        return window["$" + func](...args);
      };
    }
  },
};
