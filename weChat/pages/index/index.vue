<template>
	<view>
		<input class="c-input" type="text" v-model="wifi.name">
		<input class="c-input" type="text" v-model="wifi.password">
		<div @click="save">创建</div>
		<div @click="get">查询</div>
	</view>
</template>

<script setup>
	import {
		requestWithAuth
	} from '@/utils/request.js';
	import {reactive} from "vue";
	const app = getApp();
	const wifi = reactive({
		name:null,
		password:null,
		userId:null,
	})
	// 获取用户信息
	async function fetchUserProfile() {
		if(app.globalData.user){
			return await app.globalData.user
		}
		const res = await requestWithAuth({
			url: `/api/user/getUser`,
			method: 'GET'
		});
		app.globalData.user = res;
		return app.globalData.user
	}
	
	const save = async function(){
		const user = await fetchUserProfile();
		wifi.userId = user.id;
		const res = requestWithAuth({
			url: `/api/wifi`,
			method: 'POST',
			data: wifi
		}).catch(err => {	
			uni.showToast({
				title: err.data.message,
				icon: "none"
			});
		});
		if(res){
			uni.showToast({
				title: "创建成功",
				icon: "success"
			});
		}
	}
	const get = function(){
		const res = requestWithAuth({
			url: `/api/wifi/getAll`,
			method: 'GET'
		}).catch(err => {	
			uni.showToast({
				title: err.data.message,
				icon: "none"
			});
		});
		console.log(res)
	}
</script>

<style>
	.c-input {
		border: 1px solid #ddd;
		height: 40px;
		border-radius: 4px;
		padding: 0 12rpx;
	}
</style>