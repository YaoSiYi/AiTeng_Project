<template>
  <div>
    <a-typography-title :level="4">用户详情</a-typography-title>
    <a-descriptions :column="2" bordered>
      <a-descriptions-item label="用户名">{{ user.username }}</a-descriptions-item>
      <a-descriptions-item label="昵称">{{ user.nickname }}</a-descriptions-item>
      <a-descriptions-item label="邮箱">{{ user.email }}</a-descriptions-item>
      <a-descriptions-item label="注册时间">{{ user.createdAt }}</a-descriptions-item>
    </a-descriptions>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const user = ref({
  username: '',
  nickname: '',
  email: '',
  createdAt: '',
});
</script>
