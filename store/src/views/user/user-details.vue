<template>
    <el-breadcrumb separator="/" style="margin-bottom: 16px">
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>
            <el-text size="large">{{ data.id ? "编辑用户" : "新增用户" }}</el-text>
        </el-breadcrumb-item>
    </el-breadcrumb>
    <div class="c-view">
        <el-form label-position="right" label-width="100px" :model="data" style="max-width: 460px">
            <el-form-item label="用户名">
                <el-input v-model="data.userName" placeholder="用户名" />
            </el-form-item>
            <el-form-item label="密码" v-if="!data.id">
                <el-input type="password" v-model="data.password" placeholder="密码" />
            </el-form-item>
            <el-form-item label="确认密码" v-if="!data.id">
                <el-input type="password" v-model="data.password1" placeholder="确认密码" />
            </el-form-item>
            <el-form-item label="姓名">
                <el-input v-model="data.lastName" placeholder="姓名" />
            </el-form-item>
            <el-form-item label="激活状态">
                <el-switch v-model="data.isActive" active-color="#13ce66" inactive-color="#ff4949" />
            </el-form-item>
        </el-form>
        <div>
            <el-button type="primary" @click="save">保存</el-button>
            <el-button type="info" @click="reset">取消</el-button>
        </div>
    </div>
    <div>
        <h1>SSE 实时时间推送</h1>
        <p v-if="error">{{ error }}</p>
        <div class="typewriter">{{ messages }}</div>
    </div>
</template>

<script setup>
import { ElMessage, ElMessageBox } from "element-plus";
import { ref, reactive, inject, onMounted, onUnmounted } from "vue";
import { useRouter, useRoute } from "vue-router";
const axios = inject("$axios");
const route = useRoute();
const router = useRouter();
const loading = ref(false);
const data = ref({
    userName: "",
    password: "",
    lastName: "",
    isActive: true,
});
init();
function init() {
    loading.value = true;
    if (route.query.id) {
        axios.get(`/api/user/${route.query.id}`).then((res) => {
            if (res.status === 200) {
                data.value = res.data;
            } else {
                ElMessage.error(res.data.message || "系统报错");
            }
            loading.value = false;
        }).catch(function (error) {
            console.log(error)
            ElMessage.error("系统报错");
            loading.value = false;
        });
    }
}

function save() {
    if (!data.value.userName) {
        ElMessage.error("用户名不能为空");
        return
    }
    if (!data.value.id) {
        if (!data.value.password || !data.value.password1) {
            ElMessage.error("密码不能为空");
            return
        }
        if (data.value.password !== data.value.password1) {
            ElMessage.error("两次密码不一致");
            return
        }
    }
    if (!data.value.lastName) {
        ElMessage.error("姓名不能为空");
        return
    }
    loading.value = true;
    if (data.value.id) {
        axios.put(`/api/user/${data.value.id}`, data.value).then((res) => {
            if (res.status === 200) {
                ElMessage.success("保存成功");
                router.push({ path: "/user" });
            } else {
                ElMessage.error(res.data.message || "系统报错");
            }
            loading.value = false;
        }).catch(function (error) {
            ElMessage.error("系统报错");
            loading.value = false;
        });
    } else {
        axios.post(`/api/user`, data.value).then((res) => {
            if (res.status === 200) {
                ElMessage.success("保存成功");
                router.push({ path: "/user" });
            } else {
                ElMessage.error(res.data.message || "系统报错");
            }
            loading.value = false;
        }).catch(function (error) {
            ElMessage.error("系统报错");
            loading.value = false;
        });
    }
}
function reset() {
    reader?.cancel()
    // router.push({ path: "/user" });
}

const messages = ref("");
const error = ref(null);
let eventSource = null;
let reader = null;

onMounted(async () => {
    // // 连接后端 SSE 端点
    // eventSource = new EventSource('http://localhost:3000/api/ai/events');
    // eventSource.onmessage = (event) => {
    //     try {
    //         const data = JSON.parse(event.data);
    //         messages.value += data.message;
    //     } catch (e) {
    //         error.value = '数据解析失败';
    //     }
    // };

    // eventSource.onerror = (err) => {
    //     console.error('SSE 连接错误', err);
    //     error.value = '连接中断，尝试重连...';
    //     // 浏览器会自动重连，无需额外处理
    // };

    eventSource = await fetch('http://localhost:3000/api/ai/events');
    reader = eventSource.body.getReader(); // 获取读取器

    while (true) {
        const { done, value } = await reader.read(); // 逐块读取
        if (done) break;
        // value 是 Uint8Array，包含当前这一块二进制数据
        if(value){
            const data = new TextDecoder().decode(value);
            console.log(data);
            messages.value += data;
        }
    }
});

onUnmounted(() => {
    // 组件销毁时断开连接
    eventSource?.close();
});
</script>
<style scoped lang="scss">
.typewriter::after {
    content: '';
    display: inline-block;
    width: 2px;
    height: 1em;
    background-color: currentColor;
    vertical-align: text-bottom;
    margin-left: 2px;
    animation: blink 1s step-end infinite;
}

@keyframes blink {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0;
    }
}
</style>
