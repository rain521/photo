<template>
    <div class="c-model-pop"></div>
    <div class="c-model">
        <div class="c-model-head">
            <div class="c-model-head-title">选择商品</div>
            <el-input class="model-search-input" v-model="keyword" @keydown.enter="search()" placeholder="商品名称">
                <template #suffix>
                    <el-icon class="iconfont icon-sousuo" style="cursor: pointer; font-size: 18px" @click="search"></el-icon>
                </template>
            </el-input>
            <span class="iconfont icon-cha cancelicon" @click="cancel()"></span>
        </div>
        <div class="c-model-body chooseProduct1-view" style="padding: 0" v-loading="loading">
            <div class="chooseProduct1-view1">
                <div class="chooseProduct1-view-fl scrollbar-main">
                    <div class="categorie-view" v-for="(item, index) in categories" :key="index">
                        <template v-if="item.show">
                            <div v-if="!item.categories">
                                <div class="categorie-title" :class="{ selectCate: productType2 == item.type2 }" @click="categorieClick1(item)">
                                    <span>{{ item.name }}</span>
                                </div>
                            </div>
                            <div v-if="item.categories">
                                <div class="categorie-title" @click="item.selected = !item.selected">
                                    <span>{{ item.name }}</span>
                                    <i class="iconfont icon-youjiantou" v-if="!item.selected"></i>
                                    <i class="iconfont icon-xiajiantou" v-if="item.selected"></i>
                                </div>
                                <ul v-if="item.selected">
                                    <li class="categorie-li slh" v-for="(categorie, categorieIndex) in item.categories" :key="categorieIndex" :class="{ selectCate: categorieId == categorie.id }" @click="categorieClick(categorie)">{{ categorie.name }}</li>
                                </ul>
                            </div>
                        </template>
                    </div>
                </div>
                <div class="chooseProduct1-view-fr">
                    <div class="c-table1 scrollbar-main" style="height: 485px">
                        <table>
                            <thead>
                                <tr>
                                    <th>商品名称</th>
                                    <th>商品SKU</th>
                                    <th>sku编号</th>
                                    <th>单位</th>
                                </tr>
                            </thead>
                            <tbody v-if="products.length > 0">
                                <tr v-for="(item, index) in products" :key="index" :class="{ selectedTr: getExist(item) }" @click="productChoice(item)">
                                    <td style="width: 280px; max-width: 280px">
                                        <el-tooltip class="item" :content="item.productName" placement="top-start">
                                            <div class="slh w100p">{{ item.productName }}</div>
                                        </el-tooltip>
                                    </td>
                                    <td style="width: 280px; max-width: 280px">
                                        <el-tooltip class="item" :content="item.sku" placement="top-start">
                                            <div class="slh w100p">{{ item.sku }}</div>
                                        </el-tooltip>
                                    </td>
                                    <td>{{ item.number }}</td>
                                    <td>{{ item.unit }}</td>
                                </tr>
                            </tbody>
                            <tbody v-if="products.length == 0">
                                <tr>
                                    <td colspan="4" class="notData">暂无商品~</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="pagination-container">
                        <el-pagination background class="right-aligned" :current-page="page" :page-size="10" :total="totals" @current-change="currentChange"></el-pagination>
                    </div>
                </div>
            </div>
        </div>
        <div class="c-model-foot">
            <el-button @click="cancel()" size="large">取消</el-button>
            <el-button type="primary" size="large" @click="save()">确定</el-button>
        </div>
    </div>
</template>
<script setup>
import { onMounted, ref, watch, inject } from "vue";
import { ElMessage } from "element-plus";
import utils from "../utils";
const axios = inject("$axios");
const props = defineProps({
    products: {
        type: Array,
        default: [],
    },
    multiple: {
        type: Boolean,
    },
    productTypes: {
        type: String,
    },
    productTypes2: {
        type: String,
    },
});
const keyword = ref();
const productType2 = ref();
const categories = ref([
    { name: "证件照拍摄", type2: "PhotographPrint" },
    { name: "证件照打印", type: "ImmediatelyPrint", categories: [] },
    { name: "照片快印", type2: "PhotoPrint" },
    { name: "定制商品", type: "CustomPrint", categories: [] },
    { name: "零售百货", type: "Standard", categories: [] },
    { name: "耗材管理", type: "Material", categories: [] },
]);
const data = ref([]);
onMounted(() => {
    if (Array.isArray(props.products) && props.products.length > 0) {
        data.value = JSON.parse(JSON.stringify(props.products));
    }
    if (props.productTypes || props.productTypes2) {
        categories.value.forEach(function (item) {
            if (props.productTypes && props.productTypes.indexOf(item.type) > -1) {
                item.show = true;
            }
            if (props.productTypes2 && props.productTypes2.indexOf(item.type2) > -1) {
                item.show = true;
            }
        });
    } else {
        categories.value.forEach(function (item) {
            item.show = true;
        });
    }
    getCategory();
});
const categorieId = ref();
const getCategory = function () {
    let items = [
        { key: "cancelled", op: "=", value: false },
        { key: "usable", op: "=", value: "true" },
    ];
    if (props.productTypes) {
        items.push({ key: "type", op: "in", value: props.productTypes });
    }
    axios
        .post("/manager/api/categories/getAllByCondition", {
            items: items,
        })
        .then((res) => {
            if (res.status == 200 || res.status == 201) {
                res.data.forEach(function (item) {
                    var e = utils.inList(item, categories.value, ["type"]);
                    if (e && categories.value[e.subscriptIndex].categories) {
                        categories.value[e.subscriptIndex].categories.push(item);
                    }
                });
                for (var i = 0; i < categories.value.length; i++) {
                    if (categories.value[i].show) {
                        categories.value[i].selected = true;
                        if (categories.value[i].categories) {
                            categorieId.value = categories.value[i].categories[0].id;
                        } else {
                            productType2.value = categories.value[i].type2;
                        }
                        getProduct();
                        break;
                    }
                }
            } else {
                ElMessage.error(res.data.message || "系统报错");
            }
        })
        .catch(function (error) {
            ElMessage.error("接口报错，请稍后重试！");
        });
};

const totals = ref(0);
const page = ref(1);
const products = ref([]);
const loading = ref(false);
const getProduct = function () {
    var items = [
        { key: "cancelled", op: "=", value: false },
        { key: "saleable", op: "=", value: true },
    ];
    if (categorieId.value) {
        items.push({ key: "category.id", op: "=", value: categorieId.value });
    }
    if (productType2.value) {
        items.push({ key: "productType2", op: "=", value: productType2.value });
    }
    if (keyword.value) {
        items.push({ key: "name", op: "like", value: keyword.value });
    }
    loading.value = true;
    axios
        .post("/manager/api/products/byConditionForClient", {
            items: items,
            page: page.value - 1,
            size: 10,
            sort: ["id,asc"],
        })
        .then((res) => {
            loading.value = false;
            if (res.status == 200 || res.status == 201) {
                products.value = res.data || [];
                totals.value = parseInt(res.headers["x-total-count"]) || 0;
            } else {
                ElMessage.error(res.data.message || "系统报错");
            }
        })
        .catch(function (error) {
            ElMessage.error("接口报错，请稍后重试！");
        });
};

const currentChange = function (item) {
    page.value = item;
    getProduct();
};

const categorieClick = function (item) {
    productType2.value = null;
    categorieId.value = item.id;
    page.value = 1;
    products.value = [];
    keyword.value = "";
    getProduct();
};
const categorieClick1 = function (item) {
    productType2.value = item.type2;
    categorieId.value = null;
    page.value = 1;
    products.value = [];
    keyword.value = "";
    getProduct();
};
const search = function () {
    page.value = 1;
    products.value = [];
    getProduct();
};
const productChoice = function (item) {
    var e = utils.inList(item, data.value, ["id"]);
    if (e) {
        data.value.splice(e.subscriptIndex, 1);
    } else {
        if (props.multiple) {
            data.value.push(item);
        } else {
            data.value = [item];
        }
    }
    console.log(data.value);
};
const getExist = function (item) {
    var e = utils.inList(item, data.value, ["id"]);
    if (e) {
        return true;
    } else {
        return false;
    }
};
const save = function () {
    if (data.value.length == 0) {
        ElMessage.error("请选择商品sku");
        return;
    }
    emits("callback", data.value);
};
const emits = defineEmits(["callback"]);
const cancel = function () {
    emits("callback");
};
</script>
<style scoped lang="scss">
.chooseProduct1-view {
    width: 100%;
}
.chooseProduct1-view-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 50px;
    padding: 0 10px;
}
.chooseProduct1-view1 {
    width: 100%;
    height: 576px;
    display: flex;
}
.chooseProduct1-view-fl {
    width: 180px;
    min-width: 180px;
    max-width: 180px;
    height: 100%;
    overflow: auto;
    border-right: 1px solid #ddd;
}
.chooseProduct1-view-fl ul li {
    width: 100%;
}
.chooseProduct1-view-fr {
    width: 100%;
    height: 100%;
    padding: 20px;
}
.selectedTr {
    background: var(--table-selected-color) url("@/assets/image/selectedTr.png") no-repeat right bottom / 24px;
    td {
        background: rgba(216, 161, 107, 0) !important;
    }
}

.form-search input {
    border-radius: 3px 0 0 3px;
    width: 200px;
}

.form-search button {
    height: 34px;
    line-height: 34px;
    float: left;
    border: 0;
    border-radius: 0 3px 3px 0;
}
.categorie-view {
    padding: 0 16px;
}
.categorie-title {
    width: 100%;
    height: 35px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
}
.categorie-title .iconfont {
    font-size: 12px;
}
.categorie-li {
    width: 100%;
    height: 35px;
    padding: 0 16px;
    line-height: 35px;
    cursor: pointer;
    color: #0a0a0a;
    transition: 0.1s;
}
.categorie-li:hover,
.selectCate {
    background-color: rgba(181, 175, 242, 0.2);
    border-radius: 2px;
}
</style>
