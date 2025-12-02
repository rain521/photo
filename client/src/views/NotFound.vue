<template>
  <div class="not-found-container">
    <div class="not-found-content">
      <h1 class="error-code">404</h1>
      <h2 class="error-title">页面未找到</h2>
      <p class="error-message">抱歉，您访问的页面不存在或已被移除。</p>
      <div class="actions">
        <router-link to="/" class="home-button">返回首页</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.not-found-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  box-sizing: border-box;
}

.not-found-content {
  text-align: center;
  color: white;
  max-width: 600px;
  width: 100%;
  padding: 0 15px;
}

.error-code {
  font-size: 120px;
  font-weight: bold;
  margin: 0;
  line-height: 1;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.error-title {
  font-size: 32px;
  margin: 20px 0;
  font-weight: 600;
}

.error-message {
  font-size: 18px;
  margin: 20px 0 40px;
  opacity: 0.9;
  line-height: 1.6;
}

.actions {
  margin-top: 30px;
}

.home-button {
  display: inline-block;
  padding: 12px 30px;
  background: white;
  color: #667eea;
  text-decoration: none;
  border-radius: 25px;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  font-size: 16px;
}

.home-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  background: #f0f0f0;
}

/* 平板设备 */
@media screen and (max-width: 768px) {
  .error-code {
    font-size: 80px;
  }

  .error-title {
    font-size: 28px;
    margin: 15px 0;
  }

  .error-message {
    font-size: 16px;
    margin: 15px 0 30px;
  }

  .home-button {
    padding: 10px 25px;
    font-size: 15px;
  }
}

/* 移动设备 */
@media screen and (max-width: 480px) {
  .not-found-container {
    padding: 15px;
  }

  .not-found-content {
    padding: 0 10px;
  }

  .error-code {
    font-size: 60px;
  }

  .error-title {
    font-size: 24px;
    margin: 12px 0;
  }

  .error-message {
    font-size: 14px;
    margin: 12px 0 25px;
    padding: 0 10px;
  }

  .home-button {
    padding: 10px 20px;
    font-size: 14px;
    width: auto;
    min-width: 120px;
  }
}

/* 小屏移动设备 */
@media screen and (max-width: 360px) {
  .error-code {
    font-size: 50px;
  }

  .error-title {
    font-size: 20px;
  }

  .error-message {
    font-size: 13px;
  }
}
</style>

