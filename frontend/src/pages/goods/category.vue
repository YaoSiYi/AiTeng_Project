<template>
  <div>
    <a-typography-title :level="4">商品分类</a-typography-title>
    <a-table :columns="columns" :data="data" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const columns = [
  { title: 'ID', dataIndex: 'id' },
  { title: '分类名称', dataIndex: 'name' },
  { title: '排序', dataIndex: 'sort' },
];

const data = ref([]);
</script>
