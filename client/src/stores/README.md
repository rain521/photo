# Pinia Store 使用说明

## 目录结构

```
src/stores/
├── index.ts      # Store 统一导出
├── user.ts       # 用户相关 Store
└── app.ts        # 应用全局 Store
```

## 已创建的 Store

### 1. User Store (`useUserStore`)

用户相关的状态管理，包括：
- 用户登录/登出
- 用户信息管理
- Token 管理
- 自动从 localStorage 恢复登录状态

**状态**：
- `token`: 用户 token
- `userInfo`: 用户信息
- `isLoggedIn`: 是否已登录

**计算属性**：
- `userName`: 用户名
- `userEmail`: 用户邮箱

**方法**：
- `login(username, password)`: 登录
- `logout()`: 登出
- `fetchUserInfo()`: 获取用户信息
- `updateUserInfo(data)`: 更新用户信息
- `initUser()`: 初始化用户信息（从 localStorage 恢复）

### 2. App Store (`useAppStore`)

应用全局状态管理，包括：
- 加载状态
- 侧边栏状态
- 主题切换

**状态**：
- `loading`: 是否正在加载
- `loadingText`: 加载提示文字
- `sidebarCollapsed`: 侧边栏是否折叠
- `theme`: 主题（light/dark）

**方法**：
- `showLoading(text?)`: 显示加载状态
- `hideLoading()`: 隐藏加载状态
- `toggleSidebar()`: 切换侧边栏
- `setSidebarCollapsed(collapsed)`: 设置侧边栏状态
- `toggleTheme()`: 切换主题
- `setTheme(theme)`: 设置主题

## 使用方法

### 在 Vue 组件中使用

```vue
<script setup lang="ts">
import { useUserStore, useAppStore } from '@/stores'

// 获取 store 实例
const userStore = useUserStore()
const appStore = useAppStore()

// 访问状态
console.log(userStore.userInfo)
console.log(appStore.loading)

// 调用方法
const handleLogin = async () => {
  try {
    await userStore.login('admin', '123456')
    console.log('登录成功')
  } catch (error) {
    console.error('登录失败:', error)
  }
}

// 响应式更新
userStore.$subscribe((mutation, state) => {
  console.log('用户状态变化:', state)
})
</script>

<template>
  <div>
    <p v-if="userStore.isLoggedIn">
      欢迎，{{ userStore.userName }}
    </p>
    <button @click="handleLogin">登录</button>
    <button @click="userStore.logout">登出</button>
  </div>
</template>
```

### 在组合式函数中使用

```typescript
import { useUserStore } from '@/stores'

export function useAuth() {
  const userStore = useUserStore()

  const checkAuth = () => {
    return userStore.isLoggedIn
  }

  return {
    checkAuth,
    userStore
  }
}
```

### 在路由守卫中使用

```typescript
import { useUserStore } from '@/stores'

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    next('/login')
  } else {
    next()
  }
})
```

## 添加新的 Store

1. 在 `src/stores/` 目录下创建新的 store 文件
2. 使用 `defineStore` 定义 store
3. 在 `src/stores/index.ts` 中导出

示例：

```typescript
// src/stores/product.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useProductStore = defineStore('product', () => {
  const products = ref([])

  function fetchProducts() {
    // 获取产品列表
  }

  return {
    products,
    fetchProducts
  }
})
```

然后在 `src/stores/index.ts` 中导出：

```typescript
export * from './product'
```

## 持久化（可选）

如果需要持久化 store 数据，可以安装 `pinia-plugin-persistedstate`：

```bash
npm install pinia-plugin-persistedstate
```

然后在 `main.ts` 中配置：

```typescript
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
```

## 注意事项

1. Store 使用 Composition API 风格（`setup` 语法）
2. 所有状态都是响应式的
3. 可以在任何地方使用 `useXxxStore()` 获取 store 实例
4. Store 是单例的，多次调用 `useXxxStore()` 返回同一个实例

