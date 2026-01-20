<template>
    <div class="no-data-view">
        <el-image class="c-image" :src="noData" fit="contain" v-if="!shopnull" />
        <el-image class="c-image" :src="noData1" fit="contain" v-if="shopnull" />
        <div class="no-data-view-text">{{ text ? text : "暂无数据..." }}</div>
    </div>
</template>
<script setup>
import { ref, watch } from "vue";
import noData from "@/assets/image/noData.png";
import noData1 from "@/assets/image/shop-null.png";
const props = defineProps({
    text: {
        type: String,
    },
    shopnull: {
        type: Boolean,
    },
});
const text = ref(props.text);
const shopnull = ref(props.shopnull);
watch(props, (to, from) => {
    text.value = props.text;
});
</script>
<style scoped lang="scss">
.no-data-view {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    align-content: center;
    .c-image {
        width: 260px;
        height: 260px;
    }
    .no-data-view-text {
        width: 100%;
        color: var(--text-secondary);
        font-size: 14px;
        text-align: center;
    }
}
</style>
