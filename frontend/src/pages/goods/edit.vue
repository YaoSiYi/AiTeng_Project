<template>
  <div>
    <a-typography-title :level="4">{{ isEdit ? '编辑商品' : '添加商品' }}</a-typography-title>
    <a-form :model="form" layout="vertical">
      <a-form-item label="商品名称">
        <a-input v-model="form.name" placeholder="请输入商品名称" />
      </a-form-item>
      <a-form-item label="价格">
        <a-input-number v-model="form.price" placeholder="请输入价格" />
      </a-form-item>
      <a-form-item label="库存">
        <a-input-number v-model="form.stock" placeholder="请输入库存" />
      </a-form-item>
      <a-form-item>
        <a-button type="primary">保存</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const isEdit = computed(() => !!route.params.id);

const form = ref({
  name: '',
  price: 0,
  stock: 0,
});
</script>
