<template>
    <el-image class="c-image" :src="srcItem + '?imageMogr2/interlace/1/thumbnail/400x400'" fit="contain" />
</template>

<script setup>
import { ref } from "vue";
const props = defineProps({
    src: {
        type: String,
    },
});
const srcItem = ref(props.src || "https://assets.momentsgo.cn/PlaceholderImage.png");
</script>

<style></style>
