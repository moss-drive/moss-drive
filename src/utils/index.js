import "./extend";
import bucket from "./bucket";
import http from "./http";
import { getNetItem } from "./wallet";
import { EventBus, copyToClipboard } from "quasar";
import { utils } from "ethers";
const { VITE_BASE_URL } = import.meta.env;

export default {
  install(app) {
    const global = app.config.globalProperties;
    global.$bucket = bucket;
    global.$http = http;
    global.$formatEther = (val) => {
      return (utils.formatEther(val) * 1).toFixed(5);
    };
    global.$genNonce = (len = 4) => {
      return Math.random().toString(36).slice(-len);
    };
    global.$copy = async (txt, msg = "Copied") => {
      await copyToClipboard(txt);
      if (msg) window.$toast(msg, 1);
    };
    global.$getStoneLink = (it) => {
      return `/${it.stoneId}?chainId=${it.chainId}`;
    };
    global.$getShareLink = (id) => {
      return `${location.origin}/s/${id}`;
    };
    global.$getNetItem = getNetItem;
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
