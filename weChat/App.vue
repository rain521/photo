<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		globalData: {
			token: null,
			user: null,
			// requestUrl: "https://www.cytp.cc",
			requestUrl: "http://10.0.0.16:3000",
		}
	}
</script>

<style>
	/*每个页面公共css */

	.cyber-container {
		position: relative;
		padding: 40rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		height: 100vh;
		background-color: #0a0b10;
		overflow: hidden;
		box-sizing: border-box;
	}

	/* 编辑页专属迷幻霓虹光晕 */
	.glow-orb {
		position: absolute;
		border-radius: 50%;
		filter: blur(90px);
		opacity: 0.3;
		z-index: 1;
	}

	.orb-edit-1 {
		width: 500rpx;
		height: 500rpx;
		background: #00f0ff;
		/* 霓虹粉 */
		top: -100rpx;
		left: -100rpx;
	}

	.orb-edit-2 {
		width: 450rpx;
		height: 450rpx;
		background: #7000ff;
		bottom: 50rpx;
		right: -100rpx;
	}

	.cyber-card {
		position: relative;
		z-index: 2;
		background: rgba(22, 24, 37, 0.65);
		backdrop-filter: blur(20px);
		border: 1rpx solid rgba(255, 255, 255, 0.08);
		border-top: 1rpx solid rgba(2ff, 0, 127, 0.4);
		border-radius: 36rpx;
		padding: 60rpx 45rpx;
		box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5);
	}

	.cyber-header {
		text-align: center;
		margin-bottom: 30rpx;
	}

	.glitch-title {
		font-size: 56rpx;
		font-weight: 900;
		color: #ffffff;
		letter-spacing: 6rpx;
		text-shadow: 0 0 15px rgba(255, 0, 127, 0.6), -2px 2px 0px #00f0ff;
		display: block;
	}

	.subtitle {
		font-size: 24rpx;
		color: #7e8191;
		margin-top: 12rpx;
		display: block;
	}

	/* 节点ID标签 */
	.node-badge {
		display: flex;
		justify-content: center;
		align-items: center;
		background: rgba(255, 0, 127, 0.1);
		border: 1rpx solid rgba(255, 0, 127, 0.25);
		border-radius: 10rpx;
		padding: 10rpx 20rpx;
		width: fit-content;
		margin: 0 auto 50rpx auto;
	}

	.badge-tag {
		font-size: 20rpx;
		color: #00f0ff;
		font-weight: bold;
		margin-right: 10rpx;
	}

	.badge-id {
		font-size: 22rpx;
		color: #ffffff;
		font-family: monospace;
	}

	.input-group {
		margin-bottom: 46rpx;
	}

	.input-label {
		font-size: 22rpx;
		color: #00f0ff;
		text-transform: uppercase;
		letter-spacing: 4rpx;
		margin-bottom: 18rpx;
		display: block;
		font-weight: bold;
	}

	.cyber-input {
		background: rgba(10, 11, 16, 0.7);
		height: 100rpx;
		padding: 0 32rpx;
		border-radius: 20rpx;
		font-size: 30rpx;
		color: #ffffff;
		border: 1rpx solid rgba(140, 142, 154, 0.25);
	}

	.cyber-input:focus {
		border-color: #00f0ff;
		box-shadow: 0 0 20px rgba(255, 0, 127, 0.25);
	}

	.input-placeholder {
		color: #424559;
	}

	/* 双按钮并排布局 */
	.btn-group {
		display: flex;
		justify-content: space-between;
		margin-top: 50rpx;
		gap: 24rpx;
	}

	.cyber-btn {
		height: 100rpx;
		border-radius: 20rpx;
		font-size: 30rpx;
		font-weight: bold;
		display: flex;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
		transition: all 0.2s ease;
	}

	.btn-secondary {
		width: 35% !important;
		background: transparent;
		color: #7e8191;
	}

	.btn-primary {
		width: 65% !important;
		background: linear-gradient(90deg, #00f0ff, #7000ff);
		color: #ffffff;
		border: none;
		box-shadow: 0 0 15px rgba(0, 240, 255, 0.15);
	}

	.cyber-btn:active {
		transform: scale(0.96);
		opacity: 0.9;
	}
</style>