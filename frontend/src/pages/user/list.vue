<template>
  <div>
    <a-typography-title :level="4">用户列表</a-typography-title>
    <a-table :columns="columns" :data="data" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const columns = [
  { title: 'ID', dataIndex: 'id' },
  { title: '用户名', dataIndex: 'username' },
  { title: '昵称', dataIndex: 'nickname' },
  { title: '邮箱', dataIndex: 'email' },
  { title: '注册时间', dataIndex: 'createdAt' },
];

const data = ref([]);
</script>
