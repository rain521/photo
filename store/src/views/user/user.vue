<template>
    <el-breadcrumb separator="/" style="margin-bottom: 16px">
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="list-form">
        <el-form class="flex-center1">
            <el-form-item label="姓名">
                <el-input v-model="search.name" placeholder="姓名" />
            </el-form-item>
            <!-- <el-form-item label="入库日期">
                <el-date-picker v-model="search.date" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" size="default" />
            </el-form-item> -->
        </el-form>
        <div>
            <el-button type="primary" @click="searchWord">查询</el-button>
            <el-button type="info" @click="reset">重置</el-button>
        </div>
    </div>
    <div class="c-view mt16">
        <router-link to="/userDetails">
            <el-button type="primary">新增用户</el-button>
        </router-link>
        <el-table :data="tableList" style="width: 100%; margin-top: 16px" v-loading="loading">
            <el-table-column label="姓名" prop="lastName" />
            <el-table-column label="创建日期">
                <template #default="scope">{{ $filters.date(scope.row.createdAt) }}</template>
            </el-table-column>
            <el-table-column label="激活">
                <template #default="scope">{{ scope.row.isActive ? "是" : "否" }}</template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="130">
                <template #default="scope">
                    <router-link :to="{ path: '/userDetails', query: { id: scope.row.id } }">
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

const search = reactive({
    name: "",
})

getTable();
function getTable() {
    loading.value = true;
    axios.post("/api/user/pagination", {
        page: page.value - 1,
        size: pageSize.value,
        name: search.name,
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
    getTable();
};
function currentChange(item) {
    page.value = item;
    getTable();
}

function deleteUser(id) {
    ElMessageBox.confirm("确认删除当前用户吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
    }).then(() => {
        axios.delete("/api/user/" + id).then((res) => {
            if (res.status === 200) {
                ElMessage.success("删除成功");
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
