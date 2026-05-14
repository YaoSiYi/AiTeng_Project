import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useUserStore } from '@/stores/user';

// 模拟 localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('User Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it('should initialize with null token', () => {
    const store = useUserStore();
    expect(store.token).toBeNull();
    expect(store.userInfo).toBeNull();
  });

  it('should initialize with token from localStorage', () => {
    localStorageMock.getItem.mockReturnValue('test-token');
    const store = useUserStore();
    expect(store.token).toBe('test-token');
  });

  it('should logout correctly', () => {
    const store = useUserStore();
    store.token = 'test-token';
    store.userInfo = {
      id: 1,
      username: 'admin',
      nickname: '管理员',
      email: 'admin@example.com',
      avatar: null,
      roleId: 1,
      roleName: '超级管理员',
      permissions: ['*'],
    };

    store.logout();

    expect(store.token).toBeNull();
    expect(store.userInfo).toBeNull();
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('token');
  });
});
