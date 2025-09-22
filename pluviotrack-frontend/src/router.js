// src/router.js
import { createRouter, createWebHistory } from "vue-router";
import Home from "./views/Home.vue";
import Login from "./views/Login.vue";

const routes = [
  { path: "/", name: "home", component: Home },
  { path: "/precipitation", name: "precipitation", component: () => import("./views/Precipitation.vue") },
  { path: "/login", name: "login", component: Login, meta: { hideSidebar: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;