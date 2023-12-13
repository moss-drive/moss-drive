import http from "@/utils/http";

const request = http;

export function fetchTransaction(params) {
  return request.get("/transaction/history", {
    params,
  });
}
