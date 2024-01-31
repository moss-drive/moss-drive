import http from "@/utils/http";

const request = http;

export function fetchShare(params) {
  return request.get("/share/page", {
    params,
  });
}

export function fetchShareVaild(data) {
  return request.post("/share/validAndGet", data);
}

export function fetchShareList(params) {
  return request.post("/share/list/v2", params);
}

export function fetchStoneSave(data) {
  return request.post("/stone/save", data);
}

export function fetchUserShareList(params) {
  return request.get("/share/list/user", {
    params,
  });
}
