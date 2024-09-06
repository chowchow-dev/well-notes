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
    <div v-if="isAuthenticated">
      <h1>Welcome, {{ username }}</h1>
      <button @click="handleLogout">Logout</button>
    </div>
  </div>
</template>

<style scoped>
.profile-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

button {
  background-color: #f44336;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background-color: #d32f2f;
}
</style>
