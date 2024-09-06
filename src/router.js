import { createRouter } from "vue-router";

import Home from "./components/notes/index.vue";
import Login from "./components/Login.vue";
import { createWebHistory } from "vue-router";
import { useStore } from "vuex";

const routes = [
  { path: "/", name: "home", component: Home },
  { path: "/login", name: "login", component: Login },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// global guard
router.beforeEach(async (to, from, next) => {
  const store = useStore();
  await store.dispatch("auth/getMe");
  if (to.name !== "login" && !store.getters["auth/isAuthenticated"]) {
    next({ name: "login" });
  } else if (to.name === "login" && store.getters["auth/isAuthenticated"]) {
    next({ name: "home" });
  } else next();
});
export default router;
