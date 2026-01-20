<template>
    <el-dialog v-model="dialogVisible" :title="title" width="800px" :before-close="close">
        <div class="c-table1">
            <table>
                <thead>
                    <tr>
                        <th>序号</th>
                        <th>时间</th>
                        <th>操作人</th>
                        <th>操作内容</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in logData" :key="index">
                        <td style="width: 80px">{{ index + 1 }}</td>
                        <td style="width: 200px">{{ $filters.date(item.createdDate) }}</td>
                        <td style="width: 80px">{{ item.createdBy }}</td>
                        <td>{{ item.description }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <no-data :text="`暂无${title}`" v-if="logData.length == 0"></no-data>
    </el-dialog>
</template>

<script setup>
import { ref, toRefs, inject } from "vue";
import { ElMessage } from "element-plus";
import NoData from "@/components/no-data.vue";
const axios = inject("$axios");
const props = defineProps({
    id: {
        type: Number,
        required: true,
    },
    requestModule: {
        type: String,
        default: "ServiceWorkOrder",
    },
    title: {
        type: String,
        default: "交付日志",
    },
});
const dialogVisible = ref(true);
const emits = defineEmits(["close"]);
const logData = ref([]);
const loading = ref(false);
getLog();
//交付日志
function getLog() {
    logData.value = [];
    loading.value = true;
    axios
        .post("/service/api/histories/getAllByCondition", {
            items: [
                { key: "classId", op: "=", value: props.id },
                { key: "className", op: "=", value: props.requestModule },
            ],
            sort: ["createdDate,desc"],
        })
        .then((res) => {
            if (res.status == 200 || res.status == 201) {
                logData.value = res.data;
                console.log(logData);
            } else {
                ElMessage.error(res.data.message || "系统报错");
            }
            loading.value = false;
        })
        .catch(function () {
            ElMessage.error("接口报错，请稍后重试！");
            loading.value = false;
        });
}
function close() {
    emits("close");
}
</script>

<style scoped lang="scss">
.c-form {
    margin-top: 20px;

    .c-form-label {
        width: 77px;
        line-height: 40px;
    }

    .c-form-div {
        margin-left: 77px;

        .el-input {
            height: 40px;
            width: 348px;
        }
    }
}
</style>
