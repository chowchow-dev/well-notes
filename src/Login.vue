<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref } from "vue";
import { ElForm, ElFormItem, ElInput, ElButton } from "element-plus";

const username = ref("");
const password = ref("");

const handleLogin = () => {
  // TODO: Implement login logic
  console.log("Login attempt:", username.value, password.value);
};
</script>

<template>
  <div class="login-container">
    <h2>Login</h2>
    <el-form>
      <el-form-item label="Username">
        <el-input v-model="username" />
      </el-form-item>
      <el-form-item label="Password">
        <el-input v-model="password" type="password" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleLogin">Login</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped></style>
