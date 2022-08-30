import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", redirect: "/totp" },
    {
      path: "/totp",
      name: "TOTPMain",
      component: () => import("@/components/TOTPMain.vue"),
    },
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: () => import("@/components/NotFound.vue"),
    },
  ],
});

export default router;
