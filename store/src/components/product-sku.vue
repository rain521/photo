<template>
    <div class="c-model-pop"></div>
    <div class="c-model">
        <div class="c-model-head">
            <div class="c-model-head-title">选择商品</div>
            <div v-if="contentType == 1 || contentType == 2">
                <el-select v-model="type" placeholder="Select" style="width: 130px">
                    <el-option v-for="item in typeList" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
                <el-input class="model-search-input ml5" v-model="keyword" @keydown.enter="search()" :placeholder="type == 'product' ? '商品名称' : 'SKU编号'">
                    <template #suffix>
                        <el-icon class="iconfont icon-sousuo" style="cursor: pointer; font-size: 18px" @click="search"></el-icon>
                    </template>
                </el-input>
            </div>
            <span class="iconfont icon-cha cancelicon" @click="cancel()"></span>
        </div>
        <div class="c-model-body chooseProduct1-view" style="padding: 0">
            <div class="chooseProduct1-view1">
                <div class="chooseProduct1-view-fl scrollbar-main">
                    <div class="categorie-view" v-for="(item, index) in categories" :key="index">
                        <template v-if="item.show">
                            <div v-if="!item.categories">
                                <div class="categorie-title" :class="{ selectCate: productType == item.type && productType2 == item.type2 }" @click="categorieClick1(item)">
                                    <span>{{ item.name }}</span>
                                </div>
                            </div>
                            <div v-if="item.categories">
                                <div class="categorie-title" @click="item.selected = !item.selected">
                                    <span>{{ item.name }}</span>
                                    <i class="iconfont icon-youjiantou" v-if="!item.selected"></i>
                                    <i class="iconfont icon-xiajiantou" v-if="item.selected"></i>
                                </div>
                                <ul v-if="item.selected" style="padding: 0 16px">
                                    <li class="categorie-li slh" v-for="(categorieItem, categorieIndex) in item.categories" :key="categorieIndex" :class="{ selectCate: productType == item.type && productType2 == item.type2 && categorie && categorie.id == categorieItem.id }" @click="categorieClick(item, categorieItem)">{{ categorieItem.name }}</li>
                                </ul>
                            </div>
                        </template>
                    </div>
                </div>
                <div class="chooseProduct1-view-fr" v-loading="loading">
                    <template v-if="(contentType == 1 || contentType == 2) && categorieList && categorieList.length > 1">
                        <div class="categorieTap">
                            <div v-for="(item, index) in categorieList" :key="index" class="categorieTap-item" :class="{ 'categorieTap-item-select': categorie1 && item.id == categorie1.id }" @click="categorie1Click(item)">{{ item.name }}</div>
                        </div>
                    </template>
                    <div class="scrollbar-main" style="display: flex; flex-wrap: wrap; align-content: flex-start; margin: -4px -8px; height: 460px; overflow: auto" :style="{ height: (contentType == 1 || contentType == 2) && categorieList && categorieList.length > 1 ? '460px' : '500px' }" v-if="contentType == 1">
                        <div class="product-view" v-for="product in products" :key="product.id" @click="productCb(product)">
                            <div class="product-view-img">
                                <el-image class="c-image" :src="product.coverImg" fit="cover" />
                            </div>
                            <div class="product-view-title slh">{{ product.name }}</div>
                        </div>
                        <div v-if="products.length == 0" style="width: 100%">
                            <no-data :text="'暂无商品'"></no-data>
                        </div>
                    </div>
                    <template v-if="contentType == 2">
                        <div style="margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center">
                            <div style="font-size: 18px; max-width: 500px; font-weight: 500" class="slh" v-if="productData">{{ productData.name }}</div>
                            <el-link :underline="false" type="primary" @click="goProduct()">返回上一页</el-link>
                        </div>
                        <div class="c-table1 scrollbar-main" style="height: 425px" :style="{ height: (contentType == 1 || contentType == 2) && categorieList && categorieList.length > 1 ? '405px' : '465px' }">
                            <table>
                                <thead>
                                    <tr v-if="products.length > 0 && productType2 !== 'GiftCard'">
                                        <th>商品名称</th>
                                        <th>商品SKU</th>
                                        <th>sku编号</th>
                                        <th v-if="!isCashier">单位</th>
                                        <th v-if="isCashier">价格</th>
                                    </tr>
                                    <tr v-if="products.length > 0 && productType2 == 'GiftCard'">
                                        <th>礼品卡名称</th>
                                        <th>礼品卡编号</th>
                                        <th>礼品卡面额</th>
                                    </tr>
                                </thead>
                                <tbody v-if="products.length > 0 && productType2 !== 'GiftCard'">
                                    <tr v-for="(item, index) in products" :key="index" :class="{ selectedTr: getExist(item) }" @click.stop="productChoice(item)" @dblclick.stop="productDblclick(item)">
                                        <td style="width: 280px; max-width: 280px">
                                            <el-tooltip placement="top-start">
                                                <template #content>
                                                    <div style="max-width: 300px">{{ item.productName }}</div>
                                                </template>
                                                <div class="slh w100p">{{ item.productName }}</div>
                                            </el-tooltip>
                                        </td>
                                        <td style="width: 280px; max-width: 280px">
                                            <el-tooltip placement="top-start">
                                                <template #content>
                                                    <div style="max-width: 300px">{{ item.sku }}</div>
                                                </template>
                                                <div class="slh w100p">{{ item.sku }}</div>
                                            </el-tooltip>
                                        </td>
                                        <td>{{ item.number }}</td>
                                        <td v-if="!isCashier">{{ item.unit }}</td>
                                        <td v-if="isCashier">{{ $filters.money(item.showPrice) }}</td>
                                    </tr>
                                </tbody>
                                <tbody v-if="products.length > 0 && productType2 === 'GiftCard'">
                                    <tr v-for="(item, index) in products" :key="index" :class="{ selectedTr: getExist(item) }" @click.stop="productChoice(item)" @dblclick.stop="productDblclick(item)">
                                        <td>
                                            <el-tooltip placement="top-start">
                                                <template #content>
                                                    <div style="max-width: 300px">{{ item.productName }}</div>
                                                </template>
                                                <div class="slh w100p">{{ item.productName }}</div>
                                            </el-tooltip>
                                        </td>
                                        <td>
                                            <el-tooltip placement="top-start">
                                                <template #content>
                                                    <div style="max-width: 300px">{{ item.productNumber }}</div>
                                                </template>
                                                <div class="slh w100p">{{ item.productNumber }}</div>
                                            </el-tooltip>
                                        </td>
                                        <td>{{ $filters.money(item.price) }}</td>
                                    </tr>
                                </tbody>
                                <tbody v-if="products.length == 0">
                                    <tr>
                                        <td colspan="4" class="notData">暂无商品~</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </template>
                    <div class="c-table1 scrollbar-main" style="height: 100%" v-if="contentType == 3 && products && products.length > 0">
                        <!-- <div class="combination" v-for="item in products" :key="item.id" @click="combinationDetails(item)">
                            <div class="combination-1">
                                <div class="combination-1-1">
                                    <span class="combination-1-1-1">{{item.name}}</span>
                                    <span class="combination-1-1-2">{{item.totalQuantity}}件商品</span>
                                </div>
                                <div class="combination-1-2">组合价：<span>{{$filters.money(item.price)}}</span></div>
                            </div>
                            <div class="combination-2" v-if="item && item.description"><span style="color: var(--text-secondary)">活动说明：</span>{{item.description}}</div>
                            <div class="combination-3">
                                <el-button type="primary" size="large" round style="width: 80px;height: 32px;">选择</el-button>
                            </div>
                        </div> -->

                        <div class="combination" v-for="item in products" :key="item.id" @click="combinationDetails(item)">
                            <div class="combination-view">
                                <div class="combination-view-1">
                                    <mi-image :src="item.coverImg"></mi-image>
                                </div>
                                <div class="combination-view-2">
                                    <div class="combination-1">
                                        <div class="combination-1-1">
                                            <span class="combination-1-1-1">{{ item.name }}</span>
                                            <span class="combination-1-1-2">{{ item.totalQuantity }}件商品</span>
                                        </div>
                                        <div class="combination-1-2">
                                            组合价：<span>{{ $filters.money(item.price) }}</span>
                                        </div>
                                    </div>
                                    <div class="combination-2" v-if="item && item.description"><span style="color: var(--text-secondary)">活动说明：</span>{{ item.description }}</div>
                                </div>
                            </div>
                            <div class="combination-3">
                                <el-button type="primary" size="large" round style="width: 80px; height: 32px">选择</el-button>
                            </div>
                        </div>
                    </div>
                    <template v-if="contentType == 4 && packageId">
                        <product-packages :package-id="packageId" @callback="packageCallback" @closed="packageClosed"></product-packages>
                    </template>
                    <div class="pagination-container" v-if="contentType == 1 || contentType == 2">
                        <el-pagination background class="right-aligned" :current-page="page" :page-size="pageSize" :total="totals" @current-change="currentChange"></el-pagination>
                    </div>
                </div>
            </div>
        </div>
        <div class="c-model-foot" style="text-align: center">
            <el-button @click="cancel()" size="large">取消</el-button>
            <el-button type="primary" size="large" @click="save()">确定</el-button>
        </div>
    </div>
</template>
<script setup>
import { onMounted, ref, watch, inject } from "vue";
import { ElMessage } from "element-plus";
import utils from "../utils";
import useUserStore from "@/stores/modules/user";
import { storeToRefs } from "pinia";
import ProductPackages from "@/components/product-packages.vue";
import login2 from "@/assets/image/login2.png";
import NoData from "@/components/no-data.vue";

const userStore = useUserStore();
const { user, store } = storeToRefs(userStore);
const axios = inject("$axios");
const props = defineProps({
    products: {
        //选中的商品
        type: Array,
        default: [],
    },
    multiple: {
        //是否是多选
        type: Boolean,
    },
    dblclick: {
        //是否开启双击保存
        type: Boolean,
    },
    cashier: {
        //是否是收银页面，展示的列不一样
        type: Boolean,
    },
    productTypes: {
        //一级菜单类型
        type: String,
    },
    productTypes2: {
        //二级菜单类型
        type: String,
    },
});
const keyword = ref();
const productType = ref();
const productType2 = ref();
const isCashier = ref(false);
const categories = ref([
    { name: "证件照拍摄", type: "ImmediatelyPrint", type2: "PhotographPrint", categories: [] },
    { name: "证件照加印", type: "ImmediatelyPrint", type2: "ImgPrint", categories: [] },
    { name: "照片打印", type2: "PhotoPrint" },
    { name: "定制商品", type: "CustomPrint", categories: [] },
    { name: "零售百货", type: "Standard", categories: [] },
    { name: "耗材管理", type: "Material", categories: [] },
    { name: "礼品卡", type2: "GiftCard" },
    { name: "组合购", type2: "Combination" },
]);
const data = ref([]);
onMounted(() => {
    if (Array.isArray(props.products) && props.products.length > 0) {
        data.value = JSON.parse(JSON.stringify(props.products));
    }
    categories.value.forEach(function (item) {
        if (props.productTypes && props.productTypes.indexOf(item.type) > -1) {
            item.show = true;
        }
        if (props.productTypes2 && props.productTypes2.indexOf(item.type2) > -1) {
            item.show = true;
        }
    });
    if (props.cashier) {
        isCashier.value = props.cashier;
        let _type = props.productTypes;
        let _type2 = props.productTypes2;
        categories.value.unshift({ name: "全部", type: _type, show: true });
    }
    getCategory();
});
const categorie = ref();
const categorieList = ref();
const categorie1 = ref();
const getCategory = function () {
    let productTypes = [];
    categories.value.forEach(function (item) {
        if (item.categories && item.show) {
            if (item.type2) {
                productTypes.push(item.type2);
            } else {
                productTypes.push(item.type);
            }
        }
    });
    axios
        .get("/manager/api/products/getCategoriesByProductAndProductType", {
            params: {
                storeId: store.value.id,
                productTypes: productTypes.join(),
            },
        })
        .then((res) => {
            if (res.status == 200 || res.status == 201) {
                categories.value.forEach(function (categorie) {
                    if (categorie.type && res.data[categorie.type]) {
                        categorie.categories = res.data[categorie.type];
                    }
                    if (categorie.type2 && res.data[categorie.type2]) {
                        categorie.categories = res.data[categorie.type2];
                    }
                });
                for (var i = 0; i < categories.value.length; i++) {
                    if (categories.value[i].show) {
                        categories.value[i].selected = true;
                        if (categories.value[i].categories) {
                            categorieClick(categories.value[i], categories.value[i].categories[0]);
                        } else {
                            categorieClick1(categories.value[i]);
                        }
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
const pageSize = ref(10);
const products = ref([]);
const loading = ref(false);
const contentType = ref(1);
const productData = ref();
const type = ref("product");
const typeList = ref([
    { name: "指定商品", id: "product" },
    { name: "指定SKU", id: "product_sku" },
]);
const getProduct = function () {
    loading.value = true;
    productPackage.value = null;
    products.value = [];
    if (contentType.value == 1) {
        pageSize.value = 18;
        type.value = "product";
        productData.value = null;
        let items = [{ key: "saleable", op: "=", value: true }];
        if (!productType2.value || productType2.value != "GiftCard") {
            items.push({ key: "periodOfValidity", op: ">=", value: utils.date3(new Date()) });
        }
        if (productType.value) {
            items.push({ key: "productType", op: "in", value: productType.value });
        }
        if (productType2.value) {
            items.push({ key: "productType2", op: "in", value: productType2.value });
        }
        if (keyword.value) {
            items.push({ key: "name", op: "like", value: keyword.value });
        }
        if (categorie.value) {
            items.push({ key: "category.id", op: "=", value: categorie.value.id });
        }
        if (categorie1.value) {
            items.push({ key: "subCategory.id", op: "=", value: categorie1.value.id });
        }
        if (productType.value != "Material") {
            axios
                .post("/manager/api/products/byConditionForClient", {
                    storeId: store.value.id,
                    items: items,
                    page: page.value - 1,
                    size: pageSize.value,
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
        } else {
            axios
                .post("/manager/api/products/byCondition2ForMaterial", {
                    storeId: store.value.id,
                    items: items,
                    page: page.value - 1,
                    size: pageSize.value,
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
        }
    } else if (contentType.value == 2) {
        pageSize.value = 10;
        type.value = "product_sku";
        axios
            .get("/manager/api/item-values/getItemValueByClient", {
                params: {
                    storeId: store.value.id,
                    productId: productData.value ? productData.value.id : null,
                    categoryId: categorie.value ? categorie.value.id : null,
                    subCategoryId: categorie1.value ? categorie1.value.id : null,
                    keyWord: keyword.value,
                    productType2: productType2.value,
                    page: page.value - 1,
                    size: pageSize.value,
                },
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
    } else if (contentType.value == 3) {
        axios
            .get("/manager/api/product-packages/getForOrder", {
                params: {
                    storeId: store.value.id,
                    sourceType: "offline",
                },
            })
            .then((res) => {
                loading.value = false;
                if (res.status == 200 || res.status == 201) {
                    products.value = res.data || [];
                } else {
                    ElMessage.error(res.data.message || "系统报错");
                }
            })
            .catch(function (error) {
                ElMessage.error("接口报错，请稍后重试！");
            });
    }
};
function productCb(product) {
    productData.value = product;
    contentType.value = 2;
    page.value = 1;
    keyword.value = null;
    getProduct();
}
function goProduct() {
    productData.value = null;
    contentType.value = 1;
    page.value = 1;
    keyword.value = null;
    getProduct();
}

const currentChange = function (item) {
    page.value = item;
    getProduct();
};
const categorieClick = function (item, categories) {
    productType.value = item.type;
    productType2.value = item.type2;
    categorie.value = categories;
    axios
        .get("/manager/api/products/getSubCategoriesByProduct", {
            params: {
                storeId: store.value.id,
                categoryId: categorie.value.id,
            },
        })
        .then((res) => {
            if (res.status == 200 || res.status == 201) {
                categorieList.value = [...[{ name: "全部", id: "" }], ...res.data];
                categorie1.value = "";
                categorie1Click(categorieList.value[0]);
            } else {
                ElMessage.error(res.data.message || "系统报错");
            }
        })
        .catch(function (error) {
            ElMessage.error("接口报错，请稍后重试！");
        });
};
const categorie1Click = function (item) {
    categorie1.value = item;
    page.value = 1;
    contentType.value = 1;
    products.value = [];
    productData.value = null;
    getProduct();
};
const categorieClick1 = function (item) {
    productType.value = item.type;
    productType2.value = item.type2;
    categorie.value = null;
    categorie1.value = "";
    categorieList.value = [];
    page.value = 1;
    contentType.value = productType2.value == "Combination" ? 3 : 1;
    products.value = [];
    productData.value = null;
    getProduct();
};
const search = function () {
    page.value = 1;
    products.value = [];
    if (type.value == "product") {
        contentType.value = 1;
    } else {
        contentType.value = 2;
    }
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
};
const getExist = function (item) {
    var e = utils.inList(item, data.value, ["id"]);
    if (e) {
        return true;
    } else {
        return false;
    }
};
const productDblclick = function (item) {
    if (props.dblclick) {
        if (props.cashier) {
            emits("callback", item);
        } else {
            emits("callback", [item]);
        }
    }
};
const save = function () {
    if (contentType.value == 3 || contentType.value == 4) {
        if (!productPackage.value) {
            ElMessage.error("请选择组合购");
            return;
        }
        let _data = JSON.parse(JSON.stringify(productPackage.value));
        for (let j = 0; j < _data.packages.length; j++) {
            let item = _data.packages[j];
            for (let i = item.itemValues.length - 1; i >= 0; i--) {
                if (!item.itemValues[i].selected) {
                    item.itemValues.splice(i, 1);
                }
            }
            if (item.itemValues.length != item.quantity) {
                ElMessage.error("请选择完整的组合购");
                return false;
            }
        }
        emits("callback", _data, "productPackage");
    } else {
        if (data.value.length == 0) {
            ElMessage.error("请选择商品sku");
            return;
        }
        if (props.cashier) {
            emits("callback", data.value[0], "product");
        } else {
            emits("callback", data.value, "product");
        }
    }
};
const emits = defineEmits(["callback", "closed"]);
const cancel = function () {
    if (props.cashier) {
        emits("closed");
    } else {
        emits("callback");
    }
};

//组合购
const packageId = ref();
const productPackage = ref();
const combinationDetails = function (item) {
    contentType.value = 4;
    packageId.value = item.id;
};
function packageCallback(item) {
    productPackage.value = item;
}
function packageClosed() {
    productPackage.value = null;
    contentType.value = 3;
}
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
}

.categorie-title {
    padding: 0 16px;
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
    transition: 0.1s;
}

.categorie-li:hover,
.selectCate {
    background-color: rgba(91, 91, 132, 0.1);
    color: var(--brand-color) !important;
    border-radius: 2px;
}
.combination {
    width: 100%;
    padding: 16px;
    background: var(--page-bg-color);
    margin-bottom: 16px;
    .combination-view {
        display: flex;
        .combination-view-1 {
            width: 80px;
            height: 80px;
            min-width: 80px;
            margin-right: 10px;
            background: #ddd;
        }
        .combination-view-2 {
            width: 100%;
            .combination-1 {
                display: flex;
                justify-content: space-between;
                .combination-1-1 {
                    .combination-1-1-1 {
                        font-weight: bold;
                        font-size: 18px;
                        color: var(--text-primary);
                        margin-right: 8px;
                    }
                    .combination-1-1-2 {
                        color: var(--text-secondary);
                    }
                }
                .combination-1-2 {
                    color: var(--text-general);
                    :is(span) {
                        font-weight: bold;
                        font-size: 18px;
                        color: var(--auxiliary-color-1);
                    }
                }
            }
            .combination-2 {
                margin-top: 6px;
                width: 100%;
                line-height: 24px;
                color: var(--text-general);
                font-size: 14px;
            }
        }
    }
    .combination-3 {
        text-align: right;
    }
}

// .combination{
//     width: 100%;
//     padding: 16px;
//     background: var(--page-bg-color);
//     margin-bottom: 16px;
//     .combination-1{
//         display: flex;
//         justify-content: space-between;
//         .combination-1-1{
//             .combination-1-1-1{
//                 font-weight: bold;
//                 font-size: 18px;
//                 color: var(--text-primary);
//                 margin-right: 8px;
//             }
//             .combination-1-1-2{
//                 color: var(--text-secondary);
//             }
//         }
//         .combination-1-2{
//             color: var(--text-general);
//             span{
//                 font-weight: bold;
//                 font-size: 18px;
//                 color: var(--auxiliary-color-4);
//             }
//         }
//     }
//     .combination-2{
//         margin-top: 16px;
//         width: 100%;
//         line-height: 30px;
//         padding: 7px 12px;
//         background: #fff;
//         border-radius: 4px;
//         display: flex;
//         align-items: center;
//         color: var(--text-general);
//     }
//     .combination-3{
//         text-align: right;
//         margin-top: 16px;
//     }
// }
.product-view {
    width: 144px;
    height: 184px;
    padding: 8px 8px 0;
    background: #fff;
    transition: 0.1s;
    color: var(--text-general);
    margin: 4px 8px;
    cursor: pointer;
    .product-view-img {
        width: 100%;
        height: 128px;
        border: 1px solid #ddd;
    }
    .product-view-title {
        width: 100%;
        height: 48px;
        line-height: 48px;
        text-align: center;
    }
}
.product-view:hover {
    background: var(--page-bg-color);
    color: var(--brand-color);
}
.categorieTap {
    width: 100%;
    margin: 0 -8px 20px -8px;
    display: flex;
    flex-wrap: wrap;
    .categorieTap-item {
        height: 28px;
        padding: 0 12px;
        cursor: pointer;
        margin: 0 8px;
        color: var(--text-general);
        transition: 0.1s;
        line-height: 28px;
        background: #fff;
        border-radius: 2px;
        font-size: 12px;
    }
    .categorieTap-item:hover {
        color: var(--brand-color) !important;
        background: var(--brand-color-hover) !important;
    }
    .categorieTap-item-select {
        color: var(--brand-color) !important;
        background: var(--brand-color-hover) !important;
    }
}
</style>
