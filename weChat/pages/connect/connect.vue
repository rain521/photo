<template>
	<view>

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

	onLoad((data) => {
		get(data.id);
	})

	const get = async function(id) {
		const res = await requestWithAuth({
			url: `/api/wifi`,
			data: {
				id: id
			},
			method: 'GET'
		}).catch(err => {
			uni.showToast({
				title: err.data.message,
				icon: "none"
			});
		});
		connectWifi(res.name,res.password)
	}
	/**
	 * 自动连接指定 WiFi 终端
	 * @param {String} ssid - WiFi 名称
	 * @param {String} password - WiFi 密码
	 */
	function connectWifi(ssid, password) {
		// #ifdef MP-WEIXIN || APP-PLUS

		// 1. 初始化本地网络环境
		uni.startWifi({
			success: () => {
				uni.showLoading({
					title: '正在向终端请求连接...',
					mask: true
				});

				// 2. 注入网络通信凭证并建立物理连接
				uni.connectWifi({
					SSID: ssid,
					password: password,
					success: (res) => {
						uni.hideLoading();
						uni.showToast({
							title: '无线网络已激活',
							icon: 'success'
						});
					},
					fail: (err) => {
						uni.hideLoading();
						parseWifiError(err);
					}
				});
			},
			fail: (err) => {
				uni.showToast({
					title: '未能初始化无线模块',
					icon: 'none'
				});
			}
		});

		// #endif

		// #ifndef MP-WEIXIN || APP-PLUS
		uni.showToast({
			title: '当前平台不支持硬件直连',
			icon: 'none'
		});
		// #endif
	}

	/**
	 * 错误回溯解析
	 */
	function parseWifiError(err) {
		const errCode = err.errCode;
		let msg = '底层链路重置';
		switch (errCode) {
			case 12005:
				msg = '请先开启移动设备WiFi开关';
				break;
			case 12006:
				msg = 'GPS定位服务未开启';
				break; // Android 核心痛点
			case 12002:
				msg = '密钥校验失败，请检查密码';
				break;
			case 12003:
				msg = '连接超时，信号强度弱';
				break;
		}

		uni.showToast({
			title: `连接失败: ${msg}`,
			icon: 'none',
			duration: 3000
		});
	}
</script>

<style>

</style>