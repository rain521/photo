<template>
	<view class="cyber-container">
		<!-- 背景霓虹光晕 -->
		<view class="glow-orb orb-edit-1"></view>
		<view class="glow-orb orb-edit-2"></view>

		<view class="cyber-card">
			<view class="cyber-header">
				<text class="glitch-title">编辑WIFI</text>
				<text class="subtitle">重构当前无线网络终端节点</text>
			</view>

			<view class="input-group">
				<text class="input-label">WIFI名称</text>
				<input class="cyber-input" placeholder="输入新网络名称" placeholder-class="input-placeholder"v-model="wifi.name" />
			</view>

			<view class="input-group">
				<text class="input-label">WIFI密码</text>
				<input class="cyber-input" placeholder="输入新安全密钥" placeholder-class="input-placeholder"v-model="wifi.password" />
			</view>

			<!-- 底部双按钮：取消与保存 -->
			<view class="btn-group">
				<button class="cyber-btn btn-secondary" @click="onCancel">取消</button>
				<button class="cyber-btn btn-primary" @click="onUpdate">保存</button>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {requestWithAuth} from '@/utils/request.js';
	import {ref} from "vue";
	import {onShow,onLoad,onShareAppMessage,onReady} from "@dcloudio/uni-app";
	const app = getApp();
	const wifi = ref({})
	
	onLoad((data)=>{
		get(data.id);
	})
	
	const get = async function(id) {
		const res = await requestWithAuth({
			url: `/api/wifi`,
			data:{id: id},
			method: 'GET'
		}).catch(err => {
			uni.showToast({
				title: err.data.message,
				icon: "none"
			});
		});
		wifi.value = res;
	}
	
	const onUpdate = function(){
		requestWithAuth({
			url: `/api/wifi`,
			data:wifi.value,
			method: 'PUT'
		}).then(res => {
			uni.showToast({
				title: "编辑成功",
				icon: "success"
			});
			onCancel();
		}).catch(err => {
			uni.showToast({
				title: err.data.message,
				icon: "none"
			});
		})
	}
	const onCancel = function(){
		uni.navigateBack()
	}
</script>

<style>
</style>