<template>
    <RouterView />
</template>

<script setup>
import { onMounted } from "vue";
import ThemeColor from "./utils/themeColor";
onMounted(() => {
    ThemeColor();
});
</script>

<style></style>
