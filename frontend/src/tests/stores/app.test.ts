import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useAppStore } from '@/stores/app';

describe('App Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('should initialize with default values', () => {
    const store = useAppStore();
    expect(store.sidebarCollapsed).toBe(false);
    expect(store.theme).toBe('light');
    expect(store.locale).toBe('zh-CN');
  });

  it('should toggle sidebar', () => {
    const store = useAppStore();
    expect(store.sidebarCollapsed).toBe(false);

    store.toggleSidebar();
    expect(store.sidebarCollapsed).toBe(true);

    store.toggleSidebar();
    expect(store.sidebarCollapsed).toBe(false);
  });

  it('should set theme', () => {
    const store = useAppStore();
    expect(store.theme).toBe('light');

    store.setTheme('dark');
    expect(store.theme).toBe('dark');

    store.setTheme('light');
    expect(store.theme).toBe('light');
  });
});
