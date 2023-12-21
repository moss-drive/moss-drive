import http from "@/utils/http";

const request = http;

export function fetchCollections(params) {
  return request.get("/stone/collections", {
    params,
  });
}
