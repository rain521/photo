<template>
    <div class="c-model-pop"></div>
    <div class="c-model" style="width: 800px">
        <div class="c-model-head" style="border-bottom: 0">
            <div class="c-model-tabTitle">
                <div class="activeTitle">{{ data.title || "通知" }}</div>
            </div>
            <!-- <span class="iconfont icon-cha cancelicon" style="margin-right: 8px;" @click="handleReadNotice()"></span> -->
        </div>
        <div class="c-model-body chooseProduct1-view" style="padding: 0; border-bottom: 0">
            <div class="chooseProduct1-view1" v-loading="loading">
                <div class="chooseProduct1-view-fr">
                    <div class="title-1">详情</div>
                    <div v-html="data.content" class="content-body"></div>
                    <div v-if="countdown" style="padding-bottom: 60px; padding-left: 8px; margin-top: 4px">支付倒计时：{{ countdown }}</div>
                    <div v-if="!countdown" style="height: 60px; width: 100%"></div>
                    <div class="title-1" style="margin-bottom: 6px">附件</div>
                    <div v-for="(file, index) in data.attach" :key="index" style="display: flex; align-items: flex-start; vertical-align: baseline; margin-bottom: 4px; cursor: pointer" @click="downloadFile(file.path, file.name)">
                        <span class="iconfont icon-lianjie" style="transform: rotate(90deg); font-size: 12px; color: var(--text-general); position: relative; top: 4px"></span>
                        <span style="margin: 0 8px; color: var(--text-general)">附件{{ numberToChinese(index + 1) }}:</span>
                        <span style="max-width: 90%"
                            >{{ file.name }}
                            <span class="iconfont icon-download" style="font-size: 12px; position: relative; top: 3px; color: rgb(62, 101, 251)"></span>
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <div class="c-model-foot" style="text-align: center">
            <el-button type="primary" size="large" style="width: 200px;" @click="handleReadNotice()" :disabled="data.readDuration !== 0"
                >我知道了<span v-if="data.readDuration !== 0">({{ data.readDuration }})</span></el-button
            >
            <el-button type="primary" size="large" style="width: 200px;" @click="goPay()" v-if="dataParam.storePay">去支付</el-button>
        </div>
    </div>
</template>
<script setup>
import { onMounted, ref, watch, inject, onBeforeUnmount } from "vue";
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

const props = defineProps({
    data: {
        type: Object,
        default: {},
    },
});

const messageList = ref([]);
const content = ref("");
const data = ref({});
const loading = ref(false);
const activeIndex = ref(0);
let timer = null;
let timer1 = null;
const countdown = ref("");
const payTimeOut = ref("");
const dataParam = ref({});

onMounted(() => {
    // init()
    // getUnReadCount()
    startDisabledCountdown();
    console.log("props.data", props.data);
    if (props.data) {
        data.value = JSON.parse(JSON.stringify(props.data));
        let _data = props.data.content.replace("xxxx小时xxxx分", "");
        console.log(props.data.content, _data);
        // 30
        if (props.data.param !== "" && props.data.param) {
            let param = JSON.parse(props.data.param);
            dataParam.value = param;
            // 门店支付的话需要展示支付倒计时
            if (param.storePay) {
                let originalDate = new Date(data.value.createdDate);
                let ss = param.payTimeOut * 60 * 1000;
                const tempTime = originalDate.getTime() + ss;
                console.log(data.value.createdDate, originalDate, tempTime);
                const _timeOut = new Date(tempTime).toISOString();
                payTimeOut.value = _timeOut;
            }
        }
    }
});

// 启动按钮禁用倒计时
const startDisabledCountdown = () => {
    timer = setInterval(() => {
        if (data.value.readDuration > 0) {
            data.value.readDuration--;
        } else {
            clearInterval(timer);
        }
    }, 1000);
};

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

// 处理未读消息
const handleReadNotice = function (pay) {
    if (data.value.readDuration > 0 && !pay) return;
    axios
        .get(`/service/api/user-messages/${data.value.id}`)
        .then((res) => {
            if (!pay) {
                getUnReadCount();
            }
            cancel();
        })
        .catch(function () {
            ElMessage.error("接口报错，请稍后重试！");
        });
};

function downloadFile(url, title) {
    utils.downloadFile1(url, title);
}

const emits = defineEmits(["callback", "closed"]);

const cancel = function () {
    emits("closed");
};
const contentInfo = function (item) {
    if (item.businessId) {
        return item.content.replace(/(G\d+)/, '<span class="order-number">$1</span>');
    } else {
        return item.content;
    }
};

function numberToChinese(num) {
    const chineseNumbers = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
    const chineseTens = ["", "十", "百"];
    if (num < 0 || num > 100) {
        return "输入数字超出范围，仅支持 0-100";
    }
    if (num === 100) {
        return "一百";
    }
    let result = "";
    if (num >= 10) {
        let tens = Math.floor(num / 10);
        let ones = num % 10;

        if (tens === 1) {
            result += chineseTens[1];
        } else if (tens > 1) {
            result += chineseNumbers[tens] + chineseTens[1];
        }
        if (ones !== 0) {
            result += chineseNumbers[ones];
        } else if (tens !== 0) {
            result += chineseNumbers[0];
        }
    } else {
        result += chineseNumbers[num];
    }

    return result;
}

const formatTimeRemaining = () => {
    const now = new Date();
    if (!payTimeOut.value) {
        return "";
    }
    let endDate = new Date(payTimeOut.value);
    const diffInSeconds = Math.floor((endDate - now) / 1000);
    const hours = Math.floor(diffInSeconds / 3600);
    const minutes = Math.floor((diffInSeconds % 3600) / 60);
    const seconds = diffInSeconds % 60;
    if (hours <= 0 && minutes <= 0 && seconds <= 0) {
        countdown.value = "";
        if (timer1) clearInterval(timer1);
        return;
    }
    countdown.value = `${hours.toString().padStart(2, "0")}小时${minutes.toString().padStart(2, "0")}分`;
};

const goPay = function () {
    handleReadNotice(true);
    const query = {
        id: dataParam.value.outId,
        pay: true,
    };
    router.push({ path: "/delivery-product-details-pay", query });
};

const startRefresh = () => {
    timer1 = setInterval(() => {
        formatTimeRemaining();
    }, 1000);
};
startRefresh();
onBeforeUnmount(() => {
    if (timer) {
        clearInterval(timer);
    }
    if (timer1) {
        clearInterval(timer1);
    }
});
</script>
<style lang="scss" scoped>
.c-pop-tooltip {
    max-width: 600px;
}

.c-model-tabTitle {
    display: flex;
}

.notice-item {
    display: flex;
    width: 100%;
    height: 76px;
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

.notice-item-main {
    width: 100%;
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
}

.notice-unRead-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: #fb5657;
    margin-left: 4px;
    margin-top: 2px;
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
    width: 540px;
    // display: -webkit-box;
    // -webkit-box-orient: vertical;
    // -webkit-line-clamp: 2;
    // overflow: hidden;
}

.notice-item-time {
    color: var(--text-secondary);
    width: 146px;
}

.chooseProduct1-view {
    width: 100%;
}

.chooseProduct1-view1 {
    width: 100%;
    height: 576px;
    overflow: auto;
    display: block;
    padding-bottom: 20px;
}

.title-1 {
    font-size: 16px;
    font-family:
        PingFangSC,
        PingFang SC;
    font-weight: bold;
    height: 26px;
    line-height: 26px;
}

.content-body {
    :is(span) {
        font-size: 12px;
    }
}

.chooseProduct1-view-fr {
    width: 100%;
    height: 100%;
    padding: 0 20px 20px 20px;
    overflow: auto;
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

.c-model-foot {
    border-top: 1px solid #ebebf0;
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
</style>
