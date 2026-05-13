<template>
  <div class="header">
    <div class="header-left">
      <a-button
        type="text"
        @click="$emit('update:collapsed', !collapsed)"
      >
        <template #icon>
          <icon-menu-fold v-if="!collapsed" />
          <icon-menu-unfold v-else />
        </template>
      </a-button>
    </div>
    <div class="header-right">
      <a-dropdown>
        <a-button type="text">
          <a-avatar :size="24">
            <icon-user />
          </a-avatar>
          <span class="username">{{ userStore.userInfo?.nickname || '管理员' }}</span>
        </a-button>
        <template #content>
          <a-doption @click="handleLogout">退出登录</a-doption>
        </template>
      </a-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { Message } from '@arco-design/web-vue';

defineProps<{
  collapsed: boolean;
}>();

defineEmits<{
  'update:collapsed': [value: boolean];
}>();

const router = useRouter();
const userStore = useUserStore();

const handleLogout = () => {
  userStore.logout();
  Message.success('退出成功');
  router.push('/login');
};
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}

.header-left,
.header-right {
  display: flex;
  align-items: center;
}

.username {
  margin-left: 8px;
}
</style>
