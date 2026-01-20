<template>
    <div class="notification-main">
        <div class="notification-head">
            <div class="left" @click="quit"><span class="iconfont icon-zuo"></span> 返回首页</div>
            <div class="right">收银员:{{ user.realName }}</div>
        </div>
        <div class="c-model c-model-notification" style="width: 1280px; height: 80vh; border-radius: 0">
            <div class="c-model-head">
                <div class="c-model-tabTitle">
                    <div :class="[activeIndex == 0 ? 'activeTitle' : '', 'c-model-allNoticeTitle']" @click="changeActive(0)">全部通知</div>
                    <div :class="[activeIndex == 1 ? 'activeTitle' : '', 'c-model-unReadNoticeTitle']" @click="changeActive(1)">
                        未读通知<span v-if="unReadCount > 0">({{ unReadCount }})</span>
                    </div>
                </div>
                <div class="read-all-notice-title" @click="handleReadAllNotice()">标记全部为已读</div>
                <!-- <span class="iconfont icon-cha cancelicon" style="margin-right: 8px;" @click="cancel()"></span> -->
            </div>
            <div class="c-model-body chooseProduct1-view" style="padding: 0; border-bottom: 0; height: 80vh; background-color: #fff">
                <div class="chooseProduct1-view1" style="height: 100%">
                    <div class="chooseProduct1-view-fr" v-loading="loading">
                        <div ref="scrollbarItem" class="c-table1 scrollbar-main" style="height: 100%; width: 268px" @scroll="handleScroll()">
                            <div style="width: 248px; height: 72px; position: fixed; z-index: 10; line-height: 72px; background: #fff">
                                <el-select v-model="messageType" placeholder="请选择" @change="filterData(true)">
                                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                                </el-select>
                            </div>
                            <!-- 占位 -->
                            <div style="height: 72px; width: 1px"></div>
                            <div v-for="(item, index) in messageList" :key="index" class="notice-item">
                                <div class="">
                                    <div>
                                        <i class="iconfont icon-dingdan c-iconfont c-iconfont1" v-if="item.messageBusinessType == 'ServiceWork'"></i>
                                        <i class="iconfont icon-tuihuanhuo c-iconfont c-iconfont2" v-if="item.messageBusinessType == 'AfterSale'"></i>
                                        <i class="iconfont icon-caiwu c-iconfont c-iconfont3" v-if="item.messageBusinessType == 'Finance'"></i>
                                        <i class="iconfont icon-caigou c-iconfont c-iconfont4" v-if="item.messageBusinessType == 'StockApprove'"></i>
                                        <i class="iconfont icon-yuchuku c-iconfont c-iconfont5" v-if="item.messageBusinessType == 'StockOut'"></i>
                                        <i class="iconfont icon-xiupian c-iconfont c-iconfont6" v-if="item.messageBusinessType == 'Retouch'"></i>
                                        <i class="iconfont icon-horn c-iconfont c-iconfont7" v-if="item.messageBusinessType == 'Ordinary'"></i>
                                        <i class="iconfont icon-jingdeng c-iconfont c-iconfont8" v-if="item.messageBusinessType == 'Urgent'"></i>
                                    </div>
                                </div>
                                <div class="notice-item-main" @click="handleReadNotice(item)">
                                    <div class="notice-item-title">
                                        {{ item.title }}
                                        <div v-if="!item.read" class="notice-unRead-dot"></div>
                                    </div>
                                    <div class="notice-item-desc slh" v-html="contentInfo(item)"></div>
                                    <div class="notice-item-time">{{ $filters.date(item.createdDate).replace(/\//g, "-") }}</div>
                                </div>
                            </div>
                            <div class="noData" v-if="messageList.length == 0">暂无通知</div>
                        </div>
                        <div class="message-content" style="border-left: 1px solid #ebebf0 !important">
                            <div class="message-content-title">
                                {{ currentMessage && currentMessage.title }}
                            </div>
                            <div style="margin-bottom: 8px" v-html="contentInfoDetail(currentMessage)" @click="getServiceWorkOrders(currentMessage)"></div>
                            <!-- <div class="notice-item-time" v-if=" currentMessage.businessId && currentMessage.messageBusinessType !== 'Urgent' && currentMessage.messageBusinessType !== 'Ordinary'">
                                {{ $filters.date(currentMessage && currentMessage.createdDate).replace(/\//g, '-') || '' }}
                            </div> -->
                            <div v-for="(file, index) in currentMessage.attach" :key="index" style="display: flex; align-items: flex-start; vertical-align: baseline; margin-bottom: 4px; cursor: pointer" @click="downloadFile(file.path, file.name)">
                                <span class="iconfont icon-lianjie" style="transform: rotate(90deg); font-size: 12px; color: var(--text-general); position: relative; top: 4px"></span>
                                <span style="margin: 0 8px; color: var(--text-general)">附件{{ numberToChinese(index + 1) }}:</span>
                                <span style="max-width: 80%"
                                    >{{ file.name }}
                                    <span class="iconfont icon-download" style="font-size: 12px; position: relative; top: 3px; color: rgb(62, 101, 251)"></span>
                                </span>
                            </div>
                            <div style="margin-top: 10px; color: var(--text-general)">{{ $filters.date5(currentMessage.createdDate) }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { onMounted, ref, watch, inject } from "vue";
import { storeToRefs } from "pinia";
import useUserStore from "@/stores/modules/user";
import { throttle, debounce } from "@/utils/throttle";
import { useRouter } from "vue-router";
import utils from "@/utils";
const router = useRouter();
const userStore = useUserStore();
const { user, store } = storeToRefs(userStore);
const axios = inject("$axios");
const totals = ref(0);
const page = ref(1);
const unReadCount = ref(0);
const read = ref(true);
const currentMessage = ref({});
const props = defineProps({
    notificationPage: {
        type: Number,
        default: 1,
    },
});

const messageList = ref([]);

const loading = ref(true);
const activeIndex = ref(0);

onMounted(() => {
    init(true);
    getUnReadCount();
});

const options = ref([
    {
        value: "",
        label: "全部类型",
    },
    {
        value: "ServiceWork",
        label: "工单消息",
    },
    {
        value: "AfterSale",
        label: "售后消息",
    },
    {
        value: "Finance",
        label: "财务消息",
    },
    {
        value: "StockApprove",
        label: "报货审核消息",
    },
    {
        value: "StockOut",
        label: "报货出库消息",
    },
    {
        value: "Retouch",
        label: "修片通知",
    },
    {
        value: "Urgent",
        label: "紧急通知消息",
    },
    {
        value: "Ordinary",
        label: "普通消息",
    },
]);

const messageType = ref(null);
const scrollbarItem = ref();

// 获取未读总数
const getUnReadCount = function () {
    if (user.value.type == "STORE") {
        axios
            .get("/service/api/user-messages/unreadCount", {
                params: {
                    type: "Store",
                    storeId: store.value.id,
                },
            })
            .then((res) => {
                unReadCount.value = res.data.count || 0;
            })
            .catch(function (e) {
                ElMessage.error("接口报错，请稍后重试！");
            });
    }
};

// 获取全部
const init = function (first) {
    loading.value = true;
    let params = {
        type: "Store",
        page: page.value,
        size: 20,
        storeId: store.value.id,
        messageBusinessType: messageType.value,
    };
    if (read.value === false) {
        params.read = false;
    }
    axios
        .get("/service/api/user-messages/", { params })
        .then((res) => {
            totals.value = parseInt(res.headers["x-total-count"]);
            messageList.value = messageList.value.concat(res.data);
            // 初始默认展示第一个消息并已读
            if (first && messageList.value.length) {
                handleReadNotice(messageList.value[0]);
            } else if (first && !messageList.value.length) {
                currentMessage.value = {};
            }
            loading.value = false;
        })
        .catch(function () {
            loading.value = false;
            ElMessage.error("接口报错，请稍后重试！");
        });
};

const filterData = function () {
    page.value = 1;
    messageList.value = [];
    init(true);
};

const handleScroll = debounce(() => {
    const scrollWrapper = scrollbarItem.value; // 获取滚动容器
    const { scrollTop, clientHeight, scrollHeight } = scrollWrapper; // 获取滚动数据
    // 判断是否滚动到底部
    if (scrollTop + clientHeight >= scrollHeight - 50 && !loading.value) {
        if (messageList.value.length < totals.value) {
            page.value++;
            init();
        }
    }
}, 300);

const changeActive = function (index) {
    activeIndex.value = index;
    page.value = 1;
    messageList.value = [];
    if (activeIndex.value == 0) {
        read.value = true;
        init(true);
    } else {
        read.value = false;
        currentMessage.value = {};
        init();
    }
};

// 处理未读消息
const handleReadNotice = function (item) {
    currentMessage.value = item;
    if (activeIndex.value === 0) {
        axios
            .get(`/service/api/user-messages/${item.id}`)
            .then((res) => {
                item.read = true;
                getUnReadCount();
            })
            .catch(function () {
                ElMessage.error("接口报错，请稍后重试！");
            });
    } else {
        handleReadAllNotice();
    }
};
// 处理未读消息
const handleReadAllNotice = function () {
    axios
        .get("/service/api/user-messages/read-all", {
            params: {
                type: "Store",
                storeId: store.value.id,
            },
        })
        .then((res) => {
            getUnReadCount();
            messageList.value.forEach((item) => (item.read = true));
        })
        .catch(function (e) {
            console.log(e);
            ElMessage.error("接口报错，请稍后重试！");
        });
};

const emits = defineEmits(["callback", "closed"]);

const cancel = function () {
    emits("closed");
};

function quit() {
    emits("closed");
    router.push({ name: "cashier" });
}

const contentInfo = function (item) {
    if (!item) return;
    if (item.messageBusinessType == "Urgent" || item.messageBusinessType == "Ordinary") {
        return "";
    } else {
        return item.content;
    }
};

const contentInfoDetail = function (item) {
    if (!item) return;
    if (item.businessId && !item.businessType) {
        return item.content.replace(/(G\d+)/, '<span class="order-number">$1</span>');
    }
    {
        return item.content;
    }
};
const getServiceWorkOrders = function (item) {
    if (item.businessId && !item.businessType) {
        axios
            .get("/service/api/service-work-orders/findIdByNumber", {
                params: {
                    number: item.businessId,
                },
            })
            .then((res) => {
                if (res.data && res.data.status == 200) {
                    router.push({ name: "serviceWorkOrderDetails", query: { id: res.data.message } });
                    cancel();
                } else {
                    ElMessage.error("未找到工单");
                }
            })
            .catch(function (e) {
                ElMessage.error("接口报错，请稍后重试！");
            });
    }
};

function downloadFile(url, title) {
    utils.downloadFile1(url, title);
}

function numberToChinese(num) {
    const chineseNumbers = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
    const chineseTens = ["", "十", "百"]; // 用来表示十位和百位

    if (num < 0 || num > 100) {
        return "输入数字超出范围，仅支持 0-100";
    }

    if (num === 100) {
        return "一百";
    }

    let result = "";
    if (num >= 10) {
        let tens = Math.floor(num / 10); // 获取十位数字
        let ones = num % 10; // 获取个位数字

        if (tens === 1) {
            result += chineseTens[1]; // 如果十位是1，直接返回 "十"
        } else if (tens > 1) {
            result += chineseNumbers[tens] + chineseTens[1]; // 十位数字不为1，拼接十
        }

        if (ones !== 0) {
            result += chineseNumbers[ones]; // 添加个位数字
        } else if (tens !== 0) {
            result += chineseNumbers[0]; // 如果个位是0且十位不为0，加入“零”
        }
    } else {
        result += chineseNumbers[num]; // 如果是个位数字，直接返回
    }

    return result;
}
</script>
<style lang="scss">
.notification-main {
    position: fixed;
    z-index: 9;
    width: 100vw;
    height: 100vh;
    background: var(--page-bg-color);

    .notification-head {
        height: 69px;
        background-color: #fff;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 20px 53px;
        font-weight: 500;
        line-height: 29px;
        border-bottom: 1px solid #ebebf0;

        .left {
            color: var(--text-primary);
            font-size: 18px;
            cursor: pointer;
            display: flex;
            align-items: center;

            .iconfont {
                margin-right: 10px;
            }
        }

        .right {
            color: var(--text-general);
            font-size: 18px;
        }
    }
}

.c-model-notification {
    .c-pop-tooltip {
        max-width: 600px;
    }

    .c-model-tabTitle {
        display: flex;
    }

    .notice-item {
        display: flex;
        width: 100%;
        height: 98px;
        align-items: center;
        padding: 0 14px;
        cursor: pointer;
    }

    .notice-item:hover {
        background-color: var(--page-bg-color);
        border-radius: 12px;
    }

    .noData {
        height: 100%;
        font-size: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #909399;
    }

    .c-iconfont {
        font-size: 24px;
    }

    .c-iconfont1 {
        color: var(--brand-color);
    }

    .c-iconfont2 {
        color: #fb5657;
    }

    .c-iconfont3 {
        color: #d7a63f;
    }

    .c-iconfont4 {
        color: var(--auxiliary-color-6);
    }

    .c-iconfont5 {
        color: #9dd89e;
    }

    .c-iconfont6 {
        color: #ddab76;
    }

    .c-iconfont7 {
        color: var(--auxiliary-color-4);
    }

    .c-iconfont8 {
        color: #fb5657;
    }

    .notice-item-main {
        // width: 100%;
        margin-left: 10px;
    }

    .notice-item-title {
        display: flex;
        font-size: 16px;
        font-family:
            PingFangSC,
            PingFang SC;
        font-weight: 500;
        color: var(--text-primary);
        text-align: left;
        font-style: normal;
        margin-bottom: 4px;
        position: relative;
    }

    .notice-unRead-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background-color: #fb5657;
        position: relative;
        top: 6px;
        left: 6px;
        // margin-left: 4px;
        // margin-top: 2px;
        // position: absolute;
        // right: 2px;
        // top: 2px;
    }

    .notice-item-content {
        display: flex;
        justify-content: space-between;
        font-family:
            PingFangSC,
            PingFang SC;
        font-weight: 400;
        font-size: 14px;
        line-height: 20px;
        text-align: left;
        font-style: normal;
    }

    .notice-item-desc {
        color: var(--text-general);
        width: 180px;
        white-space: nowrap;
        /* 防止文本换行 */
        overflow: hidden;
        /* 隐藏超出容器的部分 */
        text-overflow: ellipsis;
        /* 超出部分显示省略号 */
    }

    .notice-item-time {
        color: var(--text-secondary);
        width: 146px;
        margin-top: 4px;
    }

    .chooseProduct1-view {
        width: 100%;
    }

    .chooseProduct1-view1 {
        width: 100%;
        height: 576px;
        display: flex;
    }

    .chooseProduct1-view-fr {
        width: 100%;
        height: 100%;
        padding: 0 20px 20px 20px;
        display: flex;

        .message-content {
            width: calc(100% - 204px);
            padding: 16px;
            overflow: auto;

            .message-content-title {
                font-size: 18px;
                font-weight: 500;
                margin-bottom: 20px;
                font-weight: bold;
            }
        }
    }

    .c-model-allNoticeTitle {
        cursor: pointer;
        font-family:
            PingFangSC,
            PingFang SC;
        font-weight: 500;
        color: var(--text-general);
        line-height: 25px;
        text-align: left;
        font-size: 16px;
        font-style: normal;
    }

    .c-model-unReadNoticeTitle {
        cursor: pointer;
        margin-left: 32px;
        font-family:
            PingFangSC,
            PingFang SC;
        font-weight: 400;
        font-size: 16px;
        color: var(--text-general);
        text-align: left;
        font-style: normal;
    }

    .read-all-notice-title {
        font-family:
            PingFangSC,
            PingFang SC;
        font-weight: 400;
        font-size: 16px;
        color: var(--auxiliary-color-6);
        line-height: 22px;
        text-align: left;
        font-style: normal;
        margin-right: 12px;
        cursor: pointer;
    }

    .activeTitle {
        color: var(--text-primary);
        font-size: 18px;
    }

    .order-number {
        color: var(--auxiliary-color-6);
        /* 紫色色值 */
        cursor: pointer;
        transition: text-decoration 0.2s;
    }

    .order-number:hover {
        text-decoration: underline;
    }
}
</style>
