<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { Message, Lock } from "@element-plus/icons-vue";

const store = useStore();
const router = useRouter();

const ruleFormRef = ref();
const loading = ref(false);

const validateEmail = (rule, value, callback) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!value) {
    callback(new Error("Please input an email address"));
  } else if (!emailRegex.test(value)) {
    callback(new Error("Please input a valid email address"));
  } else {
    callback();
  }
};

const validatePassword = (rule, value, callback) => {
  if (!value) {
    callback(new Error("Please input a password"));
  } else if (value.length < 4) {
    callback(new Error("Password must be at least 4 characters long"));
  } else {
    callback();
  }
};

const ruleForm = reactive({
  email: "",
  password: "",
});

const rules = reactive({
  email: [{ validator: validateEmail, trigger: "blur" }],
  password: [{ validator: validatePassword, trigger: "blur" }],
});

const submitForm = (formEl) => {
  if (!formEl) return;

  formEl.validate((valid) => {
    if (valid) {
      loading.value = true;
      store
        .dispatch("auth/login")
        .then(() => {
          router.push("/");
        })
        .finally(() => {
          loading.value = false;
        });
    } else {
      console.error("error submit!");
    }
  });
};
</script>

<template>
  <el-card class="login-card">
    <template #header>
      <h2 class="login-title">Login</h2>
    </template>
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-position="top"
      @submit.prevent="submitForm(ruleFormRef)"
    >
      <el-form-item label="Email" prop="email">
        <el-input v-model="ruleForm.email" placeholder="Enter your email">
          <template #prefix>
            <el-icon><Message /></el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="Password" prop="password">
        <el-input
          v-model="ruleForm.password"
          type="password"
          placeholder="Enter your password"
          show-password
        >
          <template #prefix>
            <el-icon><Lock /></el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          native-type="submit"
          :loading="loading"
          :disabled="loading"
          class="login-button"
        >
          {{ loading ? "Logging in..." : "Login" }}
        </el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<style scoped>
.login-card {
  max-width: 400px;
  margin: 2rem auto;
}

.login-title {
  text-align: center;
  margin: 0;
  color: #409eff;
}

.login-button {
  width: 100%;
}
</style>
