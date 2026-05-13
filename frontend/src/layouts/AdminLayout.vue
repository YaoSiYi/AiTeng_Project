<template>
  <a-layout class="layout">
    <a-layout-sider
      v-model:collapsed="collapsed"
      :trigger="null"
      collapsible
      breakpoint="lg"
      :width="220"
      class="layout-sider"
    >
      <div class="logo">
        <h1 v-if="!collapsed">TPshop</h1>
        <h1 v-else>TP</h1>
      </div>
      <Sidebar />
    </a-layout-sider>
    <a-layout>
      <a-layout-header class="layout-header">
        <Header v-model:collapsed="collapsed" />
      </a-layout-header>
      <a-layout-content class="layout-content">
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Sidebar from './components/Sidebar.vue';
import Header from './components/Header.vue';
import { useUserStore } from '@/stores/user';

const collapsed = ref(false);
const userStore = useUserStore();

onMounted(async () => {
  if (userStore.token && !userStore.userInfo) {
    await userStore.getUserInfo();
  }
});
</script>

<style scoped>
.layout {
  height: 100vh;
}

.layout-sider {
  background: #001529;
}

.logo {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.logo h1 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.layout-header {
  background: #fff;
  padding: 0 24px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.layout-content {
  margin: 24px;
  padding: 24px;
  background: #fff;
  border-radius: 4px;
  overflow-y: auto;
}
</style>
