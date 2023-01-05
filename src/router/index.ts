import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: () => import("@/views/home.vue"),
    children: [],
  },
  {
    path: "/hall",
    name: "hall",
    component: () => import("@/views/hall/hall.vue"),
    children: [],
  },
  {
    path: "/hallImage",
    name: "hallImage",
    component: () => import("@/views/hallImage/hallImage.vue"),
    children: [],
  },
  {
    path: "/hallDetail/:id",
    name: "hallDetail",
    component: () => import("@/views/hallDetail/hallDetail.vue"),
    children: [],
  },
  {
    path: "/pano",
    name: "pano",
    component: () => import("@/views/pano/pano.vue"),
    children: [],
  },
  {
    path: "/story",
    name: "story",
    component: () => import("@/views/story/story.vue"),
    children: [],
  },
  {
    path: "/storyDetail/:id",
    name: "storyDetail",
    component: () => import("@/views/story/storyDetail.vue"),
    children: [],
  },
];
const routerHistory = createWebHashHistory();
const router = createRouter({
  history: routerHistory,
  routes,
});
//全局后置守卫
router.afterEach((to, from, failure) => {
  console.log(location.href);
  console.log(window.parent);
  if (window.parent != window.self && from.fullPath !== "/") {
    window.parent.postMessage({ url: location.href }, "*");
    localStorage.setItem("url", to.fullPath);
  }
});
export default router;
