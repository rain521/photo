<template>
  <div class="home-container">
    <!-- 头部区域 -->
    <header class="home-header">
      <div class="header-content">
        <h1 class="site-title">欢迎使用{{ userStore.userInfo?.name }}</h1>
        <p class="site-subtitle">这是一个现代化的 Vue 3 + Vite + Pinia 项目</p>
      </div>
    </header>

    <!-- 主要内容区域 -->
    <main class="home-main">
      <!-- 用户信息卡片 -->
      <div v-if="userStore.isLoggedIn" class="user-card">
        <div class="user-info">
          <div class="user-avatar">
            <span>{{ userStore.userName.charAt(0).toUpperCase() }}</span>
          </div>
          <div class="user-details">
            <h3>{{ userStore.userName }}</h3>
            <p v-if="userStore.userEmail">{{ userStore.userEmail }}</p>
          </div>
        </div>
        <button @click="handleLogout" class="logout-btn">退出登录</button>
      </div>

      <!-- 功能卡片区域 -->
      <div class="features-grid">
        <div class="feature-card" @click="navigateTo('/demo1')">
          <div class="feature-icon">🎨</div>
          <h3>Demo 1</h3>
          <p>LeaferJS 图形编辑器示例</p>
        </div>

        <div class="feature-card" @click="navigateTo('/demo2')">
          <div class="feature-icon">✨</div>
          <h3>Demo 2</h3>
          <p>图形编辑器限制最小尺寸</p>
        </div>

        <div class="feature-card" @click="navigateTo('/demo3')">
          <div class="feature-icon">📅</div>
          <h3>Demo 3</h3>
          <p>日历示例</p>
        </div>

        <div class="feature-card" @click="navigateTo('/demo4')">
          <div class="feature-icon">🚀</div>
          <h3>Demo 4</h3>
          <p>更多功能示例</p>
        </div>
      </div>

      <!-- 快速操作区域 -->
      <div class="quick-actions">
        <h2>快速操作</h2>
        <div class="actions-list">
          <button 
            v-if="!userStore.isLoggedIn" 
            @click="navigateTo('/login')" 
            class="action-btn primary"
          >
            登录
          </button>
          <button 
            v-else 
            @click="navigateTo('/login')" 
            class="action-btn"
          >
            重新登录
          </button>
          <button @click="showAbout" class="action-btn">
            关于项目
          </button>
        </div>
      </div>
    </main>

    <!-- 页脚 -->
    <footer class="home-footer">
      <p>&copy; 2025 项目名称. All rights reserved.</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore, useAppStore } from '../../stores'

const router = useRouter()
const userStore = useUserStore()
const appStore = useAppStore()
    appStore.showLoading('退出中...')

// 导航到指定路由
const navigateTo = (path: string) => {
  router.push(path)
}
// 退出登录
const handleLogout = async () => {
  try {
    appStore.showLoading('退出中...')
    await userStore.logout()
    router.push('/login')
  } catch (error) {
    console.error('退出登录失败:', error)
  } finally {
    appStore.hideLoading()
  }
}

// 显示关于信息
const showAbout = () => {
  alert('这是一个基于 Vue 3 + Vite + Pinia + Vue Router 构建的现代化项目。')
}

onMounted(() => {
  // 页面加载完成后的初始化操作
  console.log('首页加载完成')
})
</script>

<style scoped lang="scss">
// 使用 @use 导入变量和混入
@use '@/styles/variables' as vars;
@use '@/styles/mixins' as mixins;

.home-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: vars.$gradient-light;
}

.home-header {
  background: linear-gradient(135deg, vars.$primary-color 0%, vars.$secondary-color 100%);
  color: vars.$white;
  padding: vars.$spacing-xl vars.$spacing-md;
  text-align: center;
  box-shadow: vars.$shadow-card;

  .header-content {
    max-width: 1200px;
    margin: 0 auto;

    .site-title {
      font-size: vars.$font-size-xxl + 16px; // 48px
      font-weight: vars.$font-weight-bold;
      margin: 0 0 vars.$spacing-sm 0;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
    }

    .site-subtitle {
      font-size: vars.$font-size-lg + 2px; // 20px
      margin: 0;
      opacity: 0.95;
    }
  }
}

.home-main {
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: vars.$spacing-xl vars.$spacing-md;
}

.user-card {
  @include mixins.card-style;
  padding: vars.$spacing-lg;
  margin-bottom: vars.$spacing-xl - 8px; // 32px
  display: flex;
  justify-content: space-between;
  align-items: center;

  .user-info {
    display: flex;
    align-items: center;
    gap: 16px;

    .user-avatar {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, vars.$primary-color 0%, vars.$secondary-color 100%);
      @include mixins.flex-center;
      color: vars.$white;
      font-size: vars.$font-size-xl;
      font-weight: vars.$font-weight-bold;
    }

    .user-details {
      h3 {
        margin: 0 0 4px 0;
        font-size: vars.$font-size-lg + 2px; // 20px
        color: vars.$text-color;
      }

      p {
        margin: 0;
        font-size: vars.$font-size-sm;
        color: vars.$text-light;
      }
    }
  }

  .logout-btn {
    padding: vars.$spacing-xs vars.$spacing-md;
    background: #ff6b6b;
    color: vars.$white;
    border: none;
    border-radius: vars.$border-radius-sm;
    font-size: vars.$font-size-sm;
    font-weight: vars.$font-weight-medium;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      background: #ee5a5a;
      transform: translateY(-2px);
      box-shadow: vars.$shadow-md;
    }
  }
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: vars.$spacing-lg;
  margin-bottom: vars.$spacing-xl;

  .feature-card {
    @include mixins.card-style;
    padding: vars.$spacing-xl - 8px vars.$spacing-lg; // 32px 24px
    text-align: center;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      transform: translateY(-8px);
      box-shadow: vars.$shadow-lg;
    }

    .feature-icon {
      font-size: 48px;
      margin-bottom: vars.$spacing-sm;
    }

    h3 {
      margin: 0 0 8px 0;
      font-size: vars.$font-size-lg + 2px; // 20px
      color: vars.$text-color;
    }

    p {
      margin: 0;
      font-size: vars.$font-size-sm;
      color: vars.$text-light;
    }
  }
}

.quick-actions {
  @include mixins.card-style;
  padding: vars.$spacing-xl - 8px; // 32px

  h2 {
    margin: 0 0 vars.$spacing-md 0;
    font-size: vars.$font-size-xl;
    color: vars.$text-color;
  }

  .actions-list {
    display: flex;
    gap: vars.$spacing-sm - 3px; // 12px
    flex-wrap: wrap;

    .action-btn {
      padding: vars.$spacing-sm - 3px vars.$spacing-lg; // 12px 24px
      border: 2px solid vars.$primary-color;
      background: vars.$white;
      color: vars.$primary-color;
      border-radius: vars.$border-radius-sm;
      font-size: vars.$font-size-sm;
      font-weight: vars.$font-weight-medium;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        background: vars.$primary-color;
        color: vars.$white;
        transform: translateY(-2px);
        box-shadow: vars.$shadow-md;
      }

      &.primary {
        background: vars.$primary-color;
        color: vars.$white;

        &:hover {
          // 使用 color-mix 或直接使用更深的颜色值
          background: #5568d3;
        }
      }
    }
  }
}

.home-footer {
  background: vars.$background-dark;
  color: vars.$white;
  text-align: center;
  padding: vars.$spacing-lg vars.$spacing-md;
  margin-top: vars.$spacing-xl;

  p {
    margin: 0;
    font-size: vars.$font-size-sm;
    opacity: 0.8;
  }
}

// 响应式设计 - 使用 @use 导入的混入
@include mixins.tablet {
  .home-header {
    padding: vars.$spacing-xl vars.$spacing-md;

    .header-content {
      .site-title {
        font-size: vars.$font-size-xxl + 4px; // 36px
      }

      .site-subtitle {
        font-size: vars.$font-size-md;
      }
    }
  }

  .home-main {
    padding: vars.$spacing-lg vars.$spacing-sm;
  }

  .user-card {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;

    .logout-btn {
      width: 100%;
    }
  }

  .features-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .quick-actions {
    padding: 24px;

    .actions-list {
      flex-direction: column;

      .action-btn {
        width: 100%;
      }
    }
  }
}
</style>

