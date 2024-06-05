import { BigNumber } from "ethers";

export function getFileSize(byte, isObj = false, fix = 2) {
  if (!byte && byte !== 0 && !isObj) {
    return byte;
  }
  const mb = Math.pow(1024, 2);
  const gb = Math.pow(1024, 3);
  const tb = Math.pow(1024, 4);
  let num = byte;
  let unit = "B";
  if (byte >= tb) {
    num = byte / tb;
    unit = "TB";
  } else if (byte >= gb) {
    num = byte / gb;
    unit = "GB";
  } else if (byte >= mb) {
    num = byte / mb;
    unit = "MB";
  } else if (byte >= 1024 || byte < 0.01) {
    num = byte / 1024;
    unit = "KB";
  } else if (byte > 0) {
    num = parseInt(byte);
  }
  if (unit != "B") {
    num = num.toFixed(fix);
  }
  if (num) num = (num + "").replace(".00", "");
  if (isObj)
    return {
      num,
      unit,
    };
  return num + " " + unit;
}

export async function limitTask(list, handler, limit = 5) {
  const sequence = [].concat(list);
  let tasks = [];
  let err = false;
  const getTask = (it, index) => {
    return handler(it)
      .then(() => {
        return index;
      })
      .catch((e) => {
        err = e;
      });
  };
  tasks = sequence.splice(0, limit).map(getTask);
  let race = Promise.race(tasks);
  for (const it of sequence) {
    if (err) throw err;
    const index = await race;
    tasks[index] = getTask(it, index);
    race = Promise.race(tasks);
  }
}

let dbcTimeout = null;

export function debounce(func, wait = 500, immediate = false) {
  if (dbcTimeout !== null) clearTimeout(dbcTimeout);
  if (immediate) {
    var callNow = !dbcTimeout;
    dbcTimeout = setTimeout(function () {
      dbcTimeout = null;
    }, wait);
    if (callNow) typeof func === "function" && func();
  } else {
    dbcTimeout = setTimeout(function () {
      typeof func === "function" && func();
    }, wait);
  }
}

export function formatLand(land, isObj = false, isOrigin = true) {
  let formatVal = BigNumber.from(land);
  if (isOrigin) {
    formatVal = formatVal.div((1e18).toString());
  }
  let unit = "";
  const k = BigNumber.from(1e5);
  const m = BigNumber.from(1e8);
  const b = BigNumber.from(1e14);
  const t = BigNumber.from((1e16).toString());
  const thanT = BigNumber.from("1000000000000000000000");

  if (formatVal.gte(thanT)) {
    formatVal = "> 99999";
    unit = "T";
  } else if (formatVal.gte(t)) {
    formatVal = formatVal.div(BigNumber.from(1e12)).toString();
    unit = "T";
  } else if (formatVal.gte(b)) {
    formatVal = formatVal.div(BigNumber.from(1e8)).toString();
    unit = "B";
  } else if (formatVal.gte(m)) {
    formatVal = formatVal.div(BigNumber.from(1e6)).toString();
    unit = "M";
  } else if (formatVal.gte(k)) {
    formatVal = formatVal.div(BigNumber.from(1e3)).toString();
    unit = "K";
  } else {
    formatVal = formatVal.toString();
  }

  if (isObj) {
    return {
      land: formatVal,
      unit,
    };
  }
  return formatVal + " " + unit;
}

export function uid2euid(input) {
  function hexStringToByteArray(input) {
    let bytes = [];
    for (let i = 0; i < input.length; i += 2) {
      bytes.push(parseInt(input.substring(i, i + 2), 16));
    }
    return bytes;
  }

  function bytesToHex(input) {
    let hex = "";
    for (let i = 0; i < input.length; i++) {
      let byte = input[i];
      hex += byte.toString(16).padStart(2, "0");
    }
    return hex;
  }

  let b = false;
  if (input.startsWith("0x")) {
    input = input.substring(2);
    b = true;
  }
  if (input.length >= 64) {
    throw new Error("illegal input string");
  }
  let bytes = hexStringToByteArray(input);
  let padding = new Array(32);
  padding.fill(0);
  padding.splice(0, bytes.length, ...bytes);
  padding[31] = b ? bytes.length + 32 : bytes.length;
  return "0x" + bytesToHex(padding);
}

let inDev = process.env.NODE_ENV != "production";

export const getTxLink = (hash, net = "Polygon") => {
  let pre = inDev ? "https://sepolia.etherscan.io/tx/" : "https://etherscan.io/tx/";
  if (net == "BSC") {
    pre = inDev ? "https://testnet.bscscan.com/tx/" : "https://bscscan.com/tx/";
  } else if (net == "Polygon") {
    pre = inDev ? "https://mumbai.polygonscan.com/tx/" : "https://polygonscan.com/tx/";
  } else if (net == "zkSync") {
    pre = inDev ? "https://goerli.explorer.zksync.io/tx/" : "https://explorer.zksync.io/tx/";
  } else if (net == "Optimism") {
    pre = "https://optimistic.etherscan.io/tx/";
  } else if (net == "Scroll") {
    pre = "https://scrollscan.com/tx/";
  } else if (net == "Blast") {
    pre = " https://blastscan.io/tx/";
  } else if (net == "OpBNB") {
    pre = " https://opbnbscan.com/tx/";
  }
  return pre + hash;
};
