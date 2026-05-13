<template>
  <div>
    <a-typography-title :level="4">商品列表</a-typography-title>
    <a-table :columns="columns" :data="data" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const columns = [
  { title: 'ID', dataIndex: 'id' },
  { title: '商品名称', dataIndex: 'name' },
  { title: '价格', dataIndex: 'price' },
  { title: '库存', dataIndex: 'stock' },
  { title: '状态', dataIndex: 'status' },
];

const data = ref([]);
</script>
