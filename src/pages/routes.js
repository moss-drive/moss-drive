import PageLogin from "./login/page-login.vue";

const routes = [
  {
    path: "/login",
    component: PageLogin, //import("./login/page-login.vue"),
  },
  {
    path: "/",
    component: () => import("./home-page.vue"),
    meta: {
      noUid: 1,
    },
  },
  {
    path: "/",
    component: () => import("../layouts/main-layout.vue"),
    children: [
      {
        path: "drive/:catchAll(.*)*",
        component: () => import("./drive/page-drive.vue"),
        meta: {
          title: "My Drive",
        },
      },
      {
        path: "/stone",
        component: () => import("./stone/page-stone.vue"),
        meta: {
          title: "My Stones",
        },
      },
      {
        path: "/collection",
        component: () => import("./stone/page-collection.vue"),
        meta: {
          title: "My Collections",
        },
      },
      {
        path: "/resource",
        component: () => import("./resource/page-resource.vue"),
        meta: {
          title: "My Resources",
        },
      },
      {
        path: "/txs",
        component: () => import("./myTXS/page-txs.vue"),
        meta: {
          title: "My TXS",
        },
      },
    ],
  },
  {
    path: "/mossy",
    component: () => import("../layouts/mossy-layout.vue"),
    children: [
      {
        path: "",
        component: () => import("./mossy/page-explore.vue"),
      },
      {
        path: "stone",
        component: () => import("./mossy/stone/page-stone.vue"),
      },
      {
        path: "collected",
        component: () => import("./mossy/page-collected.vue"),
      },
    ],
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("./ErrorNotFound.vue"),
  },
];

export default routes;
