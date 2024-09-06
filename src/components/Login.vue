<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <el-form
    ref="ruleFormRef"
    style="max-width: 600px"
    :model="ruleForm"
    status-icon
    :rules="rules"
    label-width="auto"
    class="demo-ruleForm"
  >
    <el-form-item label="Email" prop="email">
      <el-input v-model.number="ruleForm.email" />
    </el-form-item>
    <el-form-item>
      <el-form-item label="Password" prop="password">
        <el-input
          v-model="ruleForm.password"
          type="password"
          autocomplete="off"
        />
      </el-form-item>
      <el-button type="primary" @click="submitForm(ruleFormRef)">
        Login
        <el-icon v-if="loading" class="el-icon--right">
          <Loading />
        </el-icon>
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { Loading } from "@element-plus/icons-vue";

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
      console.log("dispatching login");
      store
        .dispatch("auth/login")
        .then(() => {
          console.log("redirecting to home");
          router.push("/");
        })
        .finally(() => {
          loading.value = false;
        });
    } else {
      alert("error submit!");
    }
  });
};
</script>
