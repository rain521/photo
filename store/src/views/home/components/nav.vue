<template>
    <div class="nav-view">
        <el-scrollbar height="100%">
            <div class="logo">
                <el-image style="width: 140px" :src="logo" fit="contain" />
            </div>
            <div class="nav-view-ul">
                <template v-for="(item, index) in navList" :key="index">
                    <div class="nav-view-li" :class="{ 'nav-view-li-select': item.router == thisRoute }" v-if="!item.children" @click="jump(item.router)">
                        <i class="iconfont" :class="item.icon"></i>
                        <span class="nav-view-li-name">{{ item.name }}</span>
                    </div>
                    <div class="nav-view-li1" v-if="item.children">
                        <div class="nav-view-li1-title" @click="childCb(item)">
                            <div class="nav-view-li1-title-1">
                                <i class="iconfont" :class="item.icon"></i>
                                <span class="nav-view-li1-name">{{ item.name }}</span>
                            </div>
                            <i class="iconfont icon-you iconfont-jiantou" v-if="!item.selected"></i>
                            <i class="iconfont icon-xiajiantou iconfont-jiantou" v-if="item.selected"></i>
                        </div>
                        <div class="nav-view-li1-list" v-if="item.selected">
                            <template v-for="(item1, index1) in item.children" :key="index1">
                                <div class="nav-view-li1-list-li" :class="{ 'nav-view-li1-list-li-select': item1.router == thisRoute }" @click="jump(item1.router)">{{ item1.name }}</div>
                            </template>
                        </div>
                    </div>
                </template>
            </div>
        </el-scrollbar>
    </div>
</template>
<script setup>
import { useRoute, useRouter } from "vue-router";
import { ref, onBeforeMount, watch, onBeforeUpdate } from "vue";
import { storeToRefs } from "pinia";
import useUserStore from "@/stores/modules/user";
import logo from "@/assets/image/logo1.png";
const userStore = useUserStore();
const { user } = storeToRefs(userStore);
const route = useRoute();
const router = useRouter();
const thisRoute = ref(route.meta.navPath);
const navList = ref([
    {
        icon: "icon-zhaopianku",
        name: "用户管理",
        authorities: null,
        children: [
            {
                name: "用户",
                router: "/user",
            },
        ],
    },
    {
        icon: "icon-zhaopianku",
        name: "模板",
        authorities: null,
        children: [
            {
                name: "图片",
                router: "/image",
            },
        ],
    },
]);
onBeforeMount(() => {
    //初始化路径展开
    console.log(thisRoute.value)
    for (let i = 0; i < navList.value.length; i++) {
        let nav = navList.value[i];
        if (!nav.children) {
            if (nav.router == thisRoute.value) {
                break;
            }
        } else {
            nav.children.forEach(function (child) {
                if (child.router == thisRoute.value) {
                    nav.selected = true;
                }
            });
        }
    }
});
watch(route, (to, from) => {
    thisRoute.value = to.meta.navPath;
    if (thisRoute.value == "/") {
        thisRoute.value = "/user";
    }
});

function jump(path) {
    router.push(path);
}
function childCb(item) {
    item.selected = !item.selected;
}
</script>
<style scoped lang="scss">
.nav-view {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    width: 208px;
    background: #232335;
    .logo {
        text-align: center;
        width: 100%;
        height: 168px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .nav-view-ul {
        padding: 0 16px 34px;
        .nav-view-li {
            width: 100%;
            height: 48px;
            display: flex;
            align-items: center;
            padding: 0 12px;
            cursor: pointer;
            font-size: 16px;
            color: #fff;
            transition: 0.1s;
            .iconfont {
                font-size: 16px;
                margin-top: 3px;
                margin-right: 4px;
            }
            .nav-view-li-name {
            }
        }
        .nav-view-li-select,
        .nav-view-li:hover {
            background: rgba(255, 255, 255, 0.15);
            font-weight: 500;
            border-radius: 4px;
        }
        .nav-view-li1 {
            .nav-view-li1-title {
                width: 100%;
                height: 48px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 0 12px;
                cursor: pointer;
                font-size: 16px;
                color: #fff;
                .nav-view-li1-title-1 {
                    .iconfont {
                        font-size: 16px;
                        margin-top: 3px;
                    }
                    .nav-view-li1-name {
                        margin-left: 4px;
                        font-size: 16px;
                    }
                }
            }
            .nav-view-li1-list {
                .nav-view-li1-list-li {
                    width: 100%;
                    height: 48px;
                    display: flex;
                    align-items: center;
                    padding: 0 12px 0 36px;
                    cursor: pointer;
                    font-size: 16px;
                    color: #fff;
                    transition: 0.1s;
                }
                .nav-view-li1-list-li-select,
                .nav-view-li1-list-li:hover {
                    background: rgba(255, 255, 255, 0.1);
                }
            }
        }
        .nav-btn {
            width: 100%;
            height: 48px;
            background: var(--brand-color);
            border-radius: 4px;
            font-size: 16px;
            color: #232335;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            margin-top: 38px;
        }
    }
}
</style>
