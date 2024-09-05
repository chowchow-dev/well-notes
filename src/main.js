import { createApp } from "vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import App from "./App.vue";
import "./main.css";
import router from "./router";

import { ref } from "vue";

const app = createApp(App);

const isAuthenticated = ref(false);
const updateAuthentication = (value) => {
  isAuthenticated.value = value;
};

app.provide("authentication", {
  isAuthenticated,
  updateAuthentication,
});

app.use(router);
app.use(ElementPlus);

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.mount("#app");
