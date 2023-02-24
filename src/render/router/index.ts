import { createRouter, RouteRecordRaw, createWebHashHistory } from "vue-router";
type RouterCustorm = {
  hidden?: boolean;
};
export const constantRouterMap: (RouteRecordRaw | RouterCustorm)[] = [
  {
    path: "/login",
    name: "Login",
    hidden: true,
    component: () => import("@/render/views/login/Index.vue"),
  },
  {
    path: "/load",
    name: "Load",
    hidden: true,
    component: () => import("@/render/views/load/Index.vue"),
  },
  {
    path: "/",
    name: "Index",
    hidden: true,
    component: () => import("@/render/views/index/Index.vue"),
  },
  {
    path: "/cut",
    name: "Cut",
    hidden: true,
    component: () => import("@/render/views/cut/Index.vue"),
  },
];
const router = createRouter({
  history: createWebHashHistory(import.meta.env.VITE_BASE_PATH),
  routes: constantRouterMap as RouteRecordRaw[],
  scrollBehavior: () => ({ left: 0, top: 0 }),
});

export default router;
