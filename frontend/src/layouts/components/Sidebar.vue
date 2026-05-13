<template>
  <a-menu
    :style="{ width: '100%' }"
    :default-open-keys="['goods', 'order', 'user', 'system']"
    :default-selected-keys="['dashboard']"
    mode="inline"
    theme="dark"
    @menu-item-click="handleMenuClick"
  >
    <a-menu-item key="dashboard">
      <template #icon><icon-dashboard /></template>
      仪表盘
    </a-menu-item>

    <a-sub-menu key="goods">
      <template #icon><icon-goods /></template>
      <template #title>商品管理</template>
      <a-menu-item key="goods/list">商品列表</a-menu-item>
      <a-menu-item key="goods/add">添加商品</a-menu-item>
      <a-menu-item key="goods/category">商品分类</a-menu-item>
    </a-sub-menu>

    <a-sub-menu key="order">
      <template #icon><icon-order /></template>
      <template #title>订单管理</template>
      <a-menu-item key="order/list">订单列表</a-menu-item>
    </a-sub-menu>

    <a-sub-menu key="user">
      <template #icon><icon-user /></template>
      <template #title>用户管理</template>
      <a-menu-item key="user/list">用户列表</a-menu-item>
    </a-sub-menu>

    <a-sub-menu key="system">
      <template #icon><icon-settings /></template>
      <template #title>系统设置</template>
      <a-menu-item key="system/config">系统配置</a-menu-item>
      <a-menu-item key="system/plugins">插件管理</a-menu-item>
    </a-sub-menu>
  </a-menu>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const handleMenuClick = (key: string) => {
  router.push(`/${key}`);
};
</script>
