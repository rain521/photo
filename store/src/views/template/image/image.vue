<template>
    <el-breadcrumb separator="/" style="margin-bottom: 16px">
        <el-breadcrumb-item>图片管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="list-form">
        <el-form class="flex-center1">
            <el-form-item label="类型">
                <el-select v-model="search.type" placeholder="全部" @change="getClassifyList">
                    <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="分类">
                <el-select v-model="search.classifyId" placeholder="全部">
                    <el-option v-for="item in classifyList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div>
            <el-button type="primary" @click="searchWord">查询</el-button>
            <el-button type="info" @click="reset">重置</el-button>
        </div>
    </div>
    <div class="c-view mt16">
        <router-link to="/imageDetails">
            <el-button type="primary">创建图片</el-button>
        </router-link>
        <el-table :data="tableList" style="width: 100%; margin-top: 16px" v-loading="loading">
            <el-table-column label="图片">
                <template #default="scope">
                    <el-image class="c-image" :src="scope.row.url+'?x-oss-process=image/strip'" fit="contain" />
                </template>
            </el-table-column>
            <el-table-column label="类型">
                <template #default="scope">{{ $filters.photoType(scope.row.type) }}</template>
            </el-table-column>
            <el-table-column label="分类">
                <template #default="scope">{{ scope.row.classifyName }}</template>
            </el-table-column>
            <el-table-column label="创建日期">
                <template #default="scope">{{ $filters.date(scope.row.createdAt) }}</template>
            </el-table-column>
            <el-table-column label="激活">
                <template #default="scope">{{ scope.row.isActive ? "是" : "否" }}</template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="130">
                <template #default="scope">
                    <router-link :to="{ path: '/imageDetails', query: { id: scope.row.id } }">
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
const axios = inject("$axios");
const tableList = ref();
const page = ref(1);
const pageSize = ref(10);
const totals = ref(0);
const loading = ref(false);
const search = reactive({
    type: "",
})
const typeList = ref([
    {value: "background",label: "背景"},
    {value: "mask",label: "蒙版"},
    {value: "material",label: "素材"},
]);
const classifyList = ref([]);
getClassifyList()
function getClassifyList() {
    search.classifyId = "";
    classifyList.value = [];
    axios.get("/api/classify/findAll",{ params: { type: search.type } }).then((res) => {
        if(res.status === 200){
            classifyList.value = res.data;
        }
    })
}

getTable();
function getTable() {
    loading.value = true;
    axios.post("/api/photo/pagination", {
        page: page.value - 1,
        size: pageSize.value,
        type: search.type,
        classifyId: search.classifyId || null,
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
    search.type = "";
    search.classifyId = "";
    getClassifyList()
    getTable();
};
function currentChange(item) {
    page.value = item;
    getTable();
}

function deleteUser(id) {
    ElMessageBox.confirm("确认删除当前图片吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
    }).then(() => {
        axios.delete("/api/photo/" + id).then((res) => {
            if (res.status === 200) {
                ElMessage.success("删除成功");
                searchWord();
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
<style scoped lang="scss">
    .c-image{
        width: 100px;
        height: 100px;
    }
</style>
