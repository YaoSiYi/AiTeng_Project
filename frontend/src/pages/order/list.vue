<template>
  <div>
    <a-typography-title :level="4">订单列表</a-typography-title>
    <a-table :columns="columns" :data="data" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const columns = [
  { title: '订单号', dataIndex: 'orderNo' },
  { title: '用户', dataIndex: 'username' },
  { title: '金额', dataIndex: 'amount' },
  { title: '状态', dataIndex: 'status' },
  { title: '创建时间', dataIndex: 'createdAt' },
];

const data = ref([]);
</script>
