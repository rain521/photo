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
    photoType(item) {
        switch (item) {
            case "background":
                return "背景";
            case "mask":
                return "蒙版";
            case "material":
                return "素材";
            default:
                return "";
        }
    },
};
