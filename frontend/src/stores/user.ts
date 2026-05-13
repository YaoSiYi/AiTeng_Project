import { defineStore } from 'pinia';
import { ref } from 'vue';
import { typedPost, typedGet } from '@/utils/request';

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

interface LoginData {
  token: string;
  user: UserInfo;
}

export const useUserStore = defineStore('user', () => {
  const token = ref<string | null>(localStorage.getItem('token'));
  const userInfo = ref<UserInfo | null>(null);

  const login = async (username: string, password: string) => {
    const res = await typedPost<LoginData>('/auth/login', { username, password });
    token.value = res.data.token;
    userInfo.value = res.data.user;
    localStorage.setItem('token', res.data.token);
  };

  const getUserInfo = async () => {
    try {
      const res = await typedGet<UserInfo>('/auth/userinfo');
      userInfo.value = res.data;
    } catch (error) {
      logout();
      throw error;
    }
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
