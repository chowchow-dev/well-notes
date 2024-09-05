import { createRouter } from "vue-router";
import { inject } from "vue";

import Home from "./Home.vue";
import Login from "./Login.vue";
import { createWebHistory } from "vue-router";

const routes = [
  { path: "/", name: "home", component: Home },
  { path: "/login", name: "login", component: Login },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const auth = inject("authentication");
  if (to.name !== "login" && !auth.isAuthenticated.value) {
    console.log("redirecting to login");
    next({ name: "login" });
  } else if (to.name === "login" && auth.isAuthenticated.value) {
    console.log("redirecting to home");
    next({ name: "home" });
  } else next();
});
export default router;
