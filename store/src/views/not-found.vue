<template>
    <div class="not-found">
        <el-image :src="notFound" style="width: 340px" />
        <div class="home-button">
            <div style="color: #6a6a74; margin-bottom: 32px">哎呀，页面出错啦！</div>
            <el-button type="primary" @click="goHome">返回首页</el-button>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import notFound from "../assets/image/404.png";

const router = useRouter();
const goHome = () => {
    router.push("/");
};
</script>

<style scoped lang="scss">
.not-found {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-content: center;
    align-items: center;
    height: 100vh;
    .home-button {
        margin-top: 20px;
        text-align: center;
        width: 100%;
    }
}
</style>
