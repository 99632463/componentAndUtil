<template>
	<view class="bc-skeleton" :class="className" :style="skeletonSize" v-if="loading">
		<template v-if="type === 'row'">
			<view class="bc-skeleton-row" v-for="(item,index) in row" :key="index"
				:class="{'bc-m-b-10': index !== row-1}"></view>
		</template>
	</view>
</template>

<script>
	export default {
		name: 'BcSkeleton',
		props: {
			type: {
				type: String,
				default: 'row',
				validator: function(value) {
					return ['circle', 'rect', 'row'].indexOf(value) !== -1
				}
			},
			width: {
				type: [Number,String],
				default: '100%'
			},
			height: {
				type: Number,
				default: 100
			},
			row: {
				type: Number,
				default: 1
			},
			loading: {
				type: Boolean
			},
			customClass: {
				type: [String, Array]
			}
		},
		computed: {
			skeletonSize() {
				if (this.type !== 'row') {
					return {
						width: isNaN(Number(this.width)) ? this.width : this.width + 'rpx',
						height: this.height + 'rpx',
					}
				} else {
					return {}
				}
			},
			className() {
				if (Array.isArray(this.customClass)) {
					return [this.type, ...this.customClass];
				} else {
					return [this.type, this.customClass];
				}
			}
		},
		data() {
			return {

			}
		}
	}
</script>

<style lang="scss">
	.bc-skeleton {
		background: #F3F3F3;
	}

	.circle {
		border-radius: 50%;
	}

	.rect {
		border-radius: 10rpx;
	}

	.row {
		width: 100%;
	}

	.bc-skeleton-row {
		width: 100%;
		border-radius: 10rpx;
		height: 28rpx;
	}
</style>
