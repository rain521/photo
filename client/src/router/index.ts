import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue'),
    meta: {
      title: '登录'
    }
  },
  {
    path: '/',
    name: 'home',
    component: () => import('../views/home/index.vue'),
    meta: {
      title: '首页'
    }
  },
  {
    path: '/demo1',
    name: 'demo1',
    component: () => import('../views/demo1.vue'),
    meta: {
      title: 'Demo1'
    }
  },
  {
    path: '/demo2',
    name: 'demo2',
    component: () => import('../views/demo2.vue'),
    meta: {
      title: 'Demo2 - 首页'
    }
  },
  {
    path: '/demo3',
    name: 'demo3',
    component: () => import('../views/demo3.vue'),
    meta: {
      title: 'Demo3 - 首页'
    }
  },
  {
    path: '/demo4',
    name: 'demo4',
    component: () => import('../views/demo4.vue'),
    meta: {
      title: 'Demo4 - 首页'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../views/NotFound.vue'),
    meta: {
      title: '404 - 页面未找到'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫：设置页面标题
router.beforeEach((to, _from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title as string
  }
  next()
})

export default router

