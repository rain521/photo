//工单详情的id，工单详情实时刷新
import { defineStore } from "pinia";
export const workOrder = defineStore("data", {
    state: () => ({
        order: "",
    }),
});
