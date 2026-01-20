<template>
    <div class="login-view">
        <div class="login-body">
            <div class="login-body-fl">
                <el-image class="c-image" :src="login2" fit="fill" />
            </div>
            <div class="login-body-fr">
                <div class="logo">
                    <el-image class="c-image" :src="logo" fit="contain" />
                </div>
                <div class="login-form">
                    <div class="login-form-label">账号</div>
                    <div class="login-form-input" style="margin-bottom: 24px">
                        <i class="iconfont icon-yonghuguanli"></i>
                        <el-input v-model="data.name" placeholder="账号" type="text" @keyup.enter="save" input-style="padding-left:20px; height:44px;" />
                    </div>
                    <div class="login-form-label">密码</div>
                    <div class="login-form-input" style="margin-bottom: 8px">
                        <i class="iconfont icon-tianchongxing-"></i>
                        <el-input v-model="data.password" placeholder="密码" type="password" @keyup.enter="save" input-style="padding-left:20px; height:44px;" />
                    </div>
                    <el-checkbox v-model="data.rememberMe" label="记住我" size="large"/>
                    <el-button type="primary" class="login-btn" @click="save()" :loading="isSave">登录</el-button>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { useRouter, useRoute } from "vue-router";
import { ref, inject } from "vue";
import { storeToRefs } from "pinia";
import { ElMessage } from "element-plus";
import useTokenStore from "@/stores/modules/token";
import logo from "@/assets/image/logo.png";
import login2 from "@/assets/image/login2.png";
import useUserStore from "@/stores/modules/user";

const tokenStore = useTokenStore();
const { token } = storeToRefs(tokenStore);

const userStore = useUserStore();

const axios = inject("$axios");
const router = useRouter();
const route = useRoute();
tokenStore.increment();
let data = ref({
    name: "",
    password: "",
    rememberMe: false,
});

const isSave = ref(false);

function save() {
    if (!data.value.name) {
        ElMessage.error("请输入账号");
        return;
    }
    if (!data.value.password) {
        ElMessage.error("请输入密码");
        return;
    }
    isSave.value = true;
    axios
        .post(
            "/api/auth/login",
            {
                username: data.value.name,
                rememberMe: data.value.rememberMe,
                password: data.value.password,
            },
            {
                headers: {
                    "X-CAPTCHA-TOKEN": "",
                    Authorization: "",
                },
            },
        )
        .then((res) => {
            if (res.status == 201) {
                tokenStore.increment(res.data.access_token);
                getUser();
            } else {
                isSave.value = false;
                ElMessage.error("账号或密码有误");
            }
        })
        .catch(function (error) {
            ElMessage.error("系统报错");
            isSave.value = false;
        });
}

function getUser() {
    axios.get("/api/auth/profile", {}).then((res) => {
        if (res && res.status == 200) {
            userStore.setUser(res.data);
            router.push("/");
        } else {
            ElMessage.error(res.data.message || "用户获取失败");
            tokenStore.increment();
            isSave.value = false;
        }
    });
}
</script>
<style scoped lang="scss">
.login-view {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background: url("@/assets/image/login1.png") no-repeat left top;
    background-size: 100% 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: auto;

    .login-body {
        width: 1140px;
        height: 680px;
        background: #ffffff;
        box-shadow: 0px 8px 24px 0px rgba(77, 77, 120, 0.18);
        border-radius: 20px;
        display: flex;
        overflow: hidden;

        .login-body-fl {
            width: 570px;
            height: 680px;
        }

        .login-body-fr {
            width: 570px;
            height: 680px;

            .logo {
                margin: 92px auto 62px;
                width: 230px;
                height: 125px;
                display: flex;
                justify-content: center;
            }

            .login-form {
                width: 380px;
                margin: 0 auto;

                .login-form-label {
                    font-size: 16px;
                    line-height: 22px;
                    color: var(--text-general);
                    margin-bottom: 8px;
                }

                .login-form-input {
                    position: relative;
                    width: 100%;

                    .iconfont {
                        position: absolute;
                        left: 10px;
                        z-index: 1;
                        line-height: 44px;
                        color: var(--text-primary);
                    }

                    .el-input {
                        padding-left: 0 !important;
                    }
                }

                .login-btn {
                    width: 100%;
                    height: 48px;
                    margin-top: 40px;
                    font-size: 18px;
                }
            }
        }
    }
}
.login-form1 {
    max-height: 340px;
    overflow: auto;
    .login-form1-li {
        width: 100%;
        padding: 19px 24px;
        border-radius: 8px;
        transition: 0.1s;
        background: var(--page-bg-color);
        margin-bottom: 16px;
        cursor: pointer;
        position: relative;
        border: 1px solid var(--page-bg-color);
        .login-form1-li-title {
            font-size: 20px;
            font-weight: 500;
            max-width: 300px;
            line-height: 28px;
        }
        .login-form1-li-phone {
            color: var(--text-general);
            line-height: 20px;
            margin-top: 4px;
        }
        .login-form1-li-this {
            font-size: 12px;
            color: var(--text-general);
            position: absolute;
            right: 13px;
            top: 50%;
            line-height: 18px;
            margin-top: -9px;
            display: none;
        }
        .login-user-delete {
            position: absolute;
            right: 10px;
            top: 10px;
            cursor: pointer;
            color: #d1d1d1;
            transition: 0.1s;
        }
        .login-user-delete:hover {
            color: #999;
        }
    }
    .login-form1-li:hover {
        background: #fff;
        border: 1px solid var(--brand-color);
    }
    .login-form1-li-selected {
        background: #fff;
        border: 1px solid var(--brand-color);
        .login-form1-li-this {
            display: block;
        }
        .login-form1-li-title {
            color: var(--brand-color);
        }
        .login-form1-li-phone {
            color: var(--brand-color);
        }
    }
}
</style>
