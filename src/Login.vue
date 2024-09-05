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
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { reactive, ref, inject } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { useRouter } from "vue-router";

const router = useRouter();

const auth = inject("authentication") as
  | { updateAuthentication: (value: boolean) => void }
  | undefined;

const ruleFormRef = ref<FormInstance>();

const validateEmail = (rule: any, value: any, callback: any) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!value) {
    callback(new Error("Please input an email address"));
  } else if (!emailRegex.test(value)) {
    callback(new Error("Please input a valid email address"));
  } else {
    callback();
  }
};

const validatePassword = (rule: any, value: any, callback: any) => {
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

const rules = reactive<FormRules<typeof ruleForm>>({
  email: [{ validator: validateEmail, trigger: "blur" }],
  password: [{ validator: validatePassword, trigger: "blur" }],
});

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  const test = {
    email: "test@test.com",
    password: "test",
  };

  const isCorrectFormValues =
    test.email === ruleForm.email && test.password === ruleForm.password;
  formEl.validate((valid) => {
    if (valid && isCorrectFormValues) {
      if (auth && typeof auth === "object" && "updateAuthentication" in auth) {
        (
          auth as { updateAuthentication: (value: boolean) => void }
        ).updateAuthentication(true);
        router.push("/");
      } else {
        console.error("Authentication object or method not available");
      }
    } else {
      alert("error submit!");
    }
  });
};
</script>
