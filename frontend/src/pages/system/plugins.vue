<template>
  <div>
    <a-typography-title :level="4">插件管理</a-typography-title>
    <a-table :columns="columns" :data="data" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const columns = [
  { title: '插件名称', dataIndex: 'name' },
  { title: '版本', dataIndex: 'version' },
  { title: '状态', dataIndex: 'status' },
  { title: '描述', dataIndex: 'description' },
];

const data = ref([]);
</script>
