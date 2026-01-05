<template>
    <el-button type="primary" @click="save()">保存</el-button>
    <div class="demo2-container">
        <div ref="editorContainer" style="border: 1px solid #333;"></div>
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
import { ContainerWithLevel, page } from "@/interfaces"

let app: App | null = null;
let scale = 1;
const editorContainer = ref<HTMLElement>();
onBeforeMount(() => {
    getXml()
})
const documentXml = ref();
async function getXml() {
    const result = await request.get("/service/api/articles/1250815102934373", {
        // params: {
        //     identifier: "productXml-e30cf685-65ed-471b-9981-e6862a6d433d",
        //     editorType: "POSTER",
        //     patternType: "BOOK",
        //     provider: "qiniu",
        // },
    });
    if (result?.document) {
        documentXml.value = result.document;
        leaferInfo(documentXml.value.pages.page[0]);
    }
}
async function leaferInfo(page: any) { 
    app = new App({
        view: editorContainer.value,
        ground: {}, // 初始化 ground 层  
        editor: {
            circle: {},
            // point: { cornerRadius: [0, 0, 10, 0] },
            middlePoint: { width: 12, height: 4, cornerRadius: 2 },
            buttonsFixed: true,
        }
    });
    if (app.interaction) {
        app.interaction.config.wheel.zoomSpeed = 0;
        app.interaction.config.wheel.moveSpeed = 0;
        app.interaction.config.wheel.preventDefault = false;
        // 确保指针事件也允许传递  
        app.interaction.config.pointer.preventDefault = false;  
    }
    // 清空现有内容
    // app.tree.removeAll();
    // 设置页面尺寸
    app.width = page.mediabox.width;
    app.height = page.mediabox.height;
    // 计算缩放比例，使内容能够完整显示在 500x500 的容器内
    const editorViewSize = pxToMmWithPixelRatio(app,1500);
    const scaleX = editorViewSize / page.mediabox.width;
    const scaleY = editorViewSize / page.mediabox.height;
    scale = Math.min(scaleX, scaleY);
    app.width = page.mediabox.width * scale;
    app.height = page.mediabox.height * scale;
    if (page.background) {
        if (page.background.type === "Color" && page.background.color) {
            app.fill = page.background.color;
        }
        if (page.background.type === "Pic" && page.background.resource?.identifier) {
            // 添加方格背景层  
            const backgroundScaleX = app.width / page.background.imageInfo.width;
            const backgroundScaleY = app.height / page.background.imageInfo.height;
            const backgroundScale = Math.max(backgroundScaleX, backgroundScaleY);
            const backgroundRect: any = Rect.one({
                fill: {
                    type: 'image',
                    url: page.background.resource?.identifier,
                    mode: 'cover',
                },
                width: page.background.imageInfo.width * backgroundScale,
                height: page.background.imageInfo.height * backgroundScale,
                x: page.background.offsetx * backgroundScale,
                y: page.background.offsety * backgroundScale,
                draggable: false,
                dragBounds: {
                    x: 0,
                    y: 0,
                    width: app.width,
                    height: app.height
                },
            });
            backgroundRect.on(DragEvent.END, () => {
                page.background.offsetx = backgroundRect.x / backgroundScale;
                page.background.offsety = backgroundRect.y / backgroundScale;
            });
            app.ground.add(backgroundRect)
        }
    }
    if (page.levels?.level) {
        page.levels.level.forEach((level: any, index: number) => {
            if (level.imagebox && level.imagebox.geometry) {
                const container = Box.one({
                    __levelIndex: index,
                    __levelData: level.imagebox,
                    x: level.imagebox.geometry.x * scale,
                    y: level.imagebox.geometry.y * scale,
                    width: level.imagebox.geometry.width * scale,
                    height: Number(level.imagebox.geometry.height * scale),
                    editable: true,
                    rotation: level.imagebox.rotation.angle,
                    origin: 'center', // 设置变换原点为中心  
                    scaleX: level.imagebox.flip ? -1 : 1,
                    resizeChildren: true,
                }) as ContainerWithLevel;
                if (level.imagebox?.mask?.resource?.identifier) {
                    const mask = Image.one({
                        url: level.imagebox.mask.resource.identifier,
                        width: container.width,
                        height: container.height,
                        mask: true
                    });
                    container.add(mask);
                }
                if (level.imagebox?.image?.resource?.identifier) {
                    const scaleX1 = container.width / level.imagebox.image.width;
                    const scaleY1 = container.height / level.imagebox.image.height;
                    const scale1 = Math.max(scaleX1, scaleY1);
                    const content = Rect.one({
                        fill: {
                            type: 'image',
                            url: `${level.imagebox.image.resource.identifier}?imageMogr2/strip`,
                            mode: 'cover',
                            rotation: level.imagebox.image.angle,
                        },
                        width: level.imagebox.image.width * scale1,
                        height: level.imagebox.image.height * scale1,
                        x: level.imagebox.image.offsetx * scale1,
                        y: level.imagebox.image.offsety * scale1,
                        draggable: true,
                        dragBounds: {
                            x: 0,
                            y: 0,
                            width: Number(container.width),
                            height: Number(container.height)
                        },
                    })
                    container.add(content);
                }
                app?.tree.add(container);
            }
            if (level.imageart && level.imageart.geometry) {
                const container = Box.one({
                    __levelIndex: index,
                    __levelData: level.imageart,
                    x: level.imageart.geometry.x * scale,
                    y: level.imageart.geometry.y * scale,
                    width: level.imageart.geometry.width * scale,
                    height: Number(level.imageart.geometry.height * scale),
                    lockRatio: true,
                    editable: true,
                    rotation: level.imageart.rotation.angle,
                    origin: 'center', // 设置变换原点为中心  
                    scaleX: level.imageart.flip ? -1 : 1,
                    resizeChildren: true,
                    // overflow: "hide"
                });
                if (level.imageart?.resource?.identifier) {
                    const content = Rect.one({
                        fill: {
                            type: 'image',
                            url: `${level.imageart.resource.identifier}`,
                            mode: 'cover',
                        },
                        width: container.width,
                        height: container.height,
                        x: level.imageart.offsetx,
                        y: level.imageart.offsety,
                        draggable: true,
                        hittable: true,  // 确保元素可点击  
                        scale: level.imageart.scale || 1,
                        dragBounds: {
                            x: 0,
                            y: 0,
                            width: Number(container.width),
                            height: Number(container.height)
                        },
                    })
                    content.on(DragEvent.DRAG, (e) => {
                        level.imageart.offsetx = content.x;
                        level.imageart.offsety = content.y;
                    });
                    container.add(content);
                }
                app?.tree.add(container);
            }
            if (level.textbox && level.textbox.geometry) {
                const fs = pxToMmWithPixelRatio(app as App,level.textbox.style.size * 96/72) * scale;
                const container = Box.one({
                    __levelIndex: index,
                    __levelData: level.textbox,
                    x: level.textbox.geometry.x * scale,
                    y: level.textbox.geometry.y * scale,
                    width: level.textbox.geometry.width * scale,
                    height: Number(level.textbox.geometry.height * scale),
                    lockRatio: true,
                    rotation: -level.textbox.rotation.angle,
                    origin: 'center', // 设置变换原点为中心  
                    resizeChildren: true,
                    editable: true,    // 声明可编辑  
                    draggable: true,   // 声明可拖拽  
                });
                const textbox = Text.one({
                    __levelIndex: index,
                    __levelData: level.textbox,
                    editable: true,
                    text: level.textbox.text,
                    fontSize: fs,
                    fill: level.textbox.style.color,
                    fontFamily: level.textbox.fontuuid,
                    fontWeight: level.textbox.style.bold ? 'bold' : undefined,
                    italic: level.textbox.style.italic,
                    letterSpacing:level.textbox.style.letterspacing * scale,
                    textAlign:level.textbox.style.align,
                    writingMode: level.textbox.style.writingmode == 'horizontal-tb' ? 'x' : 'y',
                    resizeFontSize: true,
                    isOverflow: false,
                    cursor: "text", // 鼠标悬停时显示文本光标

                    autoHeight: true,
                    textEditing: false,  // 启用编辑模式  
                    textOverflow: 'hide', // 防止溢出  
                    textWrap: 'normal',   // 文本换行  
                });
                // 双击进入编辑模式  
                textbox.on('pointer:double', () => {  
                    textbox.textEditing = true;
                })
                container.add(textbox);
                app?.tree.add(container);
            }
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
    if (app) {
        app.destroy();
        app = null;
    }
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
.demo2-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: #f5f5f5;
}



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