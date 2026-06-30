<template>
	<view class="page">
		<view class="hero">
			<view>
				<text class="eyebrow">WiFi Studio</text>
				<text class="title">我的 WiFi</text>
			</view>
			<button class="add-btn" @click="goCreate">新增</button>
		</view>

		<text class="desc">管理已创建的无线网络，快速连接、编辑或下载连接二维码。</text>

		<view v-if="wifiList.length === 0" class="empty-panel">
			<view class="empty-icon">+</view>
			<text class="empty-title">还没有 WiFi</text>
			<text class="empty-desc">创建第一个 WiFi 后，可以在这里管理和分享。</text>
			<button class="action-btn primary" @click="goCreate">立即创建</button>
		</view>

		<view v-else class="list-wrap">
			<scroll-view scroll-y class="list">
				<view class="wifi-card" v-for="item in wifiList" :key="item.id">
					<view class="card-top">
						<view class="status-dot"></view>
						<view class="wifi-info">
							<text class="wifi-name">{{ item.name }}</text>
							<view class="password-row">
								<text class="password-label">密码</text>
								<text class="password-value">********</text>
							</view>
						</view>
					</view>

					<view class="card-actions">
						<button class="mini-btn" @click="edit(item)">编辑</button>
						<button class="mini-btn" @click="connect(item)">连接</button>
						<button class="mini-btn" @click="getQRCode(item)">下载</button>
						<button
							class="mini-btn"
							open-type="share"
							:data-id="item.id"
							:data-name="item.name"
						>
							分享
						</button>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue';
	import {
		onShareAppMessage,
		onShow
	} from '@dcloudio/uni-app';
	import {
		requestWithAuth
	} from '@/utils/request.js';

	const app = getApp();
	const wifiList = ref([]);

	onShow(() => {
		get();
	});

	async function get() {
		try {
			const res = await requestWithAuth({
				url: '/api/wifi/getAll',
				method: 'GET'
			});
			wifiList.value = Array.isArray(res) ? res : [];
		} catch (err) {
			wifiList.value = [];
			uni.showToast({
				title: getErrorMessage(err),
				icon: 'none'
			});
		}
	}

	function goCreate() {
		uni.navigateTo({
			url: '/pages/index/index'
		});
	}

	function edit(item) {
		uni.navigateTo({
			url: `/pages/edit/edit?id=${item.id}`
		});
	}

	function connect(item) {
		uni.navigateTo({
			url: `/pages/connect/connect?id=${item.id}`
		});
	}

	function hideLoadingSafe() {
		uni.hideLoading({ fail: () => {} });
	}

	async function getQRCode(item) {
		uni.showLoading({
			title: '生成中...',
			mask: true
		});

		try {
			const baseUrl = app.globalData.requestUrl + '/api/wifi/qrcode';
			const scene = `id=${item.id}`;
			const page = 'pages/connect/connect';

			const token = uni.getStorageSync('token') || '';
			const downloadRes = await uni.downloadFile({
				url: `${baseUrl}?scene=${scene}&page=${page}`,
				header: {
					Authorization: `Bearer ${token}`
				},
				timeout: 15000
			});

			if (downloadRes.statusCode !== 200) {
				hideLoadingSafe();
				// 尝试读取临时文件中的后端错误信息
				let errorMsg = '图片下载失败';
				try {
					const fs = uni.getFileSystemManager();
					const errData = fs.readFileSync(downloadRes.tempFilePath, 'utf-8');
					const parsed = JSON.parse(errData);
					if (parsed.message) {
						errorMsg = parsed.message;
					}
				} catch (e) {
					// 无法读取错误详情，使用默认提示
                    console.error(e);
				}
				uni.showToast({
					title: errorMsg,
					icon: 'none',
					duration: 2500
				});
				return;
			}

			const authResult = await requestSaveImageAuth();
			if (!authResult) {
				hideLoadingSafe();
				uni.showToast({
					title: '未授权保存到相册',
					icon: 'none'
				});
				return;
			}

			await uni.saveImageToPhotosAlbum({
				filePath: downloadRes.tempFilePath
			});

			hideLoadingSafe();
			uni.showToast({
				title: '已保存到相册',
				icon: 'success'
			});
		} catch (err) {
            console.error('getQRCode error:', err); // 打印错误信息以便调试
			hideLoadingSafe();
			// 提取可读的错误信息
			let errorMsg = '操作失败';
			if (err.errMsg) {
				if (err.errMsg.includes('auth deny')) {
					uni.showModal({
						title: '提示',
						content: '需要授权保存到相册',
						success: (res) => {
							if (res.confirm) {
								uni.openSetting();
							}
						}
					});
					return;
				}
				// 映射常见系统错误到用户友好提示
				if (err.errMsg.includes('timeout') || err.errMsg.includes('time out')) {
					errorMsg = '网络超时，请重试';
				} else if (err.errMsg.includes('fail url not in domain list')) {
					errorMsg = '下载域名未配置，请联系管理员';
				} else if (err.errMsg.includes('file not found') || err.errMsg.includes('404')) {
					errorMsg = '二维码生成失败，请稍后重试';
				} else {
					// 兜底：提取 errMsg 中人类可读的部分
					const cleaned = err.errMsg.replace(/^.*?:fail\s*/, '');
					if (cleaned && cleaned.length < 30) {
						errorMsg = cleaned;
					}
				}
			}
			uni.showToast({
				title: errorMsg,
				icon: 'none',
				duration: 2500
			});
		}
	}

	function requestSaveImageAuth() {
		return new Promise((resolve) => {
			uni.getSetting({
				success: (res) => {
					if (res.authSetting['scope.writePhotosAlbum']) {
						resolve(true);
						return;
					}
					if (res.authSetting['scope.writePhotosAlbum'] === false) {
						uni.showModal({
							title: '提示',
							content: '您已拒绝保存到相册，请手动打开设置授权',
							success: (modalRes) => {
								if (modalRes.confirm) {
									uni.openSetting();
								}
								resolve(false);
							}
						});
						return;
					}
					uni.authorize({
						scope: 'scope.writePhotosAlbum',
						success: () => resolve(true),
						fail: () => resolve(false)
					});
				},
				fail: () => resolve(false)
			});
		});
	}

	function getErrorMessage(err = {}) {
		return err.data && err.data.message ? err.data.message : '列表加载失败';
	}

	onShareAppMessage((res) => {
		if (res.from === 'button' && res.target && res.target.dataset) {
			const { id, name } = res.target.dataset;
			if (id) {
				return {
					title: `连接 ${name || '我的'} WiFi`,
					path: `/pages/connect/connect?id=${id}`,
					imageUrl: '/static/share-wifi-connect.png'
				};
			}
		}

		return {
			title: '创建 WiFi，一键分享连接信息',
			path: '/pages/index/index',
			imageUrl: '/static/share-wifi-connect.png'
		};
	});
</script>

<style>
	page {
		background: #f6f7f9;
	}

	.page {
		height: 100vh;
		padding: 88rpx 40rpx 56rpx;
		box-sizing: border-box;
		background:
			linear-gradient(180deg, rgba(34, 197, 94, 0.12), rgba(246, 247, 249, 0) 34%),
			#f6f7f9;
		color: #14161a;
		display: flex;
		flex-direction: column;
	}

	.hero {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 28rpx;
		margin-bottom: 18rpx;
	}

	.eyebrow {
		display: block;
		margin-bottom: 16rpx;
		font-size: 22rpx;
		font-weight: 700;
		color: #0f8f57;
		text-transform: uppercase;
		letter-spacing: 2rpx;
	}

	.title {
		display: block;
		font-size: 58rpx;
		font-weight: 800;
		line-height: 1.12;
		color: #111827;
	}

	.desc {
		display: block;
		margin-bottom: 42rpx;
		font-size: 28rpx;
		line-height: 1.6;
		color: #667085;
	}

	.add-btn {
		width: 136rpx !important;
		height: 72rpx;
		margin: 8rpx 0 0;
		border-radius: 16rpx;
		background: #111827;
		color: #ffffff;
		font-size: 26rpx;
		font-weight: 800;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.add-btn::after,
	.action-btn::after,
	.mini-btn::after {
		border: none;
	}

	.list-wrap {
		flex: 1;
		overflow: hidden;
	}

	.list {
		height: 100%;
	}

	.wifi-card {
		padding: 34rpx;
		margin-bottom: 24rpx;
		background: #ffffff;
		border: 1rpx solid rgba(17, 24, 39, 0.08);
		border-radius: 24rpx;
		box-shadow: 0 18rpx 50rpx rgba(16, 24, 40, 0.07);
	}

	.card-top {
		display: flex;
		gap: 20rpx;
		align-items: flex-start;
	}

	.status-dot {
		width: 18rpx;
		height: 18rpx;
		margin-top: 13rpx;
		border-radius: 50%;
		background: #16a34a;
		box-shadow: 0 0 0 8rpx rgba(22, 163, 74, 0.12);
		flex-shrink: 0;
	}

	.wifi-info {
		flex: 1;
		min-width: 0;
	}

	.wifi-name {
		display: block;
		font-size: 34rpx;
		font-weight: 800;
		color: #101828;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.password-row {
		display: flex;
		align-items: center;
		gap: 14rpx;
		margin-top: 18rpx;
	}

	.password-label {
		padding: 6rpx 12rpx;
		background: #ecfdf3;
		border-radius: 999rpx;
		font-size: 20rpx;
		font-weight: 800;
		color: #0f8f57;
	}

	.password-value {
		max-width: 430rpx;
		font-size: 26rpx;
		color: #667085;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.card-actions {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 16rpx;
		margin-top: 32rpx;
	}

	.mini-btn {
		height: 72rpx;
		border-radius: 14rpx;
		background: #f9fafb;
		border: 1rpx solid rgba(17, 24, 39, 0.1);
		color: #344054;
		font-size: 25rpx;
		font-weight: 800;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.mini-btn.primary {
		background: #111827;
		color: #ffffff;
		border-color: #111827;
	}

	.empty-panel {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 64rpx 40rpx;
		background: #ffffff;
		border: 1rpx solid rgba(17, 24, 39, 0.08);
		border-radius: 28rpx;
		box-shadow: 0 24rpx 70rpx rgba(16, 24, 40, 0.08);
	}

	.empty-icon {
		width: 112rpx;
		height: 112rpx;
		border-radius: 50%;
		background: #ecfdf3;
		color: #16a34a;
		font-size: 58rpx;
		font-weight: 800;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 30rpx;
	}

	.empty-title {
		font-size: 36rpx;
		font-weight: 800;
		color: #101828;
		margin-bottom: 14rpx;
	}

	.empty-desc {
		font-size: 28rpx;
		line-height: 1.6;
		color: #667085;
		text-align: center;
		margin-bottom: 34rpx;
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

	.action-btn.primary {
		background: #111827;
		color: #ffffff;
		box-shadow: 0 18rpx 38rpx rgba(17, 24, 39, 0.18);
	}

	.add-btn:active,
	.action-btn:active,
	.mini-btn:active {
		transform: scale(0.98);
		opacity: 0.9;
	}
</style>
