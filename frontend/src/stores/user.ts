import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';

interface UserInfo {
  id: number;
  username: string;
  nickname: string;
  email: string;
  avatar: string;
}

export const useUserStore = defineStore('user', () => {
  const token = ref<string>(localStorage.getItem('token') || '');
  const userInfo = ref<UserInfo | null>(null);

  const login = async (username: string, password: string) => {
    const response = await axios.post('/api/auth/login', { username, password });
    const { data } = response.data;
    token.value = data.token;
    userInfo.value = data.userInfo;
    localStorage.setItem('token', data.token);
  };

  const logout = () => {
    token.value = '';
    userInfo.value = null;
    localStorage.removeItem('token');
  };

  const getUserInfo = async () => {
    if (!token.value) return;
    try {
      const response = await axios.get('/api/auth/userinfo');
      userInfo.value = response.data.data;
    } catch (error) {
      logout();
      throw error;
    }
  };

  return {
    token,
    userInfo,
    login,
    logout,
    getUserInfo,
  };
});
