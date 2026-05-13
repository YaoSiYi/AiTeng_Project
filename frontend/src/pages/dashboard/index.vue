<template>
  <div class="dashboard">
    <a-row :gutter="16">
      <a-col :span="6">
        <a-card class="stat-card">
          <a-statistic
            title="总订单数"
            :value="stats.totalOrders"
            :value-style="{ color: '#1890ff' }"
          >
            <template #prefix><icon-order /></template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card class="stat-card">
          <a-statistic
            title="待付款"
            :value="stats.pendingPayment"
            :value-style="{ color: '#faad14' }"
          >
            <template #prefix><icon-clock-circle /></template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card class="stat-card">
          <a-statistic
            title="待发货"
            :value="stats.pendingShipment"
            :value-style="{ color: '#fa8c16' }"
          >
            <template #prefix><icon-send /></template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card class="stat-card">
          <a-statistic
            title="已完成"
            :value="stats.completed"
            :value-style="{ color: '#52c41a' }"
          >
            <template #prefix><icon-check-circle /></template>
          </a-statistic>
        </a-card>
      </a-col>
    </a-row>

    <a-row :gutter="16" style="margin-top: 16px;">
      <a-col :span="12">
        <a-card title="系统信息">
          <a-descriptions :column="1">
            <a-descriptions-item label="管理员数量">{{ systemInfo.adminCount }}</a-descriptions-item>
            <a-descriptions-item label="用户数量">{{ systemInfo.userCount }}</a-descriptions-item>
            <a-descriptions-item label="商品数量">{{ systemInfo.goodsCount }}</a-descriptions-item>
            <a-descriptions-item label="订单数量">{{ systemInfo.orderCount }}</a-descriptions-item>
          </a-descriptions>
        </a-card>
      </a-col>
      <a-col :span="12">
        <a-card title="快捷操作">
          <a-space direction="vertical" fill>
            <a-button type="primary" long @click="$router.push('/goods/add')">添加商品</a-button>
            <a-button long @click="$router.push('/order/list')">查看订单</a-button>
            <a-button long @click="$router.push('/user/list')">用户管理</a-button>
          </a-space>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';

const stats = ref({
  totalOrders: 0,
  pendingPayment: 0,
  pendingShipment: 0,
  completed: 0,
});

const systemInfo = ref({
  adminCount: 0,
  userCount: 0,
  goodsCount: 0,
  orderCount: 0,
});

onMounted(async () => {
  try {
    const [statsRes, infoRes] = await Promise.all([
      axios.get('/api/orders/statistics'),
      axios.get('/api/system/info'),
    ]);
    stats.value = statsRes.data.data;
    systemInfo.value = infoRes.data.data;
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error);
  }
});
</script>

<style scoped>
.stat-card {
  text-align: center;
}
</style>
