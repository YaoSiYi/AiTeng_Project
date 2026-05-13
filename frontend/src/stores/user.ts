import { defineStore } from 'pinia';
import { ref } from 'vue';
import request from '@/utils/request';

interface UserInfo {
  id: number;
  username: string;
  nickname: string | null;
  email: string | null;
  avatar: string | null;
  roleId: number;
  roleName: string;
  permissions: string[];
}

export const useUserStore = defineStore('user', () => {
  const token = ref<string | null>(localStorage.getItem('token'));
  const userInfo = ref<UserInfo | null>(null);

  const login = async (username: string, password: string) => {
    const res: any = await request.post('/auth/login', { username, password });
    token.value = res.data.token;
    userInfo.value = res.data.user;
    localStorage.setItem('token', res.data.token);
  };

  const getUserInfo = async () => {
    const res: any = await request.get('/auth/userinfo');
    userInfo.value = res.data;
  };

  const logout = () => {
    token.value = null;
    userInfo.value = null;
    localStorage.removeItem('token');
  };

  return {
    token,
    userInfo,
    login,
    getUserInfo,
    logout,
  };
});
