import { createRouter } from "vue-router";

import Home from "./Home.vue";
import Login from "./Login.vue";
import { createMemoryHistory } from "vue-router";

const routes = [
  { path: "/", component: Home },
  { path: "/login", component: Login },
];

const router = createRouter({
  history: createMemoryHistory(),
  routes,
});

export default router;
