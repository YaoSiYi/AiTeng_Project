<template>
  <div>
    <a-typography-title :level="4">系统配置</a-typography-title>
    <a-form :model="config" layout="vertical">
      <a-form-item label="站点名称">
        <a-input v-model="config.siteName" />
      </a-form-item>
      <a-form-item label="站点描述">
        <a-textarea v-model="config.siteDescription" />
      </a-form-item>
      <a-form-item>
        <a-button type="primary">保存配置</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const config = ref({
  siteName: 'TPshop',
  siteDescription: 'TPshop 管理系统',
});
</script>
