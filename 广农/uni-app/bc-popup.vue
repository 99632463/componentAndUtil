<template>
	<u-popup v-model='show' mode="bottom" :safe-area-inset-bottom="true" :mask="mask"
		:mask-close-able="maskCloseAble" :border-radius='borderRadius' :z-index="zIndex">
		<view class="bc-popup">
			<view class="bc-popup-header" v-if="showHeader">
				<view class="bc-popup-header-btn bc-color-theme" @click="close">{{cancelText}}</view>
				<view class="bc-popup-title bc-line-1">{{title}}</view>
				<view class="bc-popup-header-btn bc-color-theme" @click="confirm">{{confirmText}}</view>
			</view>

			<scroll-view :scroll-y="true" class="bc-popup-content">
				<slot></slot>
			</scroll-view>
		</view>
	</u-popup>
</template>

<script>
	export default {
		computed: {
			show: {
				get() {
					return this.value;
				},
				set(value) {
					this.$emit("input", value);
				}
			}
		},
		props: {
			value: {
				type: Boolean
			},
			title: {
				type: String
			},
			mask: {
				type: Boolean,
				default: true
			},
			maskCloseAble: {
				type: Boolean,
				default: true
			},
			zIndex: {
				type: [Number, String]
			},
			showHeader: {
				type: Boolean,
				default: true
			},
			cancelText: {
				type: String,
				default: "取消"
			},
			confirmText: {
				type: String,
				default: "确定"
			},
			borderRadius: {
				type: [Number, String],
				default: () => 0
			}
		},
		data() {
			return {
				iconColor: this.$config.themeColor,
			}
		},
		created() {

		},
		methods: {
			close() {
				this.$emit("cancel");
				this.show = false;
			},
			confirm() {
				this.$emit("confirm");
				// this.show = false;
			}
		}
	}
</script>

<style lang="scss">
	.bc-popup {
		padding-top: 20rpx;

		.bc-popup-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 0 30rpx 30rpx;
			color: $u-content-color;
			border-bottom: 2rpx solid #F3F3F3;

			.bc-popup-title {
				font-size: 32rpx;
				color: #000;
				flex: 1;
				text-align: center;
				padding: 0 30rpx;
			}

			.bc-popup-header-btn {
				font-size: 26rpx;
				flex-shrink: 0;
			}
		}

		.bc-popup-content {
			max-height: 1127rpx;
		}
	}
</style>
