<template>
    <div class="demo1-container">
        <div class="demo1-content">
            <h1 class="demo-title">Demo 1</h1>
            <p class="demo-description">这是一个响应式页面示例</p>
            <Editor v-if="documentXml" :page="documentXml.pages.page[0]" class="editor-section" />
            <div v-else class="loading-placeholder">
                <p>正在加载数据...</p>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { request } from "../../api";
import { onMounted, ref } from "vue";
import Editor from "../../components/editor.vue";
onMounted(() => {
    getXml();
});

const documentXml = ref();
async function getXml() {
    const result = await request.get("/fileserves/api/convert/xmlToDocument2", {
        params: {
            identifier: "productXml-1d4f053c-5df2-4f60-8fb1-1a5c9d7150df",
            editorType: "POSTER",
            patternType: "BOOK",
            provider: "qiniu",
        },
    });
    if (result) {
        documentXml.value = result;
    }
}
</script>
<style scoped lang="scss">
.demo1-container {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 20px;
    box-sizing: border-box;
}

.demo1-content {
    width: 100%;
    max-width: 1400px;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.demo-title {
    color: #ffffff;
    text-align: center;
    margin: 0;
    font-size: 2.5rem;
}

.demo-description {
    color: rgba(255, 255, 255, 0.9);
    text-align: center;
    margin: 0;
    font-size: 1.1rem;
}

.editor-section {
    width: 100%;
    height: 70vh;
    margin-top: 20px;
}

.loading-placeholder {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 70vh;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    color: rgba(255, 255, 255, 0.8);
    font-size: 1.2rem;
}
</style>