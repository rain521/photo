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
    const oss = await axios.get("/api/oss",{params:{dir:props.targetDir}});
    console.log(oss)
    let formData = new FormData();
    formData.append("success_action_status", "200");
    formData.append("policy", oss.data.policy);
    formData.append("x-oss-signature", oss.data.signature);
    formData.append("x-oss-signature-version", "OSS4-HMAC-SHA256");
    formData.append("x-oss-credential", oss.data.x_oss_credential);
    formData.append("x-oss-date", oss.data.x_oss_date);
    formData.append("key", oss.data.dir + file.name); // 文件名
    formData.append("x-oss-security-token", oss.data.security_token);
    // formData.append("callback", oss.data.callback);  // 添加回调参数
    formData.append("file", file); // file 必须为最后一个表单域

    await axios.post(oss.data.host, formData);
    emits("uploadSuccess", oss.data.host + '/' + oss.data.dir + file.name);
    loading.value = false;


    // let formData = new FormData();
    // formData.append("files", file, file.webkitRelativePath || file.name);
    // if(props.targetDir){
    //     formData.append("targetDir", props.targetDir);

    // }
    
    // const oss = await axios.post("/api/oss/upload-folder",formData);
    // if(oss.status === 200 || oss.status === 201){
    //     emits("uploadSuccess", oss.data.uploaded[0].url);
    //     loading.value = false;
    // }else{
    //     ElMessage.error("上传失败");
    //     loading.value = false;
    // }
    return false; // 阻止默认上传行为
};
</script>
