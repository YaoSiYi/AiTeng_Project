<template>
  <div>
    <a-typography-title :level="4">订单详情</a-typography-title>
    <a-descriptions :column="2" bordered>
      <a-descriptions-item label="订单号">{{ order.orderNo }}</a-descriptions-item>
      <a-descriptions-item label="状态">{{ order.status }}</a-descriptions-item>
      <a-descriptions-item label="用户">{{ order.username }}</a-descriptions-item>
      <a-descriptions-item label="金额">{{ order.amount }}</a-descriptions-item>
    </a-descriptions>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const order = ref({
  orderNo: '',
  status: '',
  username: '',
  amount: 0,
});
</script>
