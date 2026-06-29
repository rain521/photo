<template>
	<view class="connect-page">
		<view class="hero">
			<text class="eyebrow">WiFi Connect</text>
			<text class="title">无线网络连接</text>
			<text class="desc">{{ subtitle }}</text>
		</view>

		<view class="status-panel">
			<view class="status-visual" :class="status">
				<view v-if="status === 'loading'" class="spinner"></view>
				<text v-else-if="status === 'success'" class="status-icon">✓</text>
				<text v-else class="status-icon">!</text>
			</view>

			<text class="status-title">{{ statusTitle }}</text>
			<text class="status-message">{{ statusMessage }}</text>

			<view v-if="wifiName" class="wifi-chip">
				<text class="wifi-label">SSID</text>
				<text class="wifi-name">{{ wifiName }}</text>
			</view>
		</view>

		<view class="actions">
			<button class="action-btn primary" @click="goHome">创建wifi</button>
			<button class="action-btn ghost" open-type="share">分享</button>
			<button class="action-btn text" @click="closeMiniProgram">关闭</button>
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue';
	import {
		onLoad,
		onShareAppMessage,
		onShareTimeline
	} from '@dcloudio/uni-app';
	import {
		requestWithAuth
	} from '@/utils/request.js';

	const status = ref('loading');
	const wifiName = ref('');
	const subtitle = ref('正在读取网络信息');
	const statusTitle = ref('准备连接');
	const statusMessage = ref('请保持 WiFi 和定位服务开启，系统将自动发起连接。');

	onLoad((data = {}) => {
		const id = getWifiId(data);
		if (!id) {
			setFailed('未找到 WiFi 信息', '二维码或页面参数缺少网络编号，请重新生成后再试。');
			return;
		}
		getWifiInfo(id);
	});

	function getWifiId(data) {
		if (data.id) {
			return data.id;
		}
		if (!data.scene) {
			return '';
		}
		const sceneStr = decodeURIComponent(data.scene);
		const match = sceneStr.match(/id=(\d+)/);
		return match ? match[1] : '';
	}

	async function getWifiInfo(id) {
		try {
			setLoading('正在获取网络信息', '正在从服务器读取 WiFi 名称和连接凭证。');
			const res = await requestWithAuth({
				url: '/api/wifi',
				data: {
					id
				},
				method: 'GET'
			});

			if (!res || !res.name || !res.password) {
				setFailed('网络信息不完整', '当前 WiFi 缺少名称或密码，请检查后重新生成二维码。');
				return;
			}

			wifiName.value = res.name;
			connectWifi(res.name, res.password);
		} catch (err) {
			setFailed('读取失败', getRequestErrorMessage(err));
		}
	}

	function connectWifi(ssid, password) {
		// #ifdef MP-WEIXIN || APP-PLUS
		setLoading('正在连接', `正在尝试连接 ${ssid}`);
		uni.startWifi({
			success: () => {
				uni.connectWifi({
					SSID: ssid,
					password,
					success: () => {
						status.value = 'success';
						subtitle.value = '连接已完成';
						statusTitle.value = '连接成功';
						statusMessage.value = '设备已连接到目标无线网络，可以直接开始使用。';
					},
					fail: (err) => {
						setFailed('连接失败', parseWifiError(err));
					}
				});
			},
			fail: () => {
				setFailed('初始化失败', '未能初始化无线模块，请确认设备 WiFi 已开启。');
			}
		});
		// #endif

		// #ifndef MP-WEIXIN || APP-PLUS
		setFailed('平台不支持', '当前平台不支持自动连接 WiFi，请在微信小程序或 App 内打开。');
		// #endif
	}

	function setLoading(title, message) {
		status.value = 'loading';
		subtitle.value = '请稍候';
		statusTitle.value = title;
		statusMessage.value = message;
	}

	function setFailed(title, message) {
		status.value = 'failed';
		subtitle.value = '连接未完成';
		statusTitle.value = title;
		statusMessage.value = message;
	}

	function parseWifiError(err = {}) {
		switch (err.errCode) {
			case 12005:
				return '请先开启设备 WiFi 开关。';
			case 12006:
				return '请开启定位服务后重新连接。';
			case 12002:
				return '密码校验失败，请检查 WiFi 密码是否正确。';
			case 12003:
				return '连接超时，请靠近路由器后重试。';
			default:
				return '连接过程被中断，请稍后重试。';
		}
	}

	function getRequestErrorMessage(err = {}) {
		return err.data && err.data.message ? err.data.message : '网络请求失败，请检查网络后重试。';
	}

	function goHome() {
		uni.reLaunch({
			url: '/pages/index/index'
		});
	}

	function closeMiniProgram() {
		uni.exitMiniProgram({
			fail: () => {
				uni.navigateBack();
			}
		});
	}

	onShareAppMessage(() => {
		return {
			title: '创建 WiFi，一键分享连接信息',
			path: '/pages/index/index'
		};
	});

	onShareTimeline(() => {
		return {
			title: '创建 WiFi，一键分享连接信息',
			query: ''
		};
	});
</script>

<style>
	page {
		background: #f6f7f9;
	}

	.connect-page {
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
		margin-bottom: 64rpx;
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

	.status-panel {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 64rpx 40rpx 48rpx;
		background: #ffffff;
		border: 1rpx solid rgba(17, 24, 39, 0.08);
		border-radius: 28rpx;
		box-shadow: 0 24rpx 70rpx rgba(16, 24, 40, 0.08);
	}

	.status-visual {
		width: 156rpx;
		height: 156rpx;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 38rpx;
	}

	.status-visual.loading {
		background: #ecfdf3;
	}

	.status-visual.success {
		background: #16a34a;
	}

	.status-visual.failed {
		background: #ef4444;
	}

	.spinner {
		width: 78rpx;
		height: 78rpx;
		border: 8rpx solid rgba(22, 163, 74, 0.18);
		border-top-color: #16a34a;
		border-radius: 50%;
		animation: spin 0.9s linear infinite;
	}

	.status-icon {
		font-size: 82rpx;
		font-weight: 800;
		line-height: 1;
		color: #ffffff;
	}

	.status-title {
		font-size: 40rpx;
		font-weight: 800;
		color: #101828;
		margin-bottom: 16rpx;
	}

	.status-message {
		max-width: 520rpx;
		font-size: 28rpx;
		line-height: 1.7;
		color: #667085;
		text-align: center;
	}

	.wifi-chip {
		display: flex;
		align-items: center;
		gap: 16rpx;
		max-width: 100%;
		margin-top: 36rpx;
		padding: 18rpx 24rpx;
		background: #f2f4f7;
		border-radius: 999rpx;
		box-sizing: border-box;
	}

	.wifi-label {
		font-size: 20rpx;
		font-weight: 800;
		color: #0f8f57;
	}

	.wifi-name {
		max-width: 420rpx;
		font-size: 28rpx;
		font-weight: 700;
		color: #344054;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.actions {
		display: flex;
		flex-direction: column;
		gap: 22rpx;
		margin-top: 52rpx;
	}

	.action-btn {
		width: 100% !important;
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

	.action-btn.text {
		background: transparent;
		color: #667085;
	}

	.action-btn:active {
		transform: scale(0.98);
		opacity: 0.9;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}

		to {
			transform: rotate(360deg);
		}
	}
</style>
