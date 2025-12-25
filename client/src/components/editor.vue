<template>
    <div class="editor-view">
        <div id="editor-container" class="editor-wrapper"></div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, watch, ref } from "vue";
import { App, Rect, Text, Image, Group, Frame, Ellipse } from "leafer-ui";
import "@leafer-in/editor";
import "@leafer-in/text-editor";
import "@leafer-in/viewport";
import { ClipImage, ClipResizeEditor } from "leafer-x-clip-resize-inner-editor";

interface Props {
    page?: any;
}

const props = withDefaults(defineProps<Props>(), {
    page: undefined,
});

const containerId = "editor-container";
const editorViewSize = 500; // .editor-view 的固定尺寸
let app: App | null = null;
ClipImage.setEditInner(ClipResizeEditor.name);
onMounted(() => {
    // 初始化 Leafer 编辑器
    app = new App({
        view: containerId,
        editor: {
            circle: {},
            point: { cornerRadius: [0, 0, 10, 0] },
            middlePoint: { width: 12, height: 4, cornerRadius: 2 },
            buttonsFixed: true,
        },
    });
    console.log(props.page);
    // 如果初始有 xml 数据，加载它
    if (props.page) {
        loadXmlData(props.page);
    }
});

// 监听 xml 数据变化
watch(
    () => props.page,
    (newXml) => {
        if (newXml && app) {
            loadXmlData(newXml);
        }
    },
    { deep: true }
);

// 加载 XML 数据
function loadXmlData(page: any) {
    if (!app) return;
    try {
        console.log("加载页面数据:", page);
        // 清空现有内容
        app.tree.removeAll();
        if (!page || typeof page !== "object") {
            return;
        }

        // 设置页面尺寸
        if (page.mediabox.width && page.mediabox.height) {
            app.width = page.mediabox.width;
            app.height = page.mediabox.height;
            // 计算缩放比例，使内容能够完整显示在 500x500 的容器内
            const scaleX = editorViewSize / page.mediabox.width;
            const scaleY = editorViewSize / page.mediabox.height;
            const scale = Math.min(scaleX, scaleY);
            // 更新容器样式以实现缩放和居中（不使用 app.scale，避免双重缩放）
            updateContainerStyle(page.mediabox.width, page.mediabox.height, scale);
        }

        // 设置背景色
        if (page.background) {
            if (page.background.type === "Color") {
                app.fill = page.background.color;
            } else {
                if (page.background.resource.identifier) {
                    const image = new Image({
                        url: page.background.resource.identifier,
                        mode: "fit",
                    });
                    app.tree.add(image);
                }
            }
        }
        // 示例：创建带蒙版的图片并支持编辑功能
        createMaskedImageWithEdit();

        // app.tree.add(ui)
        // if(page.levels?.level){
        //   page.levels.level.forEach((level: any) => {
        //     if(level.imagebox){
        //       console.log(JSON.stringify(level.imagebox))
        //     }
        //   })
        // }
    } catch (error) {
        console.error("加载页面数据失败:", error);
    }
}

// 创建带蒙版的图片并支持编辑功能的示例
function createMaskedImageWithEdit() {
    if (!app) return;

    // ========== 示例 1: 圆形蒙版（椭圆） ==========
    const createCircularMaskedImage = () => {
        // 创建可编辑的 ClipImage
        const clipImage = new ClipImage({
            url: "https://pic-modele.momentsgocdn.com/clipArt-c6480b5b-b127-470d-d78d-ebdee59c95a4",
            editable: true, // 启用编辑功能，支持双击打开内部编辑器
            x: 0,
            y: 0,
            width: 400,
            height: 400,
        });

        // 创建圆形蒙版（椭圆，innerRadius: 0.5 表示内圆半径为外圆的一半，形成圆环）
        // 如果要完整圆形，可以设置 innerRadius: 0
        const maskEllipse = new Ellipse({
            innerRadius: 0, // 0 表示完整圆形，0.5 表示圆环
            fill: "black", // 蒙版颜色，通常使用黑色
            mask: true, // 设置为蒙版
            x: 0,
            y: 0,
            width: 400,
            height: 400,
        });

        // 创建 Group，将蒙版和图片组合
        const group = new Group({
            x: 50,
            y: 50,
            editable: true, // Group 也可编辑（移动、缩放、旋转整个组）
            hitChildren: true, // 允许事件传递到子元素，这样 ClipImage 才能接收编辑事件
            children: [
                maskEllipse, // 蒙版必须在图片之前（先添加的在上层）
                clipImage,   // ClipImage 在蒙版之后
            ],
        });

        return group;
    };

    // ========== 示例 2: 矩形蒙版（带圆角） ==========
    const createRectangularMaskedImage = () => {
        const clipImage = new ClipImage({
            url: "https://pic-modele.momentsgocdn.com/clipArt-c6480b5b-b127-470d-d78d-ebdee59c95a4",
            editable: true,
            x: 0,
            y: 0,
            width: 400,
            height: 400,
        });

        // 使用 Rect 创建矩形蒙版（带圆角）
        const maskRect = new Rect({
            fill: "black",
            mask: true,
            x: 0,
            y: 0,
            width: 400,
            height: 400,
            cornerRadius: 30, // 圆角半径
        });

        const group = new Group({
            x: 500,
            y: 50,
            editable: true,
            hitChildren: true,
            children: [maskRect, clipImage],
        });

        return group;
    };

    // ========== 示例 3: 圆环蒙版 ==========
    const createRingMaskedImage = () => {
        const clipImage = new ClipImage({
            url: "https://pic-modele.momentsgocdn.com/clipArt-c6480b5b-b127-470d-d78d-ebdee59c95a4",
            editable: true,
            x: 0,
            y: 0,
            width: 400,
            height: 400,
        });

        // 圆环蒙版（innerRadius: 0.5 表示内圆半径为外圆的一半）
        const maskRing = new Ellipse({
            innerRadius: 0.5, // 0.5 表示内圆半径是外圆半径的一半，形成圆环
            fill: "black",
            mask: true,
            x: 0,
            y: 0,
            width: 400,
            height: 400,
        });

        const group = new Group({
            x: 50,
            y: 500,
            editable: true,
            hitChildren: true,
            children: [maskRing, clipImage],
        });

        return group;
    };

    // ========== 示例 4: 使用 clip 属性实现矩形裁剪（不推荐用于复杂蒙版） ==========
    const createClippedImage = () => {
        const clipImage = new ClipImage({
            url: "https://pic-modele.momentsgocdn.com/clipArt-c6480b5b-b127-470d-d78d-ebdee59c95a4",
            editable: true,
            x: 0,
            y: 0,
            width: 400,
            height: 400,
            // 使用 clip 属性进行矩形裁剪（仅支持矩形）
            clip: {
                x: 50,
                y: 50,
                width: 300,
                height: 300,
            },
        });

        // 直接添加到 tree，不需要 Group
        clipImage.x = 500;
        clipImage.y = 500;
        return clipImage;
    };

    // 添加所有示例到画布
    app.tree.add(createCircularMaskedImage()); // 圆形蒙版
    app.tree.add(createRectangularMaskedImage()); // 矩形蒙版
    app.tree.add(createRingMaskedImage()); // 圆环蒙版
    app.tree.add(createClippedImage()); // 使用 clip 属性

    console.log("已创建带蒙版的图片示例，支持以下编辑功能：");
    console.log("1. 单击选中图片，可以移动、缩放、旋转整个组");
    console.log("2. 双击 ClipImage 打开内部编辑器，可以裁剪和调整图片");
    console.log("3. 蒙版会随着图片的变换而变换");
}

// 更新容器样式以实现居中
function updateContainerStyle(width: number, height: number, scale: number) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // 设置容器尺寸为原始尺寸
    container.style.width = `${width}px`;
    container.style.height = `${height}px`;

    // 使用 transform 进行缩放，以中心为原点
    container.style.transform = `scale(${scale})`;
    container.style.transformOrigin = "center center";

    // 使用绝对定位居中
    container.style.position = "absolute";
    container.style.left = "50%";
    container.style.top = "50%";
    container.style.marginLeft = `-${width / 2}px`;
    container.style.marginTop = `-${height / 2}px`;
}

onUnmounted(() => {
    // 清理资源
    if (app) {
        app.destroy();
        app = null;
    }
});
</script>

<style scoped lang="scss">
.editor-view {
    width: 500px;
    height: 500px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    background: #f5f5f5;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.editor-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

#editor-container {
    position: absolute;
    display: block;
}
</style>
