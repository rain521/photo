<template>
	<view>
		
	</view>
</template>

<script setup>
	const app = getApp();
	console.log(app)
	getToken()
	function getToken(){
		// 小程序端
		uni.login({
		  success(res) {
			  console.log(res.code)
		    if (res.code) {
		      uni.request({
		        url: 'http://localhost:3000/api/auth/loginWx',
		        method: 'POST',
		        data: { code: res.code },
		        success(response) {
					app.globalData.token = response.data.access_token;
					console.log(app)
		          // const token = response.data.access_token;
		          // wx.setStorageSync('token', token); // 之后请求带上 Authorization: Bearer token
		        }
		      });
		    }
		  }
		});
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>
