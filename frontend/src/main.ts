import { createApp } from 'vue';
import { createPinia } from 'pinia';
import ArcoVue from '@arco-design/web-vue';
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
import axios from 'axios';
import App from './App.vue';
import router from './router';
import '@arco-design/web-vue/dist/arco.css';
import './styles/global.css';

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(ArcoVue);
app.use(ArcoVueIcon);

app.mount('#app');
