<template>
	<view class="cyber-container">
		<!-- 顶部渐变背景环绕 -->
		<view class="glow-orb orb-list"></view>

		<view class="page-header">
			<text class="page-title">我的WIFI</text>
			<text class="subtitle">已激活的无线网络终端列表</text>
		</view>

		<!-- 列表空状态 -->
		<view class="empty-state" v-if="wifiList.length === 0">
			<text class="empty-text">未检测到已创建的网络</text>
		</view>

		<!-- WiFi 卡片列表 -->
		<scroll-view scroll-y class="matrix-scroll">
			<view class="wifi-card" v-for="(item,index) in wifiList" :key="index">
				<!-- 左侧网络状态及信息 -->
				<view class="card-main">
					<view class="wifi-header">
						<view class="status-dot"></view>
						<text class="wifi-ssid">{{item.name}}</text>
					</view>
					<view class="wifi-crypto">
						<text class="crypto-label">密码:</text>
						<text class="crypto-value">{{item.password}}</text>
					</view>
				</view>
				<!-- 右侧装饰性信号/雷达 UI -->
				<view class="card-deco">
					<text class="deco-tag" @click="edit(item)">编辑</text>
					<text class="deco-tag" @click="connect(item)">连接</text>
					<text class="deco-tag" @click="getQRCode(item)">下载</text>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script setup>
	import {
		requestWithAuth
	} from '@/utils/request.js';
	import {
		ref
	} from "vue";
	import {
		onShow,
		onLoad,
		onShareAppMessage,
		onReady
	} from "@dcloudio/uni-app";
	const app = getApp();
	const wifiList = ref([])

	onShow(() => {
		get();
	})

	const get = async function() {
		const res = await requestWithAuth({
			url: `/api/wifi/getAll`,
			method: 'GET'
		}).catch(err => {
			console.log(err)
			// uni.showToast({
			// 	title: err.data.message,
			// 	icon: "none"
			// });
		});
		wifiList.value = res;
		console.log(wifiList.value)
	}
	const edit = function(item) {
		uni.navigateTo({
			url: `/pages/edit/edit?id=${item.id}`
		})
	}
	const connect = function(item) {
		uni.navigateTo({
			url: `/pages/connect/connect?id=${item.id}`
		})
	}

	const getQRCode = async function(item) {
		try {
			// 1. 请求后端生成二维码的接口，直接下载为临时文件
			//    注意：这里不能用 request，因为要保存为图片，建议用 downloadFile
			const baseUrl = app.globalData.requestUrl + '/api/wifi/qrcode';
			// 可以携带自定义参数，例如当前用户的邀请 scene
			const scene = `id=${item.id}`;
			const page = 'pages/connect/connect'; // 扫码后跳转的页面

			uni.showLoading({
				title: '生成中...'
			});

			const token = uni.getStorageSync('token') || '';
			const downloadRes = await uni.downloadFile({
				url: `${baseUrl}?scene=${scene}&page=${page}`,
				header:{
					Authorization: `Bearer ${token}`
				}
			});

			uni.hideLoading();

			if (downloadRes.statusCode !== 200) {
				uni.showToast({
					title: '图片下载失败',
					icon: 'none'
				});
				return;
			}

			const tempFilePath = downloadRes.tempFilePath;

			// 2. 请求保存到相册权限（微信小程序需授权）
			const authResult = await requestSaveImageAuth();
			if (!authResult) {
				uni.showToast({
					title: '未授权保存到相册',
					icon: 'none'
				});
				return;
			}

			// 3. 保存到系统相册
			await uni.saveImageToPhotosAlbum({
				filePath: tempFilePath,
			});

			uni.showToast({
				title: '已保存到相册',
				icon: 'success'
			});
		} catch (err) {
			uni.hideLoading();
			console.error('下载失败：', err);
			// 如果是用户拒绝授权，引导打开设置
			if (err.errMsg && err.errMsg.includes('auth deny')) {
				uni.showModal({
					title: '提示',
					content: '需要您授权保存到相册',
					success: (res) => {
						if (res.confirm) {
							uni.openSetting();
						}
					},
				});
			} else {
				uni.showToast({
					title: '操作失败',
					icon: 'none'
				});
			}
		}
	}

	// 封装授权方法
	const requestSaveImageAuth = () => {
		return new Promise((resolve) => {
			uni.getSetting({
				success: (res) => {
					// 如果已授权直接保存
					if (res.authSetting['scope.writePhotosAlbum']) {
						resolve(true);
					}
					// 未授权则发起请求
					else if (res.authSetting['scope.writePhotosAlbum'] === false) {
						// 之前拒绝过，引导打开设置
						uni.showModal({
							title: '提示',
							content: '您已拒绝保存到相册，请手动打开设置授权',
							success: (modalRes) => {
								if (modalRes.confirm) {
									uni.openSetting();
								}
								resolve(false);
							},
						});
					} else {
						// 首次请求授权
						uni.authorize({
							scope: 'scope.writePhotosAlbum',
							success: () => resolve(true),
							fail: () => {
								resolve(false);
							},
						});
					}
				},
			});
		});
	}
</script>

<style>
	.cyber-container {
		position: relative;
		padding: 40rpx 30rpx;
		display: flex;
		flex-direction: column;
		height: 100vh;
		background-color: #0a0b10;
		box-sizing: border-box;
		overflow: hidden;
	}

	.glow-orb {
		position: absolute;
		border-radius: 50%;
		filter: blur(100px);
		opacity: 0.25;
		z-index: 1;
	}

	.orb-list {
		width: 600rpx;
		height: 600rpx;
		background: linear-gradient(135deg, #7000ff, #00f0ff);
		top: -200rpx;
		left: 50%;
		transform: translateX(-50%);
	}

	.page-header {
		position: relative;
		z-index: 2;
		margin-top: 140rpx;
		margin-bottom: 50rpx;
	}

	.page-title {
		font-size: 52rpx;
		font-weight: 900;
		color: #ffffff;
		letter-spacing: 4rpx;
		text-shadow: 0 0 15px rgba(0, 240, 255, 0.4);
	}

	.subtitle {
		font-size: 24rpx;
		color: #7e8191;
		margin-top: 8rpx;
		display: block;
	}

	.matrix-scroll {
		flex: 1;
		position: relative;
		z-index: 2;
		height: calc(100vh - 350rpx);
	}

	/* WiFi卡片样式 */
	.wifi-card {
		background: rgba(22, 24, 37, 0.7);
		backdrop-filter: blur(15px);
		border: 1rpx solid rgba(255, 255, 255, 0.05);
		border-left: 6rpx solid #00f0ff;
		/* 极光青边界线 */
		border-radius: 20rpx;
		padding: 35rpx 30rpx;
		margin-bottom: 30rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
	}

	.card-main {
		flex: 1;
	}

	.wifi-header {
		display: flex;
		align-items: center;
		margin-bottom: 16rpx;
	}

	/* 呼吸灯状态圆点 */
	.status-dot {
		width: 12rpx;
		height: 12rpx;
		background-color: #00f0ff;
		border-radius: 50%;
		margin-right: 16rpx;
		box-shadow: 0 0 10px #00f0ff;
		animation: pulse 2s infinite;
	}

	@keyframes pulse {
		0% {
			opacity: 0.4;
		}

		50% {
			opacity: 1;
		}

		100% {
			opacity: 0.4;
		}
	}

	.wifi-ssid {
		font-size: 34rpx;
		font-weight: bold;
		color: #ffffff;
		letter-spacing: 1rpx;
	}

	.wifi-crypto {
		display: inline-flex;
		align-items: center;
		background: rgba(10, 11, 16, 0.5);
		padding: 10rpx 20rpx;
		border-radius: 10rpx;
		border: 1rpx solid rgba(140, 142, 154, 0.15);
	}

	.crypto-label {
		font-size: 22rpx;
		color: #7e8191;
		font-weight: bold;
		margin-right: 12rpx;
	}

	.crypto-value {
		font-size: 26rpx;
		color: #e2e4f0;
		font-family: monospace;
		/* 等宽字体显得更极客 */
	}

	.copy-icon {
		width: 24rpx;
		height: 24rpx;
		margin-left: 16rpx;
		opacity: 0.6;
	}

	/* 右侧装饰徽章 */
	.card-deco {
		text-align: right;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 8px;
	}

	.deco-tag {
		font-size: 18rpx;
		font-weight: bold;
		color: #00f0ff;
		background: transparent;
		border: 2rpx solid #00f0ff;
		padding: 4rpx 12rpx;
		border-radius: 6rpx;
		letter-spacing: 1rpx;
	}

	/* 底部悬浮按钮 */
	.action-btn {
		position: relative;
		z-index: 3;
		margin-bottom: 30rpx;
		background: transparent;
		color: #00f0ff;
		border: 2rpx solid #00f0ff;
		border-radius: 20rpx;
		height: 96rpx;
		width: 100% !important;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 0 15px rgba(0, 240, 255, 0.15);
	}

	.action-btn:active {
		background: rgba(0, 240, 255, 0.1);
	}

	.empty-state {
		text-align: center;
		padding-top: 200rpx;
		color: #424559;
		font-size: 28rpx;
	}
</style>