<template>
    <el-breadcrumb separator="/" style="margin-bottom: 16px">
        <el-breadcrumb-item>分类管理</el-breadcrumb-item>
        <el-breadcrumb-item>
            <el-text size="large">{{ data.id ? "编辑分类" : "新增分类" }}</el-text>
        </el-breadcrumb-item>
    </el-breadcrumb>
    <div class="c-view">
        <el-form
        label-position="right"
        label-width="100px"
        :model="data"
        style="max-width: 460px">
            <el-form-item label="名称">
                <el-input v-model="data.name" placeholder="名称"/>
            </el-form-item>
            <el-form-item label="类型">
                <el-select v-model="data.type" placeholder="请选择类型" v-if="!data.id">
                    <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select>
                <span v-else>{{ $filters.photoType(data.type) }}</span>
            </el-form-item>
            <el-form-item label="排序">
                <el-input v-model="data.seq" placeholder="排序"/>
            </el-form-item>
            <el-form-item label="激活状态">
                <el-switch v-model="data.isActive" active-color="#13ce66" inactive-color="#ff4949"/>
            </el-form-item>
        </el-form>
        <div>
            <el-button type="primary" @click="save">保存</el-button>
            <el-button type="info" @click="reset">取消</el-button>
        </div>
    </div>
</template>

<script setup>
import { ElMessage, ElMessageBox } from "element-plus";
import { ref, reactive, inject } from "vue";
import { useRouter, useRoute } from "vue-router";
const axios = inject("$axios");
const route = useRoute();
const router = useRouter();
const loading = ref(false);
const data = ref({
    name: "",
    seq: 10,
    isActive: true,
});
const typeList = ref([
    {value: "background",label: "背景"},
    {value: "mask",label: "蒙版"},
    {value: "material",label: "素材"},
]);
init();
function init() {
    loading.value = true;
    if (route.query.id) {
        axios.get(`/api/classify/${route.query.id}`).then((res) => {
            if (res.status === 200) {
                data.value = res.data;
            } else {
                ElMessage.error(res.data.message || "系统报错");
            }
            loading.value = false;
        }).catch(function (error) {
            console.log(error)
            ElMessage.error("系统报错");
            loading.value = false;
        });
    }
}

function save() {
    if (!data.value.name) {
        ElMessage.error("名称不能为空");
        return
    }
    if (!data.value.type) {
        ElMessage.error("类型不能为空");
        return
    }
    loading.value = true;
    if (data.value.id) {
        axios.put(`/api/classify/${data.value.id}`, data.value).then((res) => {
            if (res.status === 200) {
                ElMessage.success("保存成功");
                router.push({ path: "/classify" });
            } else {
                ElMessage.error(res.data.message || "系统报错");
            }
            loading.value = false;
        }).catch(function (error) {
            ElMessage.error("系统报错");
            loading.value = false;
        });
    } else {
        axios.post(`/api/classify`, data.value).then((res) => {
            if (res.status === 201) {
                ElMessage.success("保存成功");
                router.push({ path: "/classify" });
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
function reset() {
    router.push({ path: "/classify" });
}
</script>
<style scoped lang="scss"></style>
