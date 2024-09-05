<script setup>
import { inject } from "vue";
import { useRouter } from "vue-router";

const auth = inject("authentication");
const router = useRouter();

const logout = () => {
  auth?.updateAuthentication(false);
  router.push("/login");
};
</script>

<template>
  <p><strong>Current route path:</strong> {{ $route.fullPath }}</p>
  <nav>
    <RouterLink to="/">Go to app</RouterLink>
    <RouterLink to="/login">Go to login</RouterLink>
    <button v-if="auth.isAuthenticated.value" @click="logout">Logout</button>
  </nav>
  <main>
    <RouterView />
  </main>
</template>
