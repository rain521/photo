<template>
    <Head v-if="user.id" />
    <Nav v-if="user.id" />
    <div class="body-view" v-if="user.id">
        <el-scrollbar height="100%" ref="scrollbarRef">
            <RouterView />
        </el-scrollbar>
    </div>
</template>

<script setup>
import { RouterLink, RouterView, useRouter } from "vue-router";
import { ref, inject, provide, nextTick } from "vue";
import { storeToRefs } from "pinia";
import { ElMessage, ElMessageBox, ElLoading } from "element-plus";
import Head from "./components/head.vue";
import Nav from "./components/nav.vue";
import useTokenStore from "@/stores/modules/token";
const tokenStore = useTokenStore();
const { token } = storeToRefs(tokenStore);
import useUserStore from "@/stores/modules/user";
const userStore = useUserStore();
const { user } = storeToRefs(userStore);
console.log(user.value);
const axios = inject("$axios");
const router = useRouter();

if (!token.value) {
    router.push("login");
}

window.addEventListener("storage", (e) => {
    var token1 = localStorage.getItem("photo-mi-store-token");
    if (!token1 || !JSON.parse(token1) || !JSON.parse(token1).token || JSON.parse(token1).token != token.value) {
        ElMessageBox.alert("当前用户已改变，请刷新页面", "提示", {
            confirmButtonText: "确定",
            callback: () => {
                ElLoading.service({
                    lock: true,
                    text: "Loading",
                    background: "rgba(0, 0, 0, 0.7)",
                });
                location.reload();
            },
        });
    }
});
const scrollbarRef = ref();
provide("homeRoll", (res) => {
    scrollbarRef.value.setScrollTop(res - 68);
});
</script>
<style scoped lang="scss">
.body-view {
    position: fixed;
    left: 208px;
    top: 52px;
    right: 0;
    bottom: 0;
    background: var(--page-bg-color);
    padding: 16px;
}
</style>
