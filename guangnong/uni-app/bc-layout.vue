<template>
	<view class="bc-layout" :style="{background: greyBg ? '#f1f1f1':'#ffffff'}">
		<!-- 隐藏导航栏时，使用沉浸式部分占位 -->
		<view :class="{'bc-layout-status-bar':showHeader}"></view>
		<view class="bc-layout-header" v-if="showHeader" :style="{background: headerBg.background}">
			<view class="header-main" :class="{'bc-border-b': border}">
				<slot name="header">
					<view class="header-content" :style="{color: headerBg.color}">
						<view class="header-content-left bc-row-start bc-align-center" @click="clickLeft">
							<slot name="header-left">
								<u-icon :size="38" name="arrow-left" :color="headerBg.color" v-if="showBack"></u-icon>
							</slot>
						</view>
						<view class="header-content-title"
							:style="{color: headerBg.color, width: titleWidth +'rpx', 'margin-left': -(titleWidth / 2) + 'rpx'}">
							<slot name="header-title">
	<!-- 							<view class="u-line-1 bc-fz-32 bc-f-w-5" style="width: 100%;">
									{{ title }}
								</view>
								<view class="u-line-1 bc-fz-32 bc-f-w-5" style="width: 100%;">
									{{ address }}
								</view> -->
								<view class="u-line-1 bc-fz-32 bc-f-w-5" style="width: 100%; margin-bottom: 5rpx;">
									{{ title }}
								</view>
								<view class="u-line-1 bc-fz-20 bc-f-w-5" style="width: 100%;color: #a7a7a7;">
									{{ address }}
								</view>
							</slot>
						</view>
						<view class="header-content-right">
							<slot name="header-right">
								<text @click="clickRight">{{rightText}}</text>
							</slot>
						</view>
					</view>
				</slot>
			</view>
		</view>

		<!-- 导航固定定位后的占位符，单位为px -->
		<view :style="{height: headerHeight + 'px'}" class="header-seize"></view>

		<view v-if="error" class="bc-layout-error bc-p-60 bc-row-center bc-align-center" @click="clickError">
			<bc-error :text="errorText" @load="reLoad"></bc-error>
		</view>
		<template v-else>
			<slot></slot>
		</template>

		<!-- <u-toast ref="uToast" /> -->
		<bc-toast ref="uToast"></bc-toast>
		<u-modal v-model='showModal'  v-bind="modalConfig" @confirm="confirm" @cancel="cancel"
			:show-confirm-button="modalConfig.confirmText!== false" :show-cancel-button="!!modalConfig.cancelText"
			:confirm-color="confirmColor" :zoom="false" z-index="9999999999"></u-modal>
		<bc-loading v-model="showLoading"></bc-loading>

		<!-- #ifdef APP-PLUS -->
		<update-modal></update-modal>
		<!-- #endif -->

		<!-- tabbar高度占位 -->
		<view class="bc-layout-tabbar"></view>
		<!-- <app-console :isShow="false"></app-console> -->

		<u-mask :show="showExpressDialog" z-index='9999' :zoom="false">
			<view class="dialog">
				<view class="dialog-title">
					{{expressOrder.express_status === '0' ? '报价提醒' : '揽货提醒'}}
				</view>
				<view class="">
					<text v-if="expressOrder.rocket_username">【{{expressOrder.rocket_username}}】</text>
					{{expressOrder.express_status === '0' ? '邀请你对物流单进行报价' : '已确认发货'}}
				</view>
				<view class="dialog-footer">
					<view class="dialog-footer-button cancel" @click="closeDialog">
						稍后处理
					</view>
					<view class="dialog-footer-button" @click="toExpressDetail">
						{{expressOrder.express_status === '0' ? '立即报价' : '指派车辆'}}
					</view>
				</view>
			</view>
		</u-mask>
	</view>
</template>

<script>
	import updateModal from '@/components/global/update-modal.vue'
	import appConsole from '@/components/global/app-console/app-console.vue'
	export default {
		name: 'BcLayout',
		components: {
			appConsole,
			updateModal
		},
		data() {
			return {
				headerHeight: 0,
				showExpressDialog: false,
				expressOrder: {}
			};
		},
		props: {
			error: Boolean,
			errorText: {
				type: String,
				default: "页面走丢了"
			},
			showHeader: {
				type: Boolean,
				default: true
			},
			showBack: {
				type: Boolean,
				default: true
			},
			isBack: {
				type: Boolean,
				default: true
			},
			title: String,
			address: String,
			headerType: {
				type: String,
				validator: function(value) {
					return ['', 'theme', 'transparent'].indexOf(value) !== -1
				}
			},
			rightText: String,
			greyBg: {
				type: Boolean,
				default: true
			},
			titleWidth: {
				type: Number,
				default: 300
			},
			border: {
				type: Boolean
			}
		},
		watch: {
			'$store.state.ui.toast'(val) {
				if (val) {
					this.$refs.uToast.show(val)
				}
			},
			'$store.state.page.closeExpressDialog'(val) {
				this.showExpressDialog = false
			},
			'$store.state.page.socketMessageList'(val) {
				if (val && val.length) {
					// 遍历消息，并修改对应的最新消息以及消息数量
					val.forEach(el => {
						let msg = el.msg
						if (typeof msg !== 'object') {
							msg = JSON.parse(msg) || {}
						}
						
						// console.error(msg,'msg')
						
						if (msg.org_id && msg.org_id.indexOf(this.userInfo.org_id) !== -1 && this.userInfo.current_role === '3') { // 判断消息是给当前用户的，并且当前用户是物流商
							if (msg.mess_type && (msg.mess_type.type === 'delivery' || msg.mess_type.type === 'express')) { // 物流单
								if (!this.showExpressDialog && msg.order_info) { // 弹窗没有打开，并且物流单信息存在
									msg.order_info.express_status = msg.order_info.express_status || msg.order_info.status
									if (msg.order_info.express_status === '0' || (msg.order_info.express_status ===
										'2' && msg.order_info.order_confirm === '1')) { // 待接单// 待揽货且买家已发货
										this.openDialog(msg.order_info)
									}
								}
							}
						}
					})
				}
			}
		},
		mounted() {
			if (this.showHeader) {
				this.$nextTick(() => {
					const query = uni.createSelectorQuery().in(this);
					query.select('.header-main').boundingClientRect(data => {
						this.headerHeight = data.height;
					}).exec();
				})
			}
		},
		beforeDestroy(){
			this.$store.commit("ui/hideModal")
		},
		computed: {
			modalConfig() {
				return this.$store.state.ui.modalConfig
			},
			showModal: {
				get() {
					return this.$store.state.ui.modal;
				},
				set(val) {
					this.$store.commit("ui/hideModal")
				}
			},
			confirmColor() {
				if (this.modalConfig.type) {
					return this.modalConfig.type === 'theme' ? this.$config.themeColor : this.$u.color[this.modalConfig
						.type];
				} else {
					return this.modalConfig.confirmColor
				}
			},
			showLoading: {
				get() {
					return this.$store.state.ui.loading;
				},
				set(val) {
					this.$store.commit("ui/setLoading", val);
				}
			},
			headerBg() {
				return {
					background: this.headerType === "theme" ? this.$config.themeColor : this.headerType === "transparent" ?
						'transparent' : "#fff",
					color: this.headerType === "theme" ? this.$config.reverseColor : ""
				}
			}
		},
		methods: {
			openDialog(item) {
				this.expressOrder = item
				console.error(this.expressOrder,'expressOrder')
				// this.express_id = item.express_id
				// this.rocket_username = item.rocket_username
				this.showExpressDialog = true
			},
			closeDialog() {
				// this.showExpressDialog = false
				this.$store.commit("page/watchExpressDialog")
			},
			toExpressDetail() {
				this.closeDialog()
				this.$Router.push({
					path: '/pages/webview/webview',
					query: {
						src: `/express_order/detail/app`,
						p: `express_id=${ this.expressOrder.express_id }`
					}
				});
			},
			clickLeft() {
				if (this.isBack) {
					this.$Router.back(1);
				}
				this.$emit("back");
			},
			cancel() {
				this.modalConfig.cancel();
			},
			confirm() {
				this.modalConfig.confirm();
			},
			clickRight() {
				this.$emit("clickRight")
			},
			clickError() {
				this.$emit("clickError");
			},
			reLoad() {
				this.$emit("load");
			}
		}
	}
</script>

<style lang="scss">
	.bc-layout {
		// display: flex;
		// // flex-direction: column;
		min-height: calc(100vh - var(--window-bottom));

		.bc-layout-header {
			position: fixed;
			top: 0;
			padding-top: var(--status-bar-height);
			width: 100%;
			z-index: 999;

			.header-content {
				display: flex;
				align-items: center;
				padding: 0 30rpx;
				height: var(--navbar-height);
				justify-content: space-between;
				position: relative;
				line-height: 1;
			}

			.header-content-left {
				flex-shrink: 0;
				margin-right: 30rpx;
				line-height: 1;
				height: var(--navbar-height);
				width: 112rpx;
			}

			.header-content-title {
				position: absolute;
				left: 50%;
				height: 100%;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				line-height: 1;
				text-align: center;
			}

			.header-content-right {
				flex-shrink: 0;
				margin-left: 30rpx;
				line-height: 1;
			}
		}

		&-tabbar {
			width: 100%;
			height: var(--window-bottom);
		}

		&-right {
			padding: 0 30rpx;
		}

		&-status-bar {
			padding-top: var(--status-bar-height);
		}

		&-error {
			height: 100%;
		}
	}
	
	.dialog {
		position: fixed;
		width: 600rpx;
		top: 50%;
		left: 50%;
		margin-top: -200rpx;
		margin-left: -300rpx;
		background: #fff;
		border-radius: 16rpx;
		padding: 48rpx;
		padding-bottom: 40rpx;
		text-align: center;
		
		.dialog-title {
			font-size: 36rpx;
			font-weight: bold;
			padding-bottom: 48rpx;
		}
		
		.dialog-footer {
			display: flex;
			padding-top: 48rpx;
			
			.dialog-footer-button {
				width: 234rpx;
				height: 72rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				border-radius: 8rpx;
				font-size: 32rpx;
				background-color: $theme-color;
				color: #fff;
			}
			
			.cancel {
				margin-right: 40rpx;
				color: $theme-color;
				background-color: #F3F4F6;
			}
		}
	}
</style>
