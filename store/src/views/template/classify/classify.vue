<template>
    <el-breadcrumb separator="/" style="margin-bottom: 16px">
        <el-breadcrumb-item>分类管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="list-form">
        <el-form class="flex-center1">
            <el-form-item label="名称">
                <el-input v-model="search.name" placeholder="名称" />
            </el-form-item>
            <el-form-item label="类型">
                <el-select v-model="search.type" placeholder="全部">
                    <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div>
            <el-button type="primary" @click="searchWord">查询</el-button>
            <el-button type="info" @click="reset">重置</el-button>
        </div>
    </div>
    <div class="c-view mt16">
        <router-link to="/classifyDetails">
            <el-button type="primary">新增</el-button>
        </router-link>
        <el-table :data="tableList" style="width: 100%; margin-top: 16px" v-loading="loading">
            <el-table-column label="名称" prop="name" />
            <el-table-column label="类型">
                <template #default="scope">{{ $filters.photoType(scope.row.type) }}</template>
            </el-table-column>
            <el-table-column label="创建日期">
                <template #default="scope">{{ $filters.date(scope.row.createdAt) }}</template>
            </el-table-column>
            <el-table-column label="激活">
                <template #default="scope">{{ scope.row.isActive ? "是" : "否" }}</template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="130">
                <template #default="scope">
                    <router-link :to="{ path: '/classifyDetails', query: { id: scope.row.id } }">
                        <el-link :underline="false" type="primary">编辑</el-link>
                    </router-link>
                    <el-link :underline="false" type="primary" @click="deleteUser(scope.row.id)">删除</el-link>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination-container">
            <el-pagination background class="right-aligned" :current-page="page" :page-size="pageSize" :total="totals"
                @current-change="currentChange"></el-pagination>
        </div>
    </div>
</template>

<script setup>
import { ElMessage, ElMessageBox } from "element-plus";
import { ref, reactive, inject } from "vue";
import { useRouter, useRoute } from "vue-router";
import utils from "@/utils/index";
const axios = inject("$axios");

const tableList = ref();
const page = ref(1);
const pageSize = ref(10);
const totals = ref(0);
const loading = ref(false);

const typeList = ref([
    {value: "background",label: "背景"},
    {value: "mask",label: "蒙版"},
    {value: "material",label: "素材"},
]);
const search = reactive({
    name: "",
    type: "",
})

getTable();
function getTable() {
    loading.value = true;
    axios.post("/api/classify/pagination", {
        page: page.value - 1,
        size: pageSize.value,
        name: search.name,
        type: search.type,
    }).then((res) => {
        if (res.data) {
            tableList.value = res.data.data;
            totals.value = parseInt(res.data.total) || 0;
        } else {
            ElMessage.error(res.data.message || "接口报错，请稍后重试！");
        }
        loading.value = false;
    }).catch(function () {
        ElMessage.error("接口报错，请稍后重试！");
        loading.value = false;
    });
}
function searchWord() {
    page.value = 1;
    getTable();
}
const reset = function () {
    page.value = 1;
    search.name = "";
    search.type = "";
    getTable();
};
function currentChange(item) {
    page.value = item;
    getTable();
}

function deleteUser(id) {
    ElMessageBox.confirm("确认删除当前分类吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
    }).then(() => {
        axios.delete("/api/classify/" + id).then((res) => {
            if (res.status === 200) {
                ElMessage.success("删除成功");
                searchWord()
            } else {
                ElMessage.error(res.data.message || "接口报错，请稍后重试！");
            }
            loading.value = false;
        }).catch(function () {
            ElMessage.error("接口报错，请稍后重试！");
            loading.value = false;
        });
    }).catch(() => {})
}
</script>
<style scoped lang="scss"></style>
