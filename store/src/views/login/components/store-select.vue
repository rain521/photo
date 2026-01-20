<template>
    <div class="login-store" v-if="storeList && storeList.assignments && storeList.assignments.length > 0">
        <div class="login-store-title-view">
            <div class="login-store-title">
                {{ storeList.realName || storeList.name }}您好，请选择门店
                <div class="login-store-login-btn" @click="getBack()">返回登录</div>
                <div v-if="isSearch" class="search-result-view">为您找到{{ storeList.assignments.length }}条相关结果</div>
            </div>
            <div class="login-store-input">
                <el-input ref="inputRef" v-model="keyWord" type="text" @input="changeInput()" class="my-input" style="width: 360px; height: 48px; margin: 0 auto" placeholder="输入门店名关键词快速查找...">
                    <template #prefix>
                        <i class="iconfont icon-sousuo" style="color: rgb(139, 151, 178)"></i>
                    </template>
                    <template #suffix>
                        <i class="iconfont icon-a-iconcha2" @click="clear" style="color: rgb(139, 151, 178); cursor: pointer" v-if="keyWord"></i>
                    </template>
                </el-input>
            </div>
        </div>
        <div class="login-store-list">
            <div class="login-store-list1">
                <div class="login-store-view" v-for="(item, index) in storeList.assignments" :key="index" @click="storeCb(item)">
                    <div class="img">
                        <el-image style="width: 80%; height: 80%" :src="logo" fit="contain" />
                    </div>
                    <div class="login-store-view-2">
                        <div class="login-store-view-2-1 slh">{{ item.storeName }}</div>
                        <div class="login-store-view-2-2 slh">{{ item.roleName }}</div>
                    </div>
                    <i class="iconfont icon-you"></i>
                    <div class="tag" v-if="item.storeStatus == 'OPENING'">营业中</div>
                    <div class="tag preparing" v-if="item.storeStatus == 'PREPARING'">筹备中</div>
                </div>
            </div>
        </div>
        <div>
            <!-- <div>
        <el-button class="mt20" @click="getBack()">返回登录</el-button>
      </div> -->
            <div style="text-align: center">
                <el-button style="margin-top: 10px" link @click="openUpdate()">修改密码</el-button>
            </div>
        </div>
    </div>
    <update-password
        v-if="isShowUpdatePwd"
        :userInfo="{
            id: storeList.id,
            realName: storeList.realName,
            name: storeList.name,
        }"
        @closed="handlePwdClose"
        @save="handlePwdSave"
    ></update-password>

    <div class="login-store" v-if="!storeList || !storeList.assignments || storeList.assignments.length == 0">
        <div class="login-store-title-view">
            <div class="login-store-title">
                {{ storeList.realName || storeList.name }}您好，请选择门店
                <div class="login-store-login-btn" @click="getBack()">返回登录</div>
                <div v-if="isSearch" class="search-result-view">为您找到{{ storeList.assignments.length }}条相关结果</div>
            </div>
            <div class="login-store-input">
                <el-input ref="inputRef" v-model="keyWord" type="text" @input="changeInput()" class="my-input" style="width: 360px; height: 48px; margin: 0 auto" placeholder="输入门店名关键词快速查找...">
                    <template #prefix>
                        <i class="iconfont icon-sousuo" style="color: rgb(139, 151, 178)"></i>
                    </template>
                    <template #suffix>
                        <i class="iconfont icon-a-iconcha2" @click="clear" style="color: rgb(139, 151, 178); cursor: pointer" v-if="keyWord"></i>
                    </template>
                </el-input>
            </div>
        </div>
        <!--    <div style="width: 300px;">-->
        <!--      <mi-image></mi-image>-->
        <!--    </div>-->
        <!--    <div style="width: 100%; text-align: center;margin: 40px 0;">无可登录门店</div>-->
        <div style="height: 300px; width: 100%; margin-bottom: 40px">
            <no-data :text="'无可登录门店'" :shopnull="true"></no-data>
        </div>
        <!-- <el-button @click="getBack()">返回登录</el-button> -->
    </div>
</template>

<script setup>
import { reactive, ref, toRefs, watchEffect, onMounted, nextTick, inject, watch } from "vue";
import { ElMessage } from "element-plus";
import MiImage from "@/components/mi-image.vue";
import useUserStore from "@/stores/modules/user";
import logo from "@/assets/image/logo.png";
import NoData from "@/components/no-data.vue";
import UpdatePassword from "@/components/update-password.vue";
const userStore = useUserStore();
const axios = inject("$axios");
import { storeToRefs } from "pinia";
const { user, store } = storeToRefs(userStore);

const props = defineProps({
    loginData: {
        type: Object,
        required: true,
    },
});
const emits = defineEmits(["callback"]);
function getBack() {
    emits("callback");
}
const storeList = ref({});
const originStoreList = ref({});
const keyWord = ref("");
const isShowUpdatePwd = ref(false);
const isSearch = ref(false);
onMounted(() => {
    if (props.loginData) {
        storeList.value = props.loginData;
        originStoreList.value = JSON.parse(JSON.stringify(props.loginData));
    }
});

function storeCb(item) {
    emits("callback", item.storeId);
}
function openUpdate() {
    isShowUpdatePwd.value = true;
}
function handlePwdClose() {
    isShowUpdatePwd.value = false;
}
function handlePwdSave() {
    isShowUpdatePwd.value = false;
    console.log("保存并退出登录");
    getBack();
}
function changeInput() {
    if (keyWord.value) {
        let _stores = JSON.parse(JSON.stringify(originStoreList.value.assignments));
        let stores = _stores.filter((store) => {
            return store.storeName.includes(keyWord.value);
        });
        storeList.value.assignments = stores;
        isSearch.value = true;
    } else {
        let _temp = JSON.parse(JSON.stringify(originStoreList.value.assignments));
        storeList.value.assignments = _temp;
        isSearch.value = false;
    }
}
function clear() {
    keyWord.value = "";
    changeInput();
}
</script>
<style lang="scss" scoped>
.login-store {
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    background-color: #fff;
    z-index: 99;
    display: flex;
    align-content: center;
    justify-content: center;
    flex-wrap: wrap;

    .login-store-title-view {
        display: flex;
        justify-content: center;
        width: 100%;
        // padding: 0 290px;
        align-items: center;

        .login-store-title {
            // text-align: center;
            // width: 100%;
            font-size: 28px;
            font-weight: 500;
            display: flex;
            align-items: flex-end;
            position: relative;

            .login-store-login-btn {
                font-size: 16px;
                color: var(--auxiliary-color-6);
                margin-left: 32px;
                font-weight: 400;
                font-style: normal;
                position: relative;
                bottom: 2px;
                cursor: pointer;
            }
            .search-result-view {
                position: absolute;
                bottom: -30px;
                color: var(--text-primary);
            }
        }

        .login-store-input {
            margin-left: 600px;
            .my-input :deep(.el-input__wrapper) {
                background-color: var(--page-bg-color);
                box-shadow: 0 0 0 1px var(--page-bg-color, var(--page-bg-color)) inset;
            }
        }
    }

    .login-store-list {
        width: 100%;
        padding: 0 200px;
        display: flex;
        justify-content: center;
        margin-top: 40px;
        height: 500px;
        overflow-y: auto;
        overflow-x: hidden;
        .login-store-list1 {
            display: grid;
            grid-template-columns: repeat(4, 320px);
            gap: 20px;
        }

        .login-store-view {
            width: 320px;
            height: 108px;
            border: 1px solid #ddd;
            border-radius: 6px;
            background-color: #fff;
            display: inline-flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 16px;
            cursor: pointer;
            transition: 0.1s;
            position: relative;
            overflow: hidden;

            .img {
                width: 48px;
                height: 48px;
                border-radius: 50%;
                overflow: hidden;
                background: #c6d1d3;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .login-store-view-2 {
                .login-store-view-2-1 {
                    width: 160px;
                    font-size: 14px;
                    margin-bottom: 8px;
                }

                .login-store-view-2-2 {
                    width: 160px;
                    font-size: 12px;
                    color: var(--brand-color);
                }
            }

            .tag {
                width: 60px;
                height: 28px;
                background: var(--brand-color-hover);
                border-radius: 1px 1px 1px 8px;
                position: absolute;
                right: 0;
                top: 0;
                color: var(--brand-color);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                margin-right: 0;
            }

            .preparing {
                background: rgba(232, 160, 114, 0.12);
                color: var(--auxiliary-color-4);
            }
        }

        .login-store-view:hover {
            background-color: #f6f6f6;
        }
    }
}
</style>
