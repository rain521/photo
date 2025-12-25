<template>
    <el-button type="primary" @click="save()">保存</el-button>
    <div class="demo2-container">
        <div id="editor-container" style="border: 1px solid #333;"></div>
    </div>
</template>
<script setup lang="ts">
import { request } from "../api";
import { onMounted, onUnmounted, onBeforeMount, ref } from "vue";
import { App, Box, Rect, Image, ResizeEvent, IEditorScaleData, Text } from "leafer-ui";
import "@leafer-in/editor"; // 导入图形编辑器插件
import "@leafer-in/viewport"; // 导入视口插件
import { DragEvent, ZoomEvent } from '@leafer-ui/event'

let app: App | null = null;
interface ContainerWithLevel extends Box {
    __levelData: any;
    __levelIndex: number;
    width: number,
    height: number,
    x: number,
    y: number,
}
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
        view: 'editor-container',
        ground: {},
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
    let scale = Math.min(scaleX, scaleY);
    console.log(scale)
    app.width = app.ground.width = page.mediabox.width * scale;
    app.height = app.ground.height = page.mediabox.height * scale;
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
            app.ground.add(backgroundRect)

            backgroundRect.on(DragEvent.END, () => {
                page.background.offsetx = backgroundRect.x / backgroundScale;
                page.background.offsety = backgroundRect.y / backgroundScale;
            });
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
                const textbox = Text.one({
                    editable: true,
                    text: level.textbox.text,
                    fontSize: fs,
                    fill: level.textbox.style.color,
                    fontFamily: level.textbox.style.fontuuid,
                    fontWeight: level.textbox.style.bold ? 'bold' : undefined,
                    italic: level.textbox.style.italic,
                    // letterSpacing:level.textbox.style.letterspacing * scale,
                    // lineHeight:level.textbox.style.lineheight * scale,
                    textAlign:level.textbox.style.align,
                    writingMode: level.textbox.style.writingmode == 'horizontal-tb' ? 'x' : 'y',
                    resizeFontSize: true,
                    isOverflow: false,
                    cursor: "text", // 鼠标悬停时显示文本光标
                    
                    // 位置和变换
                    width: level.textbox.geometry.width * scale,
                    height: level.textbox.geometry.height * scale,
                    x: level.textbox.geometry.x * scale,  
                    y: level.textbox.geometry.y * scale,  
                    origin: 'center', // 设置变换原点为中心  
                    rotation: -level.textbox.rotation.angle || 0,  
                });
                app?.tree.add(textbox);
            }
        })
    }
    if (app.editor) {
        app.editor.config.beforeScale = (data: any) => {
            if (app?.editor.multiple) {
                app?.editor.list.forEach((container: any) => {
                    levelDataUpdate(container, scale)
                });
            } else {
                levelDataUpdate(data.target, scale);
            }
        };
        app.editor.config.beforeMove = (data: any) => {
            if (app?.editor.multiple) {
                app?.editor.list.forEach((container: any) => {
                    levelDataUpdate(container, scale)
                });
            } else {
                levelDataUpdate(data.target, scale);
            }
        };
        app.editor.config.beforeRotate = (data: any) => {
            if (app?.editor.multiple) {
                app?.editor.list.forEach((container: any) => {
                    levelDataUpdate(container, scale)
                });
            } else {
                levelDataUpdate(data.target, scale);
            }
        };
    }
}
function levelDataUpdate(container: ContainerWithLevel, scale: number) {
    if (container && container.__levelData) {
        container.__levelData.geometry.width = container.width / scale;
        container.__levelData.geometry.height = container.height / scale;
        container.__levelData.geometry.x = container.x / scale;
        container.__levelData.geometry.y = container.y / scale;
        container.__levelData.rotation.angle = container.rotation || 0;
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
    console.log(documentXml.value.pages.page[0])
}
</script>
<style scoped lang="scss">
.demo2-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: #f5f5f5;
}
</style>