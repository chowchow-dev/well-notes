<script setup>
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { computed } from "vue";

const store = useStore();
const router = useRouter();

const isAuthenticated = computed(() => store.getters["auth/isAuthenticated"]);
const username = computed(() => store.getters["auth/username"]);

const handleLogout = () => {
  store.dispatch("auth/logout").then(() => {
    router.push("/login");
  });
};
</script>

<template>
  <div class="profile-container">
    <div v-if="isAuthenticated" :class="$style.profileContent">
      <h1 :class="$style.welcomeMessage">Welcome, {{ username }}</h1>
      <button :class="$style.logoutButton" @click="handleLogout">Logout</button>
    </div>
  </div>
</template>

<style module>
.profileContainer {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

.logoutButton {
  background-color: #f44336;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.logoutButton:hover {
  background-color: #d32f2f;
}
</style>
