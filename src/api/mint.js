import http from "@/utils/http";

const request = http;

export function fetchNftNum(params) {
  return request.get("/nfts/phase", {
    params,
  });
}
