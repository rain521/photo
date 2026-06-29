<template>
	<view class="page">
		<view class="hero">
			<text class="eyebrow">WiFi Studio</text>
			<text class="title">编辑 WiFi</text>
			<text class="desc">更新网络名称或密码，保存后二维码连接信息会同步使用新配置。</text>
		</view>

		<view class="form-panel">
			<view class="field">
				<text class="field-label">WiFi 名称</text>
				<input
					class="field-input"
					placeholder="输入网络名称"
					placeholder-class="input-placeholder"
					v-model="wifi.name"
				/>
			</view>

			<view class="field">
				<text class="field-label">WiFi 密码</text>
				<input
					class="field-input"
					placeholder="输入连接密码"
					placeholder-class="input-placeholder"
					v-model="wifi.password"
				/>
			</view>

			<view class="actions row">
				<button class="action-btn ghost" @click="onCancel">取消</button>
				<button class="action-btn primary" @click="onUpdate">保存</button>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue';
	import {
		onLoad
	} from '@dcloudio/uni-app';
	import {
		requestWithAuth
	} from '@/utils/request.js';

	const wifi = ref({});

	onLoad((data = {}) => {
		if (!data.id) {
			uni.showToast({
				title: '缺少 WiFi 编号',
				icon: 'none'
			});
			return;
		}
		get(data.id);
	});

	async function get(id) {
		try {
			const res = await requestWithAuth({
				url: '/api/wifi',
				data: {
					id
				},
				method: 'GET'
			});
			wifi.value = res || {};
		} catch (err) {
			uni.showToast({
				title: getErrorMessage(err),
				icon: 'none'
			});
		}
	}

	async function onUpdate() {
		if (!wifi.value.name || !wifi.value.password) {
			uni.showToast({
				title: '请填写 WiFi 名称和密码',
				icon: 'none'
			});
			return;
		}

		try {
			await requestWithAuth({
				url: '/api/wifi',
				data: wifi.value,
				method: 'PUT'
			});
			uni.showToast({
				title: '编辑成功',
				icon: 'success'
			});
			onCancel();
		} catch (err) {
			uni.showToast({
				title: getErrorMessage(err),
				icon: 'none'
			});
		}
	}

	function onCancel() {
		uni.navigateBack();
	}

	function getErrorMessage(err = {}) {
		return err.data && err.data.message ? err.data.message : '操作失败，请稍后重试';
	}
</script>

<style>
	page {
		background: #f6f7f9;
	}

	.page {
		min-height: 100vh;
		padding: 88rpx 40rpx 56rpx;
		box-sizing: border-box;
		background:
			linear-gradient(180deg, rgba(34, 197, 94, 0.12), rgba(246, 247, 249, 0) 34%),
			#f6f7f9;
		color: #14161a;
	}

	.hero {
		display: flex;
		flex-direction: column;
		gap: 16rpx;
		margin-bottom: 54rpx;
	}

	.eyebrow {
		font-size: 22rpx;
		font-weight: 700;
		color: #0f8f57;
		text-transform: uppercase;
		letter-spacing: 2rpx;
	}

	.title {
		font-size: 58rpx;
		font-weight: 800;
		line-height: 1.12;
		color: #111827;
	}

	.desc {
		font-size: 28rpx;
		line-height: 1.6;
		color: #667085;
	}

	.form-panel {
		padding: 44rpx 36rpx;
		background: #ffffff;
		border: 1rpx solid rgba(17, 24, 39, 0.08);
		border-radius: 28rpx;
		box-shadow: 0 24rpx 70rpx rgba(16, 24, 40, 0.08);
	}

	.field {
		margin-bottom: 34rpx;
	}

	.field-label {
		display: block;
		margin-bottom: 16rpx;
		font-size: 24rpx;
		font-weight: 800;
		color: #344054;
	}

	.field-input {
		height: 96rpx;
		padding: 0 28rpx;
		background: #f9fafb;
		border: 1rpx solid rgba(17, 24, 39, 0.1);
		border-radius: 18rpx;
		box-sizing: border-box;
		font-size: 30rpx;
		color: #101828;
	}

	.input-placeholder {
		color: #98a2b3;
	}

	.actions {
		display: flex;
		gap: 22rpx;
		margin-top: 46rpx;
	}

	.action-btn {
		flex: 1;
		height: 96rpx;
		border-radius: 18rpx;
		font-size: 30rpx;
		font-weight: 800;
		display: flex;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
	}

	.action-btn::after {
		border: none;
	}

	.action-btn.primary {
		background: #111827;
		color: #ffffff;
		box-shadow: 0 18rpx 38rpx rgba(17, 24, 39, 0.18);
	}

	.action-btn.ghost {
		background: #ffffff;
		color: #111827;
		border: 1rpx solid rgba(17, 24, 39, 0.12);
	}

	.action-btn:active {
		transform: scale(0.98);
		opacity: 0.9;
	}
</style>
