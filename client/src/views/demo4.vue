<template>
  <div></div>
</template>
<script setup lang="ts">
// #图形编辑器 [打开内部编辑器事件]
import { App, MoveEvent, Rect, Text, ZoomEvent } from 'leafer-ui'
import { InnerEditorEvent } from '@leafer-in/editor' // 导入图形编辑器插件  
import '@leafer-in/viewport' // 导入视口插件（可选）
import '@leafer-in/text-editor' // 导入文本编辑插件
import '@leafer-in/view' // 导入视图控制插件  //

const app = new App({
    view: window,
    tree: { type: 'custom' },
    editor: {}
})

// 需要自定义平移视图逻辑    //
app.tree.on(MoveEvent.BEFORE_MOVE, (e: MoveEvent) => {
    const { x, y } = app.tree.getValidMove(e.moveX, e.moveY)
    app.tree.zoomLayer.move(x, y)
})

// 需要自定义缩放视图逻辑
app.tree.on(ZoomEvent.BEFORE_ZOOM, (e: ZoomEvent) => {
    const center = { x: e.x, y: e.y }
    app.tree.zoomLayer.scaleOfWorld(center, app.tree.getValidScale(e.scale))
})

app.tree.add(Rect.one({ fill: '#32cd79' }, 100, 100, 200, 200))
</script>
<style scoped lang="scss">
</style>