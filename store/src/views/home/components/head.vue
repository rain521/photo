<template>
    <div class="head-view">
        <div class="head-view-left">
            <span>用户：{{ user.lastName }}</span>
        </div>
        <div class="head-view-right">
            <div class="head-view-right-user">
                <el-dropdown>
                    <div class="head-view-right-user-title">
                        <div class="head-view-right-user-title-icon"><i class="iconfont icon-yonghu_yonghu"></i></div>
                        <i class="iconfont icon-xiajiantou1"></i>
                    </div>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item @click="logout()">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ElMessage, ElNotification } from "element-plus";
import { ref, watch, onMounted, inject, onUnmounted, computed } from "vue";
const axios = inject("$axios");
import { storeToRefs } from "pinia";
import useUserStore from "@/stores/modules/user";
import util from "@/utils";
const userStore = useUserStore();
const { user } = storeToRefs(userStore);

function logout(userName) {
    util.logout(userName);
}
</script>
<style scoped lang="scss">
.head-view {
    position: fixed;
    left: 208px;
    top: 0;
    right: 0;
    height: 52px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 16px 0 24px;
    background: #ffffff;

    .head-view-left {
        display: flex;
        align-items: center;

        :is(span) {
            margin-right: 32px;
            color: var(--text-general);
        }
    }

    .head-view-right {
        display: flex;
        align-items: center;

        .head-view-right-btn {
            padding: 0 12px;
            height: 32px;
            background: rgba(91, 91, 132, 0.15);
            border-radius: 4px;
            margin-right: 16px;
            display: flex;
            align-items: center;
            cursor: pointer;

            :is(span) {
                font-size: 14px;
                margin-left: 2px;
                line-height: 14px;
            }
        }

        .head-view-right-user {
            margin-left: 22px;

            .head-view-right-user-title {
                display: flex;
                align-items: center;

                .head-view-right-user-title-icon {
                    width: 28px;
                    height: 28px;
                    border-radius: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: var(--brand-color);
                    margin-right: 5px;

                    .iconfont {
                        color: #fff;
                    }
                }

                .icon-xiajiantou1 {
                    font-size: 14px;
                }
            }
        }
    }
}
</style>
