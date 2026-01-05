<template>
    <el-button type="primary" @click="save()">保存</el-button>
    <div class="demo2-container">
        <div id="editorContainer"></div>
    </div>
</template>
<script setup lang="ts">
import { request } from "../../api";
import { onMounted, onUnmounted, onBeforeMount, ref } from "vue";
import { App, Box, Rect, Image, ResizeEvent, IEditorScaleData, Text, PointerEvent, Group, WatchEvent } from "leafer-ui";
import "@leafer-in/editor"; // 导入图形编辑器插件
import "@leafer-in/viewport"; // 导入视口插件
import '@leafer-in/text-editor' // 确保导入文本编辑器  
import { DragEvent, ZoomEvent } from '@leafer-ui/event'
import { page, level } from "@/interfaces";
import { pages } from "./api"

let scale = 1;
onMounted(() => {
    getXml()
})
async function getXml() {
    leaferInfo(pages[0]);
}
async function leaferInfo(page: page) { 
    const app = new App({
        view: "editorContainer",
        ground: {}, // 初始化 ground 层  
        editor: {
            circle: {},
            // point: { cornerRadius: [0, 0, 10, 0] },
            middlePoint: { width: 12, height: 4, cornerRadius: 2 },
            buttonsFixed: true,
        }
    });
    if (app.interaction && app.interaction.config && app.interaction.config.wheel && app.interaction.config.pointer) {
        app.interaction.config.wheel.zoomSpeed = 0;
        app.interaction.config.wheel.moveSpeed = 0;
        app.interaction.config.wheel.preventDefault = false;
        // 确保指针事件也允许传递  
        app.interaction.config.pointer.preventDefault = false;  
    }
    // 清空现有内容
    // app.tree.removeAll();
    // 设置页面尺寸
    // 计算缩放比例，使内容能够完整显示在 500x500 的容器内
    const editorViewSize = pxToMmWithPixelRatio(app,1500);
    scale = 1;
    app.width = page.width * scale;
    app.height = page.height * scale;
    if (page.levels) {
        page.levels.forEach((level: level, index: number) => {
            const box:any = Box.one({
                __levelIndex: index,
                __levelData: level,
                x: level.x * scale,
                y: level.y * scale,
                width: level.width * scale,
                height: level.height * scale,
                editable: false,
                rotation: level.rotation,
                origin: 'center', // 设置变换原点为中心  
                resizeChildren: true,
                // overflow: "hide", 
                opacity: level.opacity/100
            })
            if (level.mask) {
                const mask = Image.one({
                    url: level.mask,
                    width: box.width,
                    height: box.height,
                    mask: true
                });
                box.add(mask);
            }
            if(level.image && level.image.resource){
                const image = Rect.one({
                    fill: {
                        type: 'image',
                        url: `${level.image.resource}?imageMogr2/strip`,
                        mode: "cover",
                        rotation: level.image.rotation,
                        scale: {  
                            x: level.image.scaleX,  // 水平镜像  
                            y: level.image.scaleY   // 保持垂直缩放  
                        }  
                    },
                    x: level.image.offsetx * scale,
                    y: level.image.offsety * scale,
                    scale: level.image.scale,
                    draggable: true,
                    hittable: true,  // 确保元素可点击 
                    dragBounds: {
                        x: 0,
                        y: 0,
                        width: Number(box.width),
                        height: Number(box.height)
                    },
                })
                if(box.width > box.height){
                    image.width = box.width;
                }else{
                    image.height = box.height;
                }
                box.add(image);
            }
            if(level.type === "Background"){
                if(level.backgroundColor){
                    box.fill = level.backgroundColor;
                }
                box.editable = false;
                app.ground.add(box)
            }
            if(level.type === "ImageBox"){
                box.on(PointerEvent.DOUBLE_TAP, (e: PointerEvent) => {
                    console.log(e)
                });
            }
            if(level.type === "TextBox" && level.text){
                const textbox = Text.one({
                    __levelIndex: index,
                    __levelData: level,
                    editable: true,
                    text: level.text.text,
                    fontSize: level.text.fontSize,
                    fill: level.text.color,
                    fontFamily: level.text.family,
                    fontWeight: level.text.weight ? 'bold' : undefined,
                    italic: level.text.italic,
                    letterSpacing:level.text.letterSpacing * scale,
                    textAlign:level.text.textAlign,
                    writingMode: level.text.writingMode,
                    resizeFontSize: true,
                    isOverflow: false,
                    cursor: "text", // 鼠标悬停时显示文本光标

                    autoHeight: true,
                    textEditing: false,  // 启用编辑模式  
                    textOverflow: 'hide', // 防止溢出  
                    textWrap: 'normal',   // 文本换行  
                });
                
                
                    box.origin= 'center'; // 设置变换原点为中心  
                    box.resizeChildren= true;
                    box.draggable= true;   // 声明可拖拽  
                // 双击进入编辑模式  
                textbox.on('pointer:double', () => {  
                    textbox.textEditing = true;
                })
                box.add(textbox);
            }
            app.tree.add(box)
        })
    }
}
// 考虑设备像素比的转换  
function pxToMmWithPixelRatio(app: App, number: number) {
    const pixelRatio = app.pixelRatio || window.devicePixelRatio || 1;
    let dpi = 96 * pixelRatio; // 调整后的 DPI  
    return (number / dpi) * 25.4;
}
onUnmounted(() => {
    // 清理资源
    // if (app) {
    //     app.destroy();
    //     app = null;
    // }
});

function save() {
    // getPage(app,scale)
    // console.log(app.ground.children)
    // console.log(documentXml.value.pages.page[0])
}
// function getPage(app: App, scale: number){
//     console.log(app)
//     const page = documentXml.value.pages.page[0];
    
//     if (page.background) {
//         if(app.fill){
//             page.background.color = app.fill;
//             page.background.type = "Color"
//         }
//         if(app.ground && app.ground.children && app.ground.children.length > 0){
//             const background:any = app.ground.children[0];
//             page.background.resource = {
//                 identifier: background.fill.url,
//             }
//             page.background.offsetx = background.x / scale;
//             page.background.offsety = background.y / scale;
//         }
//         if (page.background.type === "Pic" && page.background.resource?.identifier) {
//             // 添加方格背景层  
//             const backgroundScaleX = app.width / page.background.imageInfo.width;
//             const backgroundScaleY = app.height / page.background.imageInfo.height;
//             const backgroundScale = Math.max(backgroundScaleX, backgroundScaleY);
//             const backgroundRect: any = Rect.one({
//                 fill: {
//                     type: 'image',
//                     url: page.background.resource?.identifier,
//                     mode: 'cover',
//                 },
//                 width: page.background.imageInfo.width * backgroundScale,
//                 height: page.background.imageInfo.height * backgroundScale,
//                 x: page.background.offsetx * backgroundScale,
//                 y: page.background.offsety * backgroundScale,
//                 draggable: false,
//                 dragBounds: {
//                     x: 0,
//                     y: 0,
//                     width: app.width,
//                     height: app.height
//                 },
//             });
//             backgroundRect.on(DragEvent.END, () => {
//                 page.background.offsetx = backgroundRect.x / backgroundScale;
//                 page.background.offsety = backgroundRect.y / backgroundScale;
//             });
//             app.ground.add(backgroundRect)
//         }
//     }
// }
</script>
<style scoped lang="scss">
@font-face {
    font-family: "font_44318eae_94c2_11ea_8a6f_0242ac140003";
    font-style:  normal ;
    font-weight:  400 ;
    src:
        url("https://font-dev.momentsgocdn.com/44318eae-94c2-11ea-8a6f-0242ac140003-NORMAL.woff2") format("WOFF2") ,
        url("https://font-dev.momentsgocdn.com/44318eae-94c2-11ea-8a6f-0242ac140003-NORMAL.woff") format("WOFF") ;
    font-feature-settings: 'kern' 0;
}


</style>