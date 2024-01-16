import http from "@/utils/http";

const request = http;

export function fetchPoint() {
  return request.get("/activities/point/overview");
}

export function fetchDailyList() {
  return request.get("/activities/daily");
}

export function fetchAchievementsList() {
  return request.get("/activities/achievements");
}

export function fetchNext(id) {
  return request.get(`/activities/${id}/next`);
}
