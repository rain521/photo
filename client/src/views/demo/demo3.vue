<template>
  <div class="demo3-container"></div>
</template>
<script setup lang="ts">
import { App, Box, PointerEvent } from 'leafer-ui'  
const app = new App({ view: window })  
  
const box = Box.one({  
    x: 100,  
    y: 100,  
    width: 200,  
    height: 100,  
    fill: '#32cd79',  
    cursor: 'pointer'  
})  
  
// 双击事件处理  
box.on('pointer:double', (e) => {  
    console.log('双击位置:', e.x, e.y)  
    console.log('双击目标:', e.target)  
})  
  
app.tree.add(box)
</script>
<style scoped lang="scss">
.demo3-container {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
</style>