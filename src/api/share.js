import http from "@/utils/http";

const request = http;

export function fetchShare(params) {
  return request.get("/share/page", {
    params,
  });
}

export function fetchShareVaild(data) {
  return request.post("/share/validAndGet", {
    data,
  });
}
