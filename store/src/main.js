import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import axios from "axios";
import VueAxios from "vue-axios";
import "./utils/axios";
import pinia from "@/stores";
import ElementPlus from "element-plus";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
import "element-plus/dist/index.css";
import "./assets/css/main.scss";
import print from "vue3-print-nb";
import JsBarcode from "jsbarcode";
import VueLuckyCanvas from "@lucky-canvas/vue";

const app = createApp(App);
app.use(ElementPlus, { locale: zhCn });
app.use(pinia);
app.use(router);
app.use(VueAxios, axios);
app.use(print);
app.use(VueLuckyCanvas);
app.provide("$axios", app.config.globalProperties.axios);
app.config.globalProperties.jsbarcode = JsBarcode;
app.mount("#app");

import { storeToRefs } from "pinia";
import useUserStore from "@/stores/modules/user";

const userStore = useUserStore();
const { user } = storeToRefs(userStore);
app.directive("integer-only", {
    mounted(el) {
        el.addEventListener("input", (event) => {
            const value = event.target.value;
            if (value) {
                event.target.value = Number(value.replace(/\D/g, "")); // 只保留数字
            }
        });
    },
});
app.config.globalProperties.$filters = {
    authoritieInfo(value) {
        //判断是否有权限
        if (user && user.value && user.value.authorities && user.value.authorities.indexOf(value) > -1) {
            return true;
        }
        return false;
    },
    salerOrderStatus(item) {
        switch (item) {
            case "Close":
                return "已关闭";
            case "Cancelled":
                return "已取消";
            case "Created":
                return "待支付";
            case "Paying":
                return "待支付";
            case "PayFail":
                return "待支付";
            case "Paid":
                return "未完成";
            case "Submit":
                return "待提交";
            case "Unchecked":
                return "待核验";
            case "Producing":
                return "未完成";
            case "Unshipped":
                return "待交付";
            case "Receiving":
                return "待交付";
            case "Delivered":
                return "待收货";
            case "Completed":
                return "已完成";
            case "Refund":
                return "退款";
            case "RefundFail":
                return "退款失败";
            default:
                return "";
        }
    },
    orderLineStatus(item) {
        switch (item) {
            case "New":
                return "待生产";
            case "WebApiCreateFailed":
                return "新建订单失败";
            case "WebApiPaiFailed":
                return "支付失败";
            case "Justify":
                return "组版中";
            case "CombinationError":
                return "组版失败";
            case "OutFailed":
                return "推入生产失败";
            case "Unchecked":
                return "待核验";
            case "Producing":
                return "生产中";
            case "Delivered":
                return "已发货";
            case "Receiving":
                return "已到店";
            case "Received":
                return "已收货";
            case "Completed":
                return "已完成";
            case "Cancelled":
                return "已取消";
            default:
                return item;
        }
    },
    orderLineStatusColor(item) {
        switch (item) {
            case "New":
                return "var(--auxiliary-color-1)"//"待生产";
            case "WebApiCreateFailed":
                return "var(--auxiliary-color-5)"//"新建订单失败";
            case "WebApiPaiFailed":
                return "var(--auxiliary-color-5)"//"支付失败";
            case "Justify":
                return "var(--auxiliary-color-6)"//"组版中";
            case "CombinationError":
                return "var(--auxiliary-color-5)"//"组版失败";
            case "OutFailed":
                return "var(--auxiliary-color-5)"//"推入生产失败";
            case "Unchecked":
                return "var(--auxiliary-color-6)"//"待核验";
            case "Producing":
                return "var(--auxiliary-color-6)"//"生产中";
            case "Delivered":
                return "var(--auxiliary-color-4)"//"已发货";
            case "Receiving":
                return "var(--brand-color)"//"已到店";
            case "Received":
                return "var(--auxiliary-color-2)"//"已收货";
            case "Completed":
                return "var(--auxiliary-color-2)";
            case "Cancelled":
                return "var(--text-primary)"//"已取消";
            default:
                return item;
        }
    },
    productLineStatus(item) {
        switch (item) {
            case "New":
                return "新建";
            case "Unprepared":
                return "未备货";
            case "NotInStore":
                return "未到店";
            case "Receiving":
                return "待交付";
            case "Producing":
                return "生产中";
            case "Delivered2":
                return "待收货";
            case "Completed":
                return "已交付";
            case "Cancelled":
                return "退货";
            case "Close":
                return "已关闭";
            default:
                return item;
        }
    },
    sourceType(item) {
        switch (item) {
            case "online":
                return "线上小程序";
            case "online_mi":
                return "Mi商城";
            case "offline":
                return "线下门店";
            default:
                return item;
        }
    },

    afterSaleStatus(item) {
        switch (item) {
            case "Pending":
                return "未处理";
            case "Rejected":
                return "已拒绝";
            case "ApproveReturn":
                return "同意退货";
            case "Receiving":
                return "待收货";
            case "Finished":
                return "已完成";
            case "Closed":
                return "已关闭";
            case "TimeoutClosed":
                return "已关闭";
            default:
                return item;
        }
    },

    afterSaleType(item) {
        switch (item) {
            case "ReturnAndRefund":
                return "退货退款";
            case "Refund":
                return "仅退款";
            case "Retake":
                return "拍摄重拍";
            default:
                return item;
        }
    },
    deliveryType(item) {
        switch (item) {
            case "Delivery":
                return "快递配送";
            case "Delivery_Quick":
                return "加急快递";
            case "Self":
                return "门店自提";
            default:
                return item;
        }
    },
    afterSalesType(item) {
        switch (item) {
            case "ReturnAndRefund":
                return "退货退款";
            case "Refund":
                return "仅退款";
            case "Retake":
                return "拍摄重拍";
            default:
                return item;
        }
    },
    refundGoodsType(item) {
        switch (item) {
            case "ToSubmit":
                return "待提交";
            case "ToCheck":
                return "审核中";
            case "CheckPass":
                return "待确认退货";
            case "CheckReject":
                return "审核拒绝";
            case "Confirm":
                return "退货完成";
            case "Close":
                return "已关闭";
            case "Cancel":
                return "已作废";
            default:
                return item;
        }
    },
    date(time) {
        if (time != null && time != "") {
            let date = new Date(time);
            let year = date.getFullYear();
            let month = date.getMonth() + 1; // 月份是从 0 开始的，所以要加 1
            let day = date.getDate();

            let hours = date.getHours();
            let minutes = date.getMinutes();
            let seconds = date.getSeconds();
            return year + "/" + (month < 10 ? "0" + month : month) + "/" + (day < 10 ? "0" + day : day) + " " + (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds);
        } else {
            return "";
        }
    },
    date1(time) {
        if (time != null && time != "") {
            let date = new Date(time);
            let year = date.getFullYear();
            let month = date.getMonth() + 1; // 月份是从 0 开始的，所以要加 1
            let day = date.getDate();
            return year + "/" + (month < 10 ? "0" + month : month) + "/" + (day < 10 ? "0" + day : day);
        } else {
            return "";
        }
    },
    //月份
    date2(time) {
        if (time != null && time != "") {
            let date = new Date(time);
            let year = date.getFullYear();
            let month = date.getMonth() + 1; // 月份是从 0 开始的，所以要加 1
            let day = date.getDate();
            return year + "-" + (month < 10 ? "0" + month : month);
        } else {
            return "";
        }
    },
    date3(time) {
        if (time != null && time != "") {
            let date = new Date(time);
            let year = date.getFullYear();
            let month = date.getMonth() + 1; // 月份是从 0 开始的，所以要加 1
            let day = date.getDate();

            let hours = date.getHours();
            let minutes = date.getMinutes();
            let seconds = date.getSeconds();
            return (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds);
        } else {
            return "";
        }
    },
    date4(time) {
        if (time != null && time != "") {
            let date = new Date(time);
            let year = date.getFullYear();
            let month = date.getMonth() + 1; // 月份是从 0 开始的，所以要加 1
            let day = date.getDate();
            return year + "-" + (month < 10 ? "0" + month : month) + "-" + (day < 10 ? "0" + day : day);
        } else {
            return "";
        }
    },
    date5(time) {
        if (time != null && time != "") {
            let date = new Date(time);
            let year = date.getFullYear();
            let month = date.getMonth() + 1; // 月份是从 0 开始的，所以要加 1
            let day = date.getDate();

            let hours = date.getHours();
            let minutes = date.getMinutes();
            let seconds = date.getSeconds();
            return year + "-" + (month < 10 ? "0" + month : month) + "-" + (day < 10 ? "0" + day : day) + " " + (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds);
        } else {
            return "";
        }
    },
    money(money) {
        if (money != null && money != "") {
            var tpMoney = "0.00";
            if (undefined != money) {
                tpMoney = money;
            }
            if (money >= 0) {
                tpMoney = new Number(tpMoney);
                if (isNaN(tpMoney)) {
                    return "0.00";
                }
                tpMoney = tpMoney.toFixed(2) + "";
                var re = /^(-?\d+)(\d{3})(\.?\d*)/;
                while (re.test(tpMoney)) {
                    tpMoney = tpMoney.replace(re, "$1,$2$3");
                }
                return "￥" + tpMoney;
            } else {
                tpMoney = new Number(tpMoney);
                if (isNaN(tpMoney)) {
                    return "0.00";
                }
                tpMoney = Number(tpMoney) > 0 ? tpMoney : Number(tpMoney) * -1;
                tpMoney = tpMoney.toFixed(2) + "";
                var re = /^(-?\d+)(\d{3})(\.?\d*)/;
                while (re.test(tpMoney)) {
                    tpMoney = tpMoney.replace(re, "$1,$2$3");
                }
                return "-￥" + tpMoney;
            }
        } else {
            return "￥" + "0.00";
        }
    },
    money1(money) {
        if (money != null && money != "") {
            var tpMoney = 0;
            if (undefined != money) {
                tpMoney = money;
            }
            tpMoney = new Number(tpMoney);
            if (isNaN(tpMoney)) {
                return "0.00";
            }
            tpMoney = tpMoney.toFixed(2) + "";
            var re = /^(-?\d+)(\d{3})(\.?\d*)/;
            while (re.test(tpMoney)) {
                tpMoney = tpMoney.replace(re, "$1,$2$3");
            }
            return tpMoney;
        } else {
            return "0.00";
        }
    },
    serviceWorkProductType(item) {
        switch (item) {
            case "Standard":
                return "零售品";
            case "PhotographPrint":
                return "证件照拍摄";
            case "ImgPrint":
                return "证件照加印";
            case "PhotoPrint":
                return "照片打印";
            case "CustomPrint":
                return "定制品";
            case "GiftCard":
                return "礼品卡";
            default:
                return item;
        }
    },
    productType(item) {
        switch (item) {
            case "CustomPrint":
                return "定制品";
            case "ImmediatelyPrint":
                return "立等可取";
            case "Standard":
                return "零售品";
            case "Material":
                return "耗材";
            case "GiftCard":
                return "礼品卡";
            case "PhotographPrint":
                return "证件照拍摄";
            case "ImgPrint":
                return "证件照加印";
            case "PhotoPrint":
                return "照片打印";
            default:
                return item;
        }
    },
    methodOfPayment(item) {
        switch (item) {
            case "third":
                return "三方核销";
            case "wallet":
                return "钱包余额";
            case "shouqianba":
                return "收钱吧";
            case "meituan":
                return "美团/大众";
            case "xiaohongshu":
                return "小红书";
            case "douyin":
                return "抖音";
            case "qita":
                return "其他";
            case "wechat":
                return "微信";
            case "alipay":
                return "支付宝";
            case "storedValueCard":
                return "储值卡";
            case "weCom":
                return "企业微信";
            case "unionPay":
                return "拉卡拉";
            case "cloudQuickPass":
                return "云闪付";
            default:
                return "";
        }
    },
    planOrdersStatus(item) {
        switch (item) {
            case "Created":
                return "未完成";
            case "Progressing":
                return "未完成";
            case "Completed":
                return "已完成";
            case "Close":
                return "已关闭";
            default:
                return item;
        }
    },
    inventoryRecordsType(item) {
        switch (item) {
            case "PURCHASE_IN":
                return "报货入库";
            case "SALES_OUT":
                return "销售出库";
            case "RETURN_IN":
                return "退货入库";
            case "RETURN_OUT":
                return "退货出库";
            case "OTHER_IN":
                return "其他入库";
            case "OTHER_OUT":
                return "其他出库";
            default:
                return item;
        }
    },
    stockOrdersStatus(item) {
        switch (item) {
            case "UNSUBMITTED":
                return "待提交";
            case "UNAUDITED":
                return "审核中";
            case "APPROVED":
                return "审核通过";
            case "REJECTED":
                return "审核拒绝";
            case "UNRECEIVED":
                return "待入库";
            case "PART_RECEIVED":
                return "部分到货";
            case "FINISHED":
                return "已完成";
            case "CLOSED":
                return "已关闭";
            case "CANCELLED":
                return "已作废";
            case "UNPAID":
                return "待支付";
            case "PAYING":
                return "待支付";
            case "UNSHIPPED":
                return "待发货";
            default:
                return item;
        }
    },
    storeCustomCostItemsStatus(item) {
        switch (item) {
            case "NEW":
                return "未提交";
            case "SUBMIT":
                return "已提交";
            case "CLOSE":
                return "已关闭";
            default:
                return item;
        }
    },
    storeCustomCostItemsStatus1(item) {
        switch (item) {
            case "NEW":
                return "var(--auxiliary-color-1)";
            case "SUBMIT":
                return "var(--auxiliary-color-2)";
            case "CLOSE":
                return "var(--text-primary)";
            default:
                return item;
        }
    },
    fileSize(limit) {
        var size = "";
        if (limit < 0.1 * 1024) {
            //如果小于0.1KB转化成B
            size = limit.toFixed(2) + "B";
        } else if (limit < 0.1 * 1024 * 1024) {
            //如果小于0.1MB转化成KB
            size = (limit / 1024).toFixed(2) + "KB";
        } else if (limit < 0.1 * 1024 * 1024 * 1024) {
            //如果小于0.1GB转化成MB
            size = (limit / (1024 * 1024)).toFixed(2) + "MB";
        } else {
            //其他转化成GB
            size = (limit / (1024 * 1024 * 1024)).toFixed(2) + "GB";
        }
        var sizestr = size + "";
        var len = sizestr.indexOf("\.");
        var dec = sizestr.substr(len + 1, 2);
        if (dec == "00") {
            //当小数点后为00时 去掉小数部分
            return sizestr.substring(0, len) + sizestr.substr(len + 3, 2);
        }
        return sizestr;
    },
    serviceWorkOrdersStatus(item) {
        switch (item) {
            case "ToBeExecuted":
                return "待执行";
            case "ToBeUpload":
                return "待上传原片";
            case "ToBeRetouch":
                return "待接单";
            case "Retouching":
                return "修片中";
            case "RetouchComplete":
                return "修片完成";
            case "ConformRetouchComplete":
                return "确认修片完成";
            case "Complete":
                return "已完成";
            case "Close":
                return "已关闭";
            default:
                return item;
        }
    },
    serviceWorkOrdersStatus1(item) {
        switch (item) {
            case "ToBeExecuted":
                return 1;
            case "ToBeUpload":
                return 1;
            case "ToBeRetouch":
                return 2;
            case "Retouching":
                return 3;
            case "RetouchComplete":
                return 4;
            case "ConformRetouchComplete":
                return 5;
            case "Complete":
                return 5;
            case "Close":
                return 5;
            default:
                return item;
        }
    },
    qiniuImage(item) {
        if (item) {
            return item + "?imageMogr2/interlace/1/thumbnail/800x800>";
        }
    },
    // 修片等级
    getRetouchesLevel(item) {
        switch (item) {
            case "one":
                return "1级";
            case "two":
                return "2级";
            case "three":
                return "3级";
            case "four":
                return "4级";
            case "five":
                return "5级";
            case "six":
                return "6级";
            case "seven":
                return "7级";
            case "eight":
                return "8级";
            case "nine":
                return "9级";
            default:
                return item;
        }
    },
};
