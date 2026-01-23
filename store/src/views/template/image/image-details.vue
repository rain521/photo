<template>
    <el-breadcrumb separator="/" style="margin-bottom: 16px">
        <el-breadcrumb-item>图片管理</el-breadcrumb-item>
        <el-breadcrumb-item>
            <el-text size="large">{{ data.id ? "编辑图片" : "新增图片" }}</el-text>
        </el-breadcrumb-item>
    </el-breadcrumb>
    <div class="c-view">
        <el-form
        label-position="right"
        label-width="100px"
        :model="data"
        style="max-width: 460px">
            <el-form-item label="类型">
                <el-select v-model="data.type" placeholder="请选择类型" @change="data.classifyId = '';getClassifyList()">
                    <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="分类">
                <el-select v-model="data.classifyId" placeholder="请选择">
                    <el-option v-for="item in classifyList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="图片">
                <div>
                    <upload-view :accept="'image/*'" :is-slot="true" :target-dir="data.type" @uploadSuccess="uploadSuccess">
                        <template #content>
                            <el-button> <i class="iconfont icon-shangchuan"></i> 上传文件</el-button>
                        </template>
                    </upload-view>
                    <el-image class="c-image" :src="data.url" fit="contain" v-if="data.url" style="margin-top: 10px;"/>
                </div>
            </el-form-item>
        </el-form>
        <div>
            <el-button type="primary" @click="save" v-if="data.id">保存</el-button>
            <el-button type="info" @click="reset">返回</el-button>
        </div>
    </div>
</template>

<script setup>
import { ElMessage, ElMessageBox } from "element-plus";
import { ref, reactive, inject } from "vue";
import { useRouter, useRoute } from "vue-router";
import UploadView from "../../../components/upload-view.vue";
const axios = inject("$axios");
const route = useRoute();
const router = useRouter();
const loading = ref(false);

const data = ref({
    url: "",
    type: "background",
    isActive: true,
    classifyId: "",
});

const classifyList = ref([]);
function getClassifyList() {
    classifyList.value = [];
    axios.get("/api/classify/findAll",{ params: { type: data.value.type } }).then((res) => {
        if(res.status === 200){
            classifyList.value = res.data;
        }
    })
}


const typeList = ref([
    {value: "background",label: "背景"},
    {value: "mask",label: "蒙版"},
    {value: "material",label: "素材"},
]);
init();
function init() {
    loading.value = true;
    if (route.query.id) {
        axios.get(`/api/photo/${route.query.id}`).then((res) => {
            if (res.status === 200) {
                data.value = res.data;
            } else {
                ElMessage.error(res.data.message || "系统报错");
            }
            getClassifyList()
            loading.value = false;
        }).catch(function (error) {
            console.log(error)
            ElMessage.error("系统报错");
            loading.value = false;
        })
    }else{
        getClassifyList()
    }
}
function uploadSuccess(url) {
    if(url){
        data.value.url = url;
        if(!data.value.id){
            loading.value = true;
            axios.post(`/api/photo`, data.value).then((res) => {
                if (res.status === 201) {
                    ElMessage.success("上传成功");
                } else {
                    ElMessage.error(res.data.message || "系统报错");
                }
                loading.value = false;
            }).catch(function (error) {
                ElMessage.error("系统报错");
                loading.value = false;
            });
        }
    }
}

function save() {
    if (!data.value.type) {
        ElMessage.error("请选择类型");
        return;
    }
    if (!data.value.classifyId) {
        ElMessage.error("请选择分类");
        return;
    }
    if (!data.value.url) {
        ElMessage.error("请上传图片");
        return;
    }
    loading.value = true;
    axios.put(`/api/photo`, data.value).then((res) => {
        console.log(res)
        if (res.status === 200) {
            ElMessage.success("上传成功");
            reset()
        } else {
            ElMessage.error(res.data.message || "系统报错");
        }
        loading.value = false;
    }).catch(function (error) {
        ElMessage.error("系统报错");
        loading.value = false;
    });
}
function reset() {
    router.push({ path: "/image" });
}
</script>
<style scoped lang="scss">
    .c-image{
        width: 100px;
        height: 100px;
    }
</style>
