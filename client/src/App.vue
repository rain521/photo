<script setup lang="ts">
</script>

<template>
  <div class="app-container">
    <router-view />
  </div>
</template>

<style scoped>
.app-container {
  width: 100%;
  min-height: 100vh;
  box-sizing: border-box;
  overflow-x: hidden;
}

/* 确保所有内容在移动端不会溢出 */
* {
  box-sizing: border-box;
}
</style>
