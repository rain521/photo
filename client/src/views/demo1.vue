<template>
  <div class="demo1-container">
    <div class="demo1-content">
      <h1 class="demo-title">Demo 1</h1>
      <p class="demo-description">这是一个响应式页面示例</p>
    </div>
  </div>
</template>
<script setup lang="ts">
</script>
<style scoped>
.demo1-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.demo1-content {
  text-align: center;
  max-width: 800px;
  width: 100%;
  padding: 40px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.demo-title {
  font-size: 48px;
  margin: 0 0 20px 0;
  color: #333;
  font-weight: 700;
}

.demo-description {
  font-size: 18px;
  color: #666;
  margin: 0;
  line-height: 1.6;
}

/* 平板设备 */
@media screen and (max-width: 768px) {
  .demo1-content {
    padding: 30px;
  }

  .demo-title {
    font-size: 36px;
    margin-bottom: 15px;
  }

  .demo-description {
    font-size: 16px;
  }
}

/* 移动设备 */
@media screen and (max-width: 480px) {
  .demo1-container {
    padding: 15px;
  }

  .demo1-content {
    padding: 25px 20px;
    border-radius: 8px;
  }

  .demo-title {
    font-size: 28px;
    margin-bottom: 12px;
  }

  .demo-description {
    font-size: 14px;
  }
}

/* 小屏移动设备 */
@media screen and (max-width: 360px) {
  .demo1-content {
    padding: 20px 15px;
  }

  .demo-title {
    font-size: 24px;
  }

  .demo-description {
    font-size: 13px;
  }
}
</style>