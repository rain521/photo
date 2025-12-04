<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <h1 class="login-title">欢迎登录</h1>
        <p class="login-subtitle">请输入您的账号和密码</p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="phone">用户名</label>
          <input
            id="phone"
            v-model="form.phone"
            type="text"
            placeholder="请输入用户名"
            :disabled="loading"
            required
            autocomplete="phone"
          />
        </div>

        <div class="form-group">
          <label for="password">密码</label>
          <div class="password-input-wrapper">
            <input
              id="password"
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="请输入密码"
              :disabled="loading"
              required
              autocomplete="current-password"
            />
            <button
              type="button"
              class="password-toggle"
              @click="showPassword = !showPassword"
              :disabled="loading"
            >
              <span v-if="showPassword">隐藏</span>
              <span v-else>显示</span>
            </button>
          </div>
        </div>

        <div class="form-options">
          <label class="remember-me">
            <input
              v-model="form.rememberMe"
              type="checkbox"
              :disabled="loading"
            />
            <span>记住我</span>
          </label>
          <a href="#" class="forgot-password" @click.prevent="handleForgotPassword">
            忘记密码？
          </a>
        </div>

        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <button
          type="submit"
          class="login-button"
          :disabled="loading || !form.phone || !form.password"
        >
          <span v-if="loading">登录中...</span>
          <span v-else>登录</span>
        </button>
      </form>

      <div class="login-footer">
        <p>还没有账号？<a href="#" @click.prevent="handleRegister">立即注册</a></p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore, useAppStore } from '../stores'

const router = useRouter()
const userStore = useUserStore()
const appStore = useAppStore()

// 表单数据
const form = reactive({
  phone: '',
  password: '',
  rememberMe: false
})

// 状态
const loading = ref(false)
const showPassword = ref(false)
const errorMessage = ref('')

// 登录处理
const handleLogin = async () => {
  if (!form.phone || !form.password) {
    errorMessage.value = '请输入用户名和密码'
    return
  }

  errorMessage.value = ''
  loading.value = true
  appStore.showLoading('登录中...')

  try {
    await userStore.login(form.phone, form.password)
    
    // 登录成功，跳转到首页
    const redirect = router.currentRoute.value.query.redirect as string || '/'
    router.push(redirect)
  } catch (error) {
    errorMessage.value = (error as Error).message || '登录失败，请检查用户名和密码'
  } finally {
    loading.value = false
    appStore.hideLoading()
  }
}

// 忘记密码
const handleForgotPassword = () => {
  // TODO: 实现忘记密码功能
  alert('忘记密码功能待实现')
}

// 注册
const handleRegister = () => {
  // TODO: 实现注册功能
  alert('注册功能待实现')
}

// 如果已经登录，跳转到首页
onMounted(() => {
  if (userStore.isLoggedIn) {
    router.push('/')
  }
})
</script>

<style scoped lang="scss">
.login-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-box {
  width: 100%;
  max-width: 420px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  padding: 40px;
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-header {
  text-align: center;
  margin-bottom: 32px;

  .login-title {
    font-size: 28px;
    font-weight: 700;
    color: #333;
    margin: 0 0 8px 0;
  }

  .login-subtitle {
    font-size: 14px;
    color: #666;
    margin: 0;
  }
}

.login-form {
  .form-group {
    margin-bottom: 20px;

    label {
      display: block;
      font-size: 14px;
      font-weight: 500;
      color: #333;
      margin-bottom: 8px;
    }

    input {
      width: 100%;
      padding: 12px 16px;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      font-size: 14px;
      transition: all 0.3s;
      box-sizing: border-box;

      &:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
      }

      &:disabled {
        background: #f5f5f5;
        cursor: not-allowed;
      }

      &::placeholder {
        color: #999;
      }
    }

    .password-input-wrapper {
      position: relative;

      input {
        padding-right: 80px;
      }

      .password-toggle {
        position: absolute;
        right: 8px;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        color: #667eea;
        font-size: 12px;
        cursor: pointer;
        padding: 4px 8px;
        border-radius: 4px;
        transition: background 0.2s;

        &:hover:not(:disabled) {
          background: #f0f0f0;
        }

        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      }
    }
  }

  .form-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    font-size: 14px;

    .remember-me {
      display: flex;
      align-items: center;
      cursor: pointer;
      color: #666;

      input {
        margin-right: 6px;
        cursor: pointer;
      }

      span {
        user-select: none;
      }
    }

    .forgot-password {
      color: #667eea;
      text-decoration: none;
      transition: color 0.2s;

      &:hover {
        color: #5568d3;
      }
    }
  }

  .error-message {
    padding: 12px;
    background: #fee;
    border: 1px solid #fcc;
    border-radius: 8px;
    color: #c33;
    font-size: 14px;
    margin-bottom: 20px;
    text-align: center;
  }

  .login-button {
    width: 100%;
    padding: 14px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
    }

    &:active:not(:disabled) {
      transform: translateY(0);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }
  }
}

.login-footer {
  margin-top: 24px;
  text-align: center;
  font-size: 14px;
  color: #666;

  a {
    color: #667eea;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s;

    &:hover {
      color: #5568d3;
    }
  }
}

// 响应式设计
@media screen and (max-width: 480px) {
  .login-box {
    padding: 30px 24px;
    border-radius: 12px;
  }

  .login-header {
    .login-title {
      font-size: 24px;
    }
  }

  .login-form {
    .form-group {
      margin-bottom: 16px;

      input {
        padding: 10px 14px;
        font-size: 16px; // 防止 iOS 自动缩放
      }
    }

    .login-button {
      padding: 12px;
      font-size: 15px;
    }
  }
}
</style>

