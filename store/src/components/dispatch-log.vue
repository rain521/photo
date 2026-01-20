<template>
    <el-dialog v-model="dialogVisible" title="工单日志" width="1000px" :before-close="cancel">
        <div style="max-height: 450px; overflow: auto" v-if="data.length > 0">
            <div class="dispatch-view" v-for="(item, index) in data" :key="index">
                <div class="dispatch-view-item" style="min-width: 200px; width: 200px; margin-right: 60px">
                    <div>{{ item.classType }}</div>
                    <div style="font-size: 12px; color: var(--text-general)">{{ $filters.date(item.createdDate) }}</div>
                </div>
                <div class="dispatch-view-item" style="width: 80%; display: flex; flex-wrap: wrap">
                    <div style="margin-right: 20px">{{ item.createdBy }}</div>
                    <div>{{ item.description }}</div>
                </div>
            </div>
        </div>
        <no-data v-else></no-data>
        <div class="c-model-foot" style="text-align: center; margin-top: 40px">
            <el-button @click="cancel()" size="large">关闭</el-button>
        </div>
    </el-dialog>
</template>
<script setup>
import { onMounted, ref, watch, inject } from "vue";
import { ElMessage } from "element-plus";
import utils from "../utils";

const axios = inject("$axios");
const props = defineProps({
    order: {
        type: Object,
        default: [],
    },
});
const data = ref([]);
const dialogVisible = ref(true);
onMounted(() => {
    if (props.order) {
        init(props.order);
    }
});
const emits = defineEmits(["callback"]);
const cancel = function () {
    emits("callback");
};
const save = function () {
    emits("callback");
};
function init(order) {
    if (order.photographPrintRetouchTaskDTO)
        axios
            .post("/service/api/histories/getAllByCondition", {
                items: [
                    { key: "classId", op: "=", value: order.photographPrintRetouchTaskDTO.id },
                    { key: "className", op: "=", value: "PhotographPrintRetouchTask" },
                    { key: "storeId", op: "=", value: order.storeId },
                ],
                sort: ["createdDate,desc"],
            })
            .then((res) => {
                if (res.status == 200 || res.status == 201) {
                    data.value = res.data;
                } else {
                    ElMessage.error(res.data.message || "系统报错");
                }
            })
            .catch(function () {
                ElMessage.error("接口报错，请稍后重试！");
            });
}
</script>
<style scoped lang="scss">
.dispatch-view {
    padding: 8px 16px;
    background: var(--page-bg-color);
    display: flex;
    align-items: center;
    color: var(--text-primary);
    margin-bottom: 16px;
}
</style>
