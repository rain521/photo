<template>
    <div></div>
</template>

<script setup>
import { onBeforeMount, onMounted, inject } from "vue";
import { useRouter, useRoute } from "vue-router";
const route = useRoute();

onBeforeMount(()=>{
    init();
})
function init(){
    if(route.query.url){
        console.log(decodeURIComponent(route.query.url));
        window.location.replace(decodeURIComponent(route.query.url));
    }
}
</script>

<style scoped lang="scss">
</style>
