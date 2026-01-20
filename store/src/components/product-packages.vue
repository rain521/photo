<template>
    <div class="c-product-packages scrollbar-main" v-if="data">
        <div class="c-product-packages-1">
            <div class="c-product-packages-1-1">
                <span style="font-weight: 500; font-size: 18px; color: var(--text-primary); margin-right: 8px">{{ data.name }}</span>
                <span style="color: var(--text-secondary); margin-right: 8px">{{ data.totalQuantity }}件商品</span>
                <span style="color: var(--auxiliary-color-4)">{{ $filters.money(data.price) }}</span>
            </div>
            <el-link :underline="false" type="primary" @click="goBack()">返回上一页</el-link>
        </div>
        <div class="c-product-packages-2">
            <div class="c-product-packages-2-li" v-for="item in data.packages" :key="item.id">
                <div class="c-product-packages-2-li-1">
                    <div style="font-size: 16px; color: var(--text-primary); margin-right: 24px">{{ item.name }}</div>
                    <div style="color: var(--text-secondary)">
                        可选<span style="color: var(--auxiliary-color-6); margin: 0 2px; font-weight: bold">{{ item.quantity }}</span
                        >件
                    </div>
                </div>
                <div class="c-table1">
                    <table>
                        <thead>
                            <tr>
                                <th>商品名称</th>
                                <th>商品SKU</th>
                                <th>sku编号</th>
                                <th>价格</th>
                            </tr>
                        </thead>
                        <tbody v-if="item.itemValues.length > 0">
                            <tr v-for="(itemValue, index) in item.itemValues" :key="index" :class="{ selectedTr: itemValue.selected }" @click.stop="itemValueChoice(itemValue, item)">
                                <td style="width: 280px; max-width: 280px">
                                    <el-tooltip placement="top-start">
                                        <template #content>
                                            <div style="max-width: 300px">{{ itemValue.productName }}</div>
                                        </template>
                                        <div class="slh w100p">{{ itemValue.productName }}</div>
                                    </el-tooltip>
                                </td>
                                <td style="width: 280px; max-width: 280px">
                                    <el-tooltip placement="top-start">
                                        <template #content>
                                            <div style="max-width: 300px">{{ itemValue.sku }}</div>
                                        </template>
                                        <div class="slh w100p">{{ itemValue.sku }}</div>
                                    </el-tooltip>
                                </td>
                                <td>{{ itemValue.number }}</td>
                                <td>{{ $filters.money(itemValue.showPrice) }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { onMounted, ref, watch, inject } from "vue";
import { ElMessage } from "element-plus";
import utils from "../utils";
import useUserStore from "@/stores/modules/user";
import { storeToRefs } from "pinia";

const userStore = useUserStore();
const { user, store } = storeToRefs(userStore);
const axios = inject("$axios");
const props = defineProps({
    packageId: {
        type: Number,
    },
});
const emits = defineEmits(["callback", "closed"]);
const data = ref();
onMounted(() => {
    getPackage();
});
const getPackage = function () {
    axios
        .get("/manager/api/product-packages/" + props.packageId)
        .then((res) => {
            if (res.status == 200 || res.status == 201) {
                data.value = res.data;
            } else {
                ElMessage.error(res.data.message || "系统报错");
            }
        })
        .catch(function (error) {
            ElMessage.error("接口报错，请稍后重试！");
        });
};
function itemValueChoice(itemValue, item) {
    if (itemValue.selected) {
        itemValue.selected = false;
    } else {
        let quantity = 1;
        item.itemValues.forEach(function (iv) {
            if (iv.selected) {
                quantity++;
            }
        });
        if (quantity > item.quantity) {
            for (let i = 0; i < item.itemValues.length; i++) {
                if (item.itemValues[i].selected) {
                    item.itemValues[i].selected = false;
                    break;
                }
            }
        }
        itemValue.selected = true;
    }
    emits("callback", data.value);
}
function goBack() {
    emits("closed");
}
</script>
<style scoped lang="scss">
.c-product-packages {
    height: 100%;
    overflow: auto;
    .c-product-packages-1 {
        border-bottom: 1px solid #ddd;
        padding-bottom: 16px;
        display: flex;
        justify-content: space-between;
    }
    .c-product-packages-2 {
        margin-top: 16px;
        .c-product-packages-2-li {
            margin-bottom: 16px;
            .c-product-packages-2-li-1 {
                display: flex;
                align-items: center;
                margin-bottom: 16px;
            }
        }
    }
}
.selectedTr {
    background: var(--table-selected-color) url("@/assets/image/selectedTr.png") no-repeat right bottom / 24px;
    td {
        background: rgba(216, 161, 107, 0) !important;
    }
}
</style>
