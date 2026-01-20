<template>
    <div id="LODOP_OB" v-if="order" class="lodop-view" ref="lodopRef" style="opacity: 0">
        <div style="width: 100%; font-family: &quot;微软雅黑&quot;; box-sizing: border-box; font-size: 12px">
            <div style="height: 40px;"></div>
            <div style="text-align: center;font-size: 14px;font-weight: bold;color:#333;margin-bottom: 16px;">复 本 商 店</div>
            <div style="display: flex; justify-content: space-between">
                <div>{{ order.storeName }}</div>
                <div>{{ $filters.date4(order.createdDate) }}</div>
            </div>
            <div style="display: flex; justify-content: space-between; margin-top: 6px">
                <div class="font-alimama">{{ store.phone }}</div>
                <div style="display: inline-block">{{ $filters.date3(order.createdDate) }}</div>
            </div>
            <div class="lodop-hr" style="margin-top: 7px"></div>
            <table class="lodop-table" style="margin-top: 20px">
                <thead>
                    <tr>
                        <th style="text-align: left">品名</th>
                        <th>数量</th>
                        <th>单价</th>
                        <th>金额</th>
                    </tr>
                </thead>
                <tbody>
                    <template v-for="item in order.productLines" :key="item.id">
                        <tr>
                            <td :colspan="4" style="text-align: left; padding: 3px 0 0">{{ item.productName }}</td>
                        </tr>
                        <tr>
                            <td style="text-align: left; padding-top: 0">{{ item.sku }}</td>
                            <td class="font-alimama" style="width: 35px; max-width: 35px; min-width: 35px; text-align: right; padding-top: 0">{{ item.copy + item.cancelCopy }}</td>
                            <td class="font-alimama" style="width: 50px; max-width: 50px; min-width: 50px; word-break: break-all; padding-top: 0">{{ $filters.money1(item.price) }}</td>
                            <td class="font-alimama" style="width: 50px; max-width: 50px; min-width: 50px; word-break: break-all; padding-top: 0">{{ $filters.money1(item.payAmount) }}</td>
                        </tr>
                    </template>
                </tbody>
            </table>
            <div class="lodop-hr"></div>
            <div class="lodop-view1" style="margin: 7px 0">
                <div>合计</div>
                <div class="font-alimama">{{ $filters.money1(payAmount) }}</div>
            </div>
            <div class="lodop-view2">
                <div>原价</div>
                <div class="font-alimama">{{ $filters.money1(order.amount) }}</div>
            </div>
            <div class="lodop-view2" style="margin-top: 4px">
                <div>优惠</div>
                <div class="font-alimama">{{ $filters.money1(order.discountAmount) }}</div>
            </div>
            <div class="lodop-view2" style="margin-top: 4px" v-if="order.deductionAmount || order.storedValueCardAmount || order.thirdAmount || order.giftVoucher">
                <div>付款方式</div>
            </div>
            <div class="lodop-view3" v-if="order.deductionAmount">
                <div style="text-align: right; padding-right: 4px">{{ $filters.methodOfPayment(deductionPayMethod) }}</div>
                <div class="font-alimama" style="text-align: right; width: 100px">{{ $filters.money1(order.deductionAmount) }}</div>
            </div>
            <div class="lodop-view3" v-if="order.storedValueCardAmount">
                <div style="text-align: right; padding-right: 4px">储值卡</div>
                <div class="font-alimama" style="text-align: right; width: 100px">{{ $filters.money1(order.storedValueCardAmount) }}</div>
            </div>
            <div class="lodop-view3" v-if="order.thirdAmount">
                <div style="text-align: right; padding-right: 4px">{{ $filters.methodOfPayment(order.methodOfPayment2) }}</div>
                <div class="font-alimama" style="text-align: right; width: 100px">{{ $filters.money1(order.thirdAmount) }}</div>
            </div>
            <div class="lodop-view3" v-if="order.giftVoucher">
                <div style="text-align: right; padding-right: 4px">兑换券</div>
                <div class="font-alimama" style="text-align: right; width: 100px">{{ order.giftVoucher }}</div>
            </div>
            <div v-show="refund && refund.length > 0">
                <div class="lodop-hr" style="margin-top: 16px"></div>
                <div style="margin-top: 6px; font-weight: bold; font-size: 14px">退货信息</div>
                <table class="lodop-table" style="margin-top: 10px">
                    <thead>
                        <tr>
                            <th style="text-align: left">品名</th>
                            <th>数量</th>
                            <th>单价</th>
                            <th>金额</th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-for="item in refund" :key="item.id">
                            <tr>
                                <td :colspan="4" style="text-align: left; padding: 3px 0 0">{{ item.productName }}</td>
                            </tr>
                            <tr>
                                <td style="text-align: left; padding-top: 0">{{ item.sku }}</td>
                                <td class="font-alimama" style="width: 35px; max-width: 35px; min-width: 35px; text-align: right; padding-top: 0">{{ item.cancelCopy }}</td>
                                <td class="font-alimama" style="width: 50px; max-width: 50px; min-width: 50px; word-break: break-all; padding-top: 0">{{ $filters.money1(item.price) }}</td>
                                <td class="font-alimama" style="width: 50px; max-width: 50px; min-width: 50px; word-break: break-all; padding-top: 0">{{ $filters.money1(item.payAmount) }}</td>
                            </tr>
                        </template>
                    </tbody>
                </table>
                <div class="lodop-hr" style="margin: 6px 0" v-if="(order.deductionAmount && order.deductionAmount > 0) || (order.refundStoredValueCardAmount && order.refundStoredValueCardAmount > 0) || (order.refundAmount && order.refundAmount > 0)"></div>
                <div class="lodop-view2" v-show="order.deductionAmount && order.deductionAmount > 0">
                    <div>退回{{ $filters.methodOfPayment(deductionPayMethod) }}</div>
                    <div class="font-alimama">{{ $filters.money1(order.deductionAmount) }}</div>
                </div>
                <div class="lodop-view2" v-show="order.refundStoredValueCardAmount && order.refundStoredValueCardAmount > 0">
                    <div>退回储值卡</div>
                    <div class="font-alimama">{{ $filters.money1(order.refundStoredValueCardAmount) }}</div>
                </div>
                <div class="lodop-view2" v-show="order.refundAmount && order.refundAmount > 0">
                    <div>退回{{ $filters.methodOfPayment(order.methodOfPayment2) }}</div>
                    <div class="font-alimama">{{ $filters.money1(order.refundAmount) }}</div>
                </div>
            </div>
            <div class="lodop-hr" style="margin-top: 6px"></div>
            <div class="font-alimama" style="margin: 4px 0">{{ order.number }}</div>
            <div class="lodop-hr"></div>
            <div style="margin-top: 16px; text-align: center" v-if="wechatCustomer">
                <!-- <div style="width: 120px;height: 150px;" id="wechatCustomer"></div> -->
                <img :src="wechatCustomer" style="width: 180px" />
                <div style="margin-top: 8px">【成为店长好友】提供专属服务</div>
                <div class="lodop-hr" style="margin-top: 12px"></div>
            </div>
            <div style="margin-top: 12px; font-size: 16px; letter-spacing: 1px; font-weight: bold; text-align: center">为生活每一个闪亮</div>
            <div style="margin-top: 12px; width: 100%; overflow: hidden; text-align: center">
                <Barcode :value="order.number"></Barcode>
                <span style="font-size: 12px; margin-top: 20px">{{ order.number }}</span>
            </div>
            <div style="width: 100%; height: 40px"></div>
        </div>
    </div>
    <div style="display: none" id="LODOP_OB_LOGO">
        <img :src="logo" />
    </div>
</template>

<script setup>
import { inject, nextTick, onMounted, ref, watch } from "vue";
import { ElMessage } from "element-plus";
import Barcode from "./Barcode.vue";

import { storeToRefs } from "pinia";
import useUserStore from "@/stores/modules/user";
import Decimal from "decimal.js";
import logo from "../assets/image/logo2.png";
const userStore = useUserStore();
const { user, store } = storeToRefs(userStore);

const axios = inject("$axios");
const props = defineProps({
    orderId: {
        type: [Number, String],
    },
});
const emits = defineEmits(["close"]);
function quit() {
    emits("close");
}
const orderId = ref(props.orderId);
onMounted(() => {
    if (props.orderId) {
        orderId.value = props.orderId;
        init();
    }
});
const order = ref();
const loading = ref(false);
const refund = ref();
const payAmount = ref();
const deductionPayMethod = ref();
const wechatCustomer = ref();

enhanceImageQuality(store.value.wechatCustomer, 600, 600).then(function (item) {
    wechatCustomer.value = item;
});
function init() {
    order.value = null;
    loading.value = true;
    axios
        .get("/service/api/sales-orders/byStoreView/" + orderId.value)
        .then((res) => {
            if (res.status == 200 || res.status == 201) {
                order.value = res.data;
                order.value.quantity = 0;
                refund.value = [];
                payAmount.value = new Decimal(order.value.payAmount).add(new Decimal(order.value.freight || 0));
                order.value.giftVouchers = [];
                order.value.productLines.forEach(function (productLine) {
                    order.value.quantity += productLine.copy;
                    order.value.quantity += productLine.cancelCopy;
                    if (productLine.cancelCopy && productLine.cancelCopy > 0) {
                        refund.value.push(productLine);
                    }
                    if (productLine.giftVouchers) {
                        productLine.giftVouchers.forEach(function (giftVoucher) {
                            order.value.giftVouchers.push(giftVoucher.code);
                        });
                    }
                });
                if (order.value.giftVouchers && order.value.giftVouchers.length > 0) {
                    order.value.giftVoucher = order.value.giftVouchers.join(",");
                }
                if (order.value.deductionCodeList && order.value.deductionCodeList.length > 0) {
                    order.value.deductionCodeList.forEach(function (item) {
                        if (item.payMethod != "storedValueCard") {
                            deductionPayMethod.value = item.payMethod;
                        }
                    });
                }
                setTimeout(function () {
                    nextTick(() => {
                        printPdf();
                    });
                }, 500);
            } else {
                ElMessage.error(res.data.message || "系统报错");
            }
            loading.value = false;
        })
        .catch(function (error) {
            loading.value = false;
        });
}

// 云打印方案
const lodopRef = ref(null);
const printPdf = () => {
    let LODOP = window.getCLodop();
    if (LODOP) {
        let style = `<style>
                     body { margin: 0; padding: 0; border: 0;box-sizing:border-box;}
                    .lodop-view{box-sizing:border-box;}
                    .lodop-table{width: 100%; text-align: left;letter-spacing: 0;}
                    .lodop-table thead tr{}
                    .lodop-table thead tr th{height: 20px; text-align: right;font-weight: 400;border-bottom: 2px dashed #979797;font-size: 12px;}
                    .lodop-table tbody tr td{padding: 3px 0;text-align: right;box-sizing:border-box;font-size: 12px;}
                    .lodop-hr{width: 100%; height:1px;border-bottom: 2px dashed #979797;}
                    .lodop-view1{display: flex; justify-content: space-between; align-items: center;font-size: 16px;font-weight: bold;}
                    .lodop-view2{display: flex; justify-content: space-between; align-items: center;}
                    .lodop-view3{display: flex; justify-content: flex-end; align-items: center; line-height: 16px;}

                    @font-face {
                      font-family: "AlimamaFangYuanTiVF";
                      src: url("../assets/font/AlimamaFangYuanTiVF-Thin.ttf") format('truetype'),
                            url("../assets/font/AlimamaFangYuanTiVF-Thin.woff") format('woff'),
                            url("../assets/font/AlimamaFangYuanTiVF-Thin.woff2") format('woff2');
                    }
                    @font-face {
                      font-family: "SourceHanSansCN-Bold";
                      src: url("../assets/font/SourceHanSansCN-Bold.otf");
                    }
                    @font-face {
                      font-family: "SourceHanSansCN-Normal";
                      src: url("../assets/font/SourceHanSansCN-Normal.otf");
                    }
                    .font-alimama {
                      font-family: "AlimamaFangYuanTiVF";
                    }
                    .font-hansans-Normal {
                      font-family: "SourceHanSansCN-Normal";
                    }
                    .font-hansans-Bold {
                      font-family: "SourceHanSansCN-Bold";
                    }
                    </style>`;
        LODOP.SET_LICENSES("","95C0CDA8196C79228EE6BC2A46535B72869","","");
        LODOP.PRINT_INIT("");
        LODOP.SET_PRINT_PAGESIZE(3, "72mm", 10, ""); // 纸张方向大小
        LODOP.ADD_PRINT_IMAGE(20, 40, "50mm", "13.86mm", `<img src=${logo} style="width: 500px;" />`);
        LODOP.SET_PRINT_STYLEA(0, "Position", 1); // 启用绝对定位
        LODOP.SET_PRINT_STYLEA(0, "Stretch", 2); //图片的(可变形)扩展缩放模式
        LODOP.SET_PRINT_STYLEA(0, "ImageQuality", 9);
        LODOP.SET_PRINT_STYLEA(0, "Stretch", 2);
        LODOP.SET_PRINT_STYLEA(0, "RenderMode", 1); // 高质量渲染模式
        LODOP.ADD_PRINT_HTM(0, 0, "72mm", "100%", style + document.getElementById("LODOP_OB").innerHTML); // print为要打印的html ID名称：
        // LODOP.PRINT_DESIGN() // 设计模式
        LODOP.PRINT(); //直接打印
        // LODOP.PREVIEW() // 打印预览
        nextTick(() => {
            printReceipts();
            quit();
        });
    } else {
        nextTick(() => {
            quit();
        });
    }
};
function topInfo() {
    // 获取元素
    const aid = document.getElementById("LODOP_OB");
    const bid = document.getElementById("wechatCustomer");

    // 计算父元素aid的内容区域起始位置（内容顶部 = 边框顶部 + 上边框宽度 + 上内边距）
    const aidRect = aid.getBoundingClientRect();
    const aidStyle = getComputedStyle(aid);
    const aidBorderTop = parseFloat(aidStyle.borderTopWidth) || 0;
    const aidPaddingTop = parseFloat(aidStyle.paddingTop) || 0;

    // 父元素aid的内容区域顶部在文档中的坐标
    const aidContentTop = aidRect.top + aidBorderTop + aidPaddingTop;

    // 子元素bid的顶部在文档中的坐标
    const bidRect = bid.getBoundingClientRect();
    const bidTop = bidRect.top;

    // 最终距离：bid顶部 - aid内容区域顶部
    const distance = (bidTop - aidContentTop) * (25.4 / 203);
    return distance;
}
function printReceipts() {
    axios.get("/service/api/sales-orders/printReceipts/", { params: { id: order.value.id } });
}
function enhanceImageQuality(url, width, height) {
    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.onload = function () {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            // 提升分辨率
            canvas.width = width * 2;
            canvas.height = height * 2;

            // 高质量绘制
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = "high";
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            // 锐化处理（示例）
            // ...此处添加锐化算法...

            // 转换为PNG格式
            resolve(canvas.toDataURL("image/png"));
        };
        img.src = url;
    });
}

//打印方案二 vue3-print-nb
// const  printViewInfo =ref({
//     id: "print", //打印区域的唯一的id属性
//     popTitle: '配置页眉标题', // 页眉文字 （不设置时显示undifined）（页眉页脚可以在打印页面的更多设置的选项中取消勾选）
//     // extraHead: '打印，印刷', // 最左上方的头部文字，附加在head标签上的额外标签，使用逗号分割
//     preview: false, // 是否启动预览模式，默认是false （开启预览模式ture会占满整个屏幕，不建议开启，除非业务需要）
//     previewTitle: '预览的标题', // 打印预览的标题(预览模式preview为true时才显示)
//     previewPrintBtnLabel: '预览结束，开始打印', // 打印预览的标题下方的按钮文本，点击可进入打印(预览模式preview为true时才显示)
//     zIndex: 20002, // 预览窗口的z-index，默认是20002，最好比默认值更高
//     previewBeforeOpenCallback (that) { console.log('正在加载预览窗口！'); }, // 预览窗口打开之前的callback (预览模式preview为true时才执行) （that可以取到data里的变量值）
//     previewOpenCallback () { console.log('已经加载完预览窗口，预览打开了！') }, // 预览窗口打开时的callback (预览模式preview为true时才执行)
//     beforeOpenCallback () { console.log('开始打印之前！') }, // 开始打印之前的callback
//     openCallback () { console.log('执行打印了！') }, // 调用打印时的callback
//     closeCallback () { console.log('关闭了打印工具！') }, // 关闭打印的callback(无法区分确认or取消)
//     clickMounted () { console.log('点击v-print绑定的按钮了！') },
//     // url: 'http://localhost:8080/', // 打印指定的URL，确保同源策略相同
//     // asyncUrl (reslove) {
//     //   setTimeout(() => {
//     //     reslove('http://localhost:8080/')
//     //   }, 2000)
//     // },
//     standard: '',
//     extarCss: ''
// })
</script>
