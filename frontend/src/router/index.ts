import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/login/index.vue'),
    meta: { title: '登录', requiresAuth: false },
  },
  {
    path: '/',
    component: () => import('@/layouts/AdminLayout.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/pages/dashboard/index.vue'),
        meta: { title: '仪表盘', icon: 'icon-dashboard' },
      },
      {
        path: 'goods',
        name: 'Goods',
        redirect: '/goods/list',
        meta: { title: '商品管理', icon: 'icon-goods' },
        children: [
          {
            path: 'list',
            name: 'GoodsList',
            component: () => import('@/pages/goods/list.vue'),
            meta: { title: '商品列表' },
          },
          {
            path: 'add',
            name: 'GoodsAdd',
            component: () => import('@/pages/goods/edit.vue'),
            meta: { title: '添加商品' },
          },
          {
            path: 'edit/:id',
            name: 'GoodsEdit',
            component: () => import('@/pages/goods/edit.vue'),
            meta: { title: '编辑商品' },
          },
          {
            path: 'category',
            name: 'GoodsCategory',
            component: () => import('@/pages/goods/category.vue'),
            meta: { title: '商品分类' },
          },
        ],
      },
      {
        path: 'order',
        name: 'Order',
        redirect: '/order/list',
        meta: { title: '订单管理', icon: 'icon-order' },
        children: [
          {
            path: 'list',
            name: 'OrderList',
            component: () => import('@/pages/order/list.vue'),
            meta: { title: '订单列表' },
          },
          {
            path: 'detail/:id',
            name: 'OrderDetail',
            component: () => import('@/pages/order/detail.vue'),
            meta: { title: '订单详情' },
          },
        ],
      },
      {
        path: 'user',
        name: 'User',
        redirect: '/user/list',
        meta: { title: '用户管理', icon: 'icon-user' },
        children: [
          {
            path: 'list',
            name: 'UserList',
            component: () => import('@/pages/user/list.vue'),
            meta: { title: '用户列表' },
          },
          {
            path: 'detail/:id',
            name: 'UserDetail',
            component: () => import('@/pages/user/detail.vue'),
            meta: { title: '用户详情' },
          },
        ],
      },
      {
        path: 'system',
        name: 'System',
        redirect: '/system/config',
        meta: { title: '系统设置', icon: 'icon-settings' },
        children: [
          {
            path: 'config',
            name: 'SystemConfig',
            component: () => import('@/pages/system/config.vue'),
            meta: { title: '系统配置' },
          },
          {
            path: 'plugins',
            name: 'SystemPlugins',
            component: () => import('@/pages/system/plugins.vue'),
            meta: { title: '插件管理' },
          },
        ],
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/pages/404.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('token');

  if (to.meta.requiresAuth !== false && !token) {
    next('/login');
  } else if (to.path === '/login' && token) {
    next('/');
  } else {
    next();
  }
});

export default router;
