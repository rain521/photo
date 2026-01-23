<template>
    <el-upload :before-upload="beforeUpload" :list-type="isSlot ? null : 'picture-card'" :accept="accept" style="overflow: hidden">
        <div v-loading="loading">
            <el-icon v-if="!isSlot"><Plus /></el-icon>
            <slot name="content" v-if="isSlot"></slot>
        </div>
    </el-upload>
</template>

<script setup>
import { ref, inject, provide, nextTick, onMounted } from "vue";
import { ElUpload, ElMessage } from "element-plus";
import { Delete, Download, Plus, ZoomIn } from "@element-plus/icons-vue";
const axios = inject("$axios");
const emits = defineEmits(["uploadSuccess"]);
const props = defineProps({
    accept: {
        type: String,
        required: false,
    },
    isSlot: {
        type: Boolean,
        required: false,
    },
    targetDir: {
        type: String,
        required: false,
    }
});
const accept = ref(props.accept || "");
const loading = ref(false);
const beforeUpload = async (file) => {
    if (loading.value) {
        return false;
    }
    loading.value = true;
    let formData = new FormData();
    formData.append("files", file, file.webkitRelativePath || file.name);
    if(props.targetDir){
        formData.append("targetDir", props.targetDir);
    }
    
    const oss = await axios.post("/api/oss/upload-folder",formData);
    if(oss.status === 200 || oss.status === 201){
        emits("uploadSuccess", oss.data.uploaded[0].url);
        loading.value = false;
    }else{
        ElMessage.error("上传失败");
        loading.value = false;
    }
    return false; // 阻止默认上传行为
};
</script>
