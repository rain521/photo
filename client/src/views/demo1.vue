<template>
  <div class="demo1-container">
    <div class="demo1-content">
      <h1 class="demo-title">Demo 1</h1>
      <p class="demo-description">这是一个响应式页面示例</p>
    </div>
  </div>
</template>
<script setup lang="ts">
// #修改数据 [使用 JSON]
import { Group, IUIInputData, Leafer } from "leafer-ui";

const leafer = new Leafer({ view: window });

const group = new Group();

leafer.add(group);

const json: IUIInputData = {
  x: 20,
  y: 20,
  children: [
    {
      tag: "Rect",
      x: 100,
      y: 100,
      width: 200,
      height: 200,
      fill: "#32cd79",
      draggable: true,
    origin: 'center',
      shadow: {
        x: 10,
        y: -10,
        blur: 20,
        color: "#FF0000AA",
      },
      innerShadow: {
        x: 10,
        y: 5,
        blur: 20,
        color: "#FF0000AA",
      },
    },
    {
      tag: "Rect",
      x: 100,
      y: 100,
      width: 100,
      height: 100,
      stroke: "#32cd79",
      strokeWidth: 2,
      dashPattern: [6, 6], // 绘制虚线
    },
    {
      tag: "Text",
      x: 100,
      y: 100,
      text: "Hello, World!",
      fontSize: 20,
      fill: "#32cd79",
      draggable: true,
    },
    {
      tag: "Ellipse",
      x: 100,
      y: 100,
      width: 100,
      height: 100,
      fill: "#32cd79",
      draggable: true,
    },
    {
      tag: "Line",
      x: 100,
      y: 100,
      stroke: "#32cd79",
      strokeWidth: 5, // 描边的宽度
      strokeWidthFixed: true, // 是否固定线宽（不受视图放大影响）
      strokeAlign: "center", // 描边的对齐方式 'inside'、'center' 、'outside'
      strokeCap: "round", // 描边的端点形状 'none' 、'round' 、'square'
      strokeJoin: "round", // 描边的拐角处理 'miter' 、'bevel' 、'round'
      dashPattern: [15, 15], // 绘制虚线
      dashOffset: 15, // 虚线描边的起点偏移值
      draggable: true,
    },
  ],
};

group.set(json);
</script>
<style scoped lang="scss">
.demo1-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  box-sizing: border-box;
}
</style>