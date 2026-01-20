<template>
    <el-dialog v-model="dialogVisible" width="480px" :before-close="closedClick" :close-on-click-modal="false" :close-on-press-escape="false">
        <template #header>
            <div class="dialog-title-text">{{ dialogType === "user" ? "修改密码" : "修改退单密码" }}</div>
        </template>

        <el-form :model="ruleForm" label-width="auto" class="demo-ruleForm">
            <el-form-item label="用户名：" prop="name" v-if="dialogType === 'user'">
                {{ userInfo.name || userInfo.realName }}
            </el-form-item>
            <el-form-item label="旧密码：" prop="oldPassword">
                <el-input v-model="ruleForm.oldPassword" type="password" placeholder="请输入旧密码" autocomplete="off" />
            </el-form-item>
            <el-form-item label="新密码：" prop="password">
                <el-input v-model="ruleForm.password" type="password" autocomplete="off" placeholder="请输入新密码" />
            </el-form-item>
            <el-form-item label="新密码：" prop="password1">
                <el-input v-model="ruleForm.password1" autocomplete="off" type="password" placeholder="请再次输入新密码" />
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button style="width: 120px; height: 40px" @click="closedClick()">取消</el-button>
                <el-button style="width: 120px; height: 40px" type="primary" :disabled="isSave" @click="saveClick()">确认</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup>
import { reactive, ref, toRefs, inject, watchEffect, onMounted, nextTick } from "vue";
import { ElMessage } from "element-plus";
import useUserStore from "@/stores/modules/user";
import { storeToRefs } from "pinia";

const userStore = useUserStore();
const { user, store } = storeToRefs(userStore);
const axios = inject("$axios");
const isSave = ref(false);

const ruleForm = ref({
    oldPassword: "",
    password1: "",
    password: "",
});

const props = defineProps({
    userInfo: {
        type: Object,
    },
    dialogType: {
        type: String,
        default: "user",
    },
});
const dialogVisible = true;

const emits = defineEmits(["save", "closed"]);

const saveClick = () => {
    if (!ruleForm.value.password) {
        ElMessage.error("请输入新密码");
        return;
    }
    if (ruleForm.value.password.length < 5) {
        ElMessage.error("密码长度不能少于五位");
        return;
    }
    if (!ruleForm.value.password1) {
        ElMessage.error("请再次输入新密码");
        return;
    }
    if (ruleForm.value.password != ruleForm.value.password1) {
        ElMessage.error("两次新密码不一致，请重新输入");
        return;
    }
    if (props.dialogType === "user") {
        axios
            .post(
                "/manager/api/store-users/changePassword",
                {
                    id: props.userInfo.id,
                    name: props.userInfo.name,
                    oldPassword: ruleForm.value.oldPassword,
                    password: ruleForm.value.password,
                },
                {},
            )
            .then((res) => {
                if (res.status == 200) {
                    ElMessage.success("修改成功,请重新登录");
                    emits("save");
                } else {
                    ElMessage.error(res.data.message);
                }
            })
            .catch(function (error) {
                ElMessage.error("系统报错4");
            });
    } else {
        if (ruleForm.value.oldPassword != store.value.returnPassword) {
            ElMessage.error("旧密码验证失败");
            return;
        }
        axios
            .get("/manager/api/branch-store/updateReturnPassword?password=" + ruleForm.value.password, {})
            .then((res) => {
                
                if (res.status == 200 && res.data.message) {
                    ElMessage.success("修改成功");
                    emits("save");
                } else {
                    ElMessage.error("修改失败");
                }
            })
            .catch(function (error) {
                ElMessage.error("系统报错");
            });
    }
};

const closedClick = () => {
    emits("closed");
};
</script>
<style lang="scss" scoped>
.dialog-title-text {
    font-size: 18px;
    font-family:
        PingFangSC,
        PingFang SC;
    font-weight: 500;
    color: var(--text-primary);
}
</style>
