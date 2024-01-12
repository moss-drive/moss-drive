import http from "@/utils/http";

const request = http;

export function fetchPoint(params) {
  return request.get("/activities/point/overview", {
    params,
  });
}

export function fetchShareVaild(data) {
  return request.post("/share/validAndGet", data);
}

export function fetchShareList(params) {
  return request.get("/share/list", {
    params,
  });
}

export function fetchStoneSave(data) {
  return request.post("/stone/save", data);
}

export function fetchUserShareList(params) {
  return request.get("/share/list/user", {
    params,
  });
}
