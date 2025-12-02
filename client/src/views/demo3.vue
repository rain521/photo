<template>
  <div class="demo3-container"></div>
</template>
<script setup lang="ts">
import { onMounted } from "vue";
import { App, Frame, Rect, Text, PointerEvent } from "leafer-ui";
import "@leafer-in/editor"; // 导入图形编辑器插件
import "@leafer-in/text-editor"; // 导入文本编辑器插件，支持双击编辑文字
import "@leafer-in/viewport"; // 导入视口插件 (可选)
import { EditorEvent } from "@leafer-in/editor";

onMounted(() => {
  const app = new App({
    view: window,
    fill: "#333",
    editor: {
      circle: {},
      point: { cornerRadius: [0, 0, 10, 0] },
      middlePoint: { width: 12, height: 4, cornerRadius: 2 },
      buttonsFixed: true
    }, // 配置 editor 会自动创建并添加 app.editor 实例、tree 层、sky 层
  });

  const frame = Frame.one(
    {
      // 页面内容
      children: [
        Rect.one(
          { editable: true, fill: "#FEB027", cornerRadius: [20, 0, 0, 20] },
          100,
          100
        ),
        Rect.one(
          { editable: true, fill: "#FFE04B", cornerRadius: [0, 20, 20, 0] },
          300,
          100
        ),
        Text.one(
          {
            editable: true,
            text: "双击编辑文字",
            fontSize: 20,
            fill: "#333",
            resizeFontSize: true,
            cursor: "text", // 鼠标悬停时显示文本光标
          },
          100,
          200
        ),
      ],
    },
    100,
    100,
    800,
    800
  );

  app.tree.add(frame);
  

  // 获取 Text 元素并监听双击事件
  const textElement = frame.children[2] as Text;

  // 双击时触发编辑（text-editor 插件会自动处理）
  textElement.on(PointerEvent.DOUBLE_TAP, () => {
    // text-editor 插件会自动处理双击编辑
    // 如果需要在编辑时执行其他操作，可以在这里添加
    console.log("开始编辑文字");
  });
  app.editor.on(EditorEvent.SELECT, (e: EditorEvent) => {
        console.log(e.editor.list)
    })
});
</script>
<style scoped lang="scss">
.demo3-container {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
</style>