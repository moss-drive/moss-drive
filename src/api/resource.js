import http from "@/utils/http";

const request = http;

export function fetchLand() {
  return request.get("$pay/assets");
}

export function fetchPrice() {
  return request.get("$pay/common/price");
}

export function fetchUsage() {
  return request.get("$pay/combo/user/list");
}

export function fetchBillList(page, size = 20) {
  return request.get("$pay//assets/record/list", {
    params: {
      page,
      size,
    },
  });
}
