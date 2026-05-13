<template>
  <div class="login-container">
    <div class="login-card">
      <h2 class="login-title">TPshop 管理系统</h2>
      <a-form
        ref="formRef"
        :model="form"
        :rules="rules"
        layout="vertical"
        @submit-success="handleLogin"
      >
        <a-form-item field="username" label="用户名">
          <a-input
            v-model="form.username"
            placeholder="请输入用户名"
            size="large"
          >
            <template #prefix><icon-user /></template>
          </a-input>
        </a-form-item>
        <a-form-item field="password" label="密码">
          <a-input-password
            v-model="form.password"
            placeholder="请输入密码"
            size="large"
          >
            <template #prefix><icon-lock /></template>
          </a-input-password>
        </a-form-item>
        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            size="large"
            long
            :loading="loading"
          >
            登录
          </a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { Message } from '@arco-design/web-vue';
import { useUserStore } from '@/stores/user';

const router = useRouter();
const userStore = useUserStore();
const loading = ref(false);

const form = reactive({
  username: '',
  password: '',
});

const rules = {
  username: [{ required: true, message: '请输入用户名' }],
  password: [{ required: true, message: '请输入密码' }],
};

const handleLogin = async () => {
  loading.value = true;
  try {
    await userStore.login(form.username, form.password);
    Message.success('登录成功');
    router.push('/');
  } catch (error: any) {
    Message.error(error.message || '登录失败');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(135deg, #1890ff 0%, #722ed1 100%);
}

.login-card {
  width: 400px;
  padding: 40px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.login-title {
  text-align: center;
  margin-bottom: 32px;
  color: #333;
  font-size: 24px;
}
</style>
