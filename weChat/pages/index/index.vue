<template>
	<!-- <view>
		<input class="c-input" type="text" v-model="wifi.name">
		<input class="c-input" type="text" v-model="wifi.password">
		<div @click="save">创建</div>
		<div @click="get">查询</div>
	</view> -->
	<view class="container">
		<view class="header">
			<text class="title">创建WIFI</text>
		</view>
		<view class="form-group">
			<input class="input-box" placeholder="WIFI名称" v-model="wifi.name" />
		</view>
		<view class="form-group">
			<input class="input-box" placeholder="WIFI密码" v-model="wifi.password" />
		</view>
		<button class="save-btn" @click="save">保存</button>
		<div class="goBtn" @click="goList()">我的WIFI</div>
	</view>
</template>

<script setup>
	import {
		requestWithAuth
	} from '@/utils/request.js';
	import {
		reactive
	} from "vue";
	const app = getApp();
	const wifi = reactive({
		name: null,
		password: null,
		userId: null,
	})
	// 获取用户信息
	async function fetchUserProfile() {
		if (app.globalData.user) {
			return await app.globalData.user
		}
		const res = await requestWithAuth({
			url: `/api/user/getUser`,
			method: 'GET'
		});
		app.globalData.user = res;
		return app.globalData.user
	}

	const save = async function() {
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
		if (res) {
			uni.showToast({
				title: "创建成功",
				icon: "success"
			});
		}
	}
	const get = function() {
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
	const goList = function(){
		uni.navigateTo({
			url: "/pages/list/list"
		})
	}
</script>

<style>
	.container {
		padding: 40rpx;
		display: flex;
		flex-direction: column;
		height: 100vh;
		background-color: #f8f8f8;
	}

	.header {
		margin-top: 100rpx;
		margin-bottom: 80rpx;
		text-align: center;
	}

	.title {
		font-size: 48rpx;
		font-weight: bold;
		color: #333333;
	}

	.form-group {
		margin-bottom: 40rpx;
	}

	.input-box {
		background-color: #ffffff;
		height: 90rpx;
		padding: 0 30rpx;
		border-radius: 12rpx;
		font-size: 32rpx;
		border: 1px solid #e0e0e0;
	}

	.save-btn {
		margin-top: 40rpx;
		background-color: #07c160;
		/* 微信主题绿 */
		color: #ffffff;
		border-radius: 12rpx;
		font-size: 36rpx;
		height: 90rpx;
		line-height: 90rpx;
		width: 100% !important;
		/* 覆盖小程序默认按钮宽度限制 */
	}

	.save-btn:active {
		background-color: #06ad56;
		/* 按下时的交互颜色 */
	}
</style>