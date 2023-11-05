import md5Libs from "uview-ui/libs/function/md5";
import config from "@/config/app.js"
import {
	getGroupId
} from '@/api/message.js'

import {
	getPermissionDetail
} from '@/api/vip.js'

import {
	checkPaymentPassword,
	hasMerchantWallet
} from '@/api/account.js'

import {
	productSpuList
} from '@/api/product.js'


// 数组位置上移
export const swapItems = (arr, index1, index2) => {
	arr[index1] = arr.splice(index2, 1, arr[index1])[0]
	return arr
}

/* 文件或本地文件路径 转base64 */
export function fileToBase64(file, filePath) {
	return new Promise(resolve => {
		// #ifdef APP-PLUS
		plus.io.resolveLocalFileSystemURL(filePath, (entry) => {
			entry.file((e) => {
				let fileReader = new plus.io.FileReader();
				fileReader.onload = (r) => {
					resolve(r.target.result);
				}

				fileReader.readAsDataURL(e)
			})
		})
		// #endif

		// #ifdef H5
		let reader = new FileReader();
		reader.onload = (e) => {
			resolve(e.target.result)
		}
		reader.readAsDataURL(file)
		// #endif
	})
}

/* h5下载网页图片 */
export function saveH5Image(url, name = 'download') {
	// #ifdef H5
	let link = document.createElement('a');
	link.href = url;
	link.download = name;
	link.click();
	// #endif
}

/* 复制文字粘贴板 */
export function copyText(text, nowShowToast) {
	return new Promise((resolve, reject) => {
		// #ifdef H5
		let input = document.createElement('input');
		document.body.appendChild(input);
		input.style.height = 0;
		input.style.position = 'fixed';
		input.style['z-index'] = '-99';
		input.value = text;
		input.select();
		document.execCommand("copy");
		document.body.removeChild(input);
		resolve();
		// #endif

		// #ifndef H5
		uni.setClipboardData({
			data: text,
			showToast: nowShowToast ? true : false,
			success: function() {
				resolve();
			},
			fail: function() {
				reject();
			}
		});
		// #endif
	})
}

// 设置cookie
export function setCookie(name, value, time) {
	let exp = new Date();
	let strsec = getsec(time);
	exp.setTime(exp.getTime() + strsec * 1);

	let cookie = name + "=" + escape(value) + ";path=/;expires=" + exp.toGMTString();

	// #ifdef H5
	document.cookie = cookie;
	// #endif

	// #ifdef APP-PLUS
	plus.navigator.setCookie(config.appUrl, cookie);
	plus.navigator.setCookie(config.apiUrl, cookie);
	// #endif
}

// 删除cookie
export function removeCookie(name) {
	let exp = new Date();
	exp.setTime(exp.getTime() - 1);
	let cookie = name + "=null" + ";path=/;expires=" + exp.toGMTString();

	// #ifdef H5
	document.cookie = cookie
	// #endif

	// #ifdef APP-PLUS
	plus.navigator.setCookie(this.$config.appUrl, cookie);
	plus.navigator.setCookie(this.$config.apiUrl, cookie);
	// #endif
}

function getsec(str) {
	if (/^[0-9]*$/.test(str)) {
		return str * 24 * 60 * 60 * 1000;
	} else if (/^[0-9]*[s|h|d]$/.test(str)) {
		var str1 = str.slice(0, -1);
		var str2 = str.substr(-1);
		if (str2 == "s") {
			return str1 * 1000;
		} else if (str2 == "h") {
			return str1 * 60 * 60 * 1000;
		} else if (str2 == "d") {
			return str1 * 24 * 60 * 60 * 1000;
		}
		console.error("设置cookie的时间格式不正确, 系统将返回默认的时间：1h");
		return 60 * 60 * 1000;
	} else {
		console.error("设置cookie的时间格式不正确，系统将返回默认的时间：1h");
		return 60 * 60 * 1000;
	}
}

// 获取元素到顶部的高度，支持多个元素，返回数组
export function getDescBox(className) {
	let that = this;
	let count = 0;
	return new Promise(resolve => {
		getHeight();

		function getHeight() {
			uni
				.createSelectorQuery()
				.in(that)
				.select(className)
				.boundingClientRect()
				.exec(res => {
					if (res[0]) {
						resolve(res[0].top);
					} else {
						that.$nextTick(() => {
							++count <= 8 ? getHeight() : resolve(null);
						});
					}
				});
		}
	});
}

export function verify(type, value) {
	switch (type) {
		case 'text': // 匹配只由中英文、数字组成的文本
			return /^[\u4e00-\u9fa5a-zA-Z0-9]+$/.test(value)
		case 'numText': // 匹配包含数字的文本
			return /.*[0-9]{1,}.*/.test(value)
		case 'quantity': // 数量，正整数和0
			return /^[1-9]\d*$/.test(value) || value === 0
		case 'price': // 数量，正整数和0
			return /(?:^[1-9]([0-9]+)?(?:\.[0-9]{1,2})?$)|(?:^(?:0)$)|(?:^[0-9]\.[0-9](?:[0-9])?$)/.test(value)



	}


}

// 表单数字输入最多输入两位小数
export const keepTwoDecimal = options => {
	const { value: v, instance: $this, vModelField: field } = options
	const _value = v.includes('.') ? v.substring(0, v.indexOf('.') + 3) : v;
	
	$this.$nextTick(() => {
	  $this[field] = _value
	})
}

const install = (Vue, vm) => {
	Vue.prototype.$throttle = Vue.prototype.$u.throttle;
	Vue.prototype.$debounce = Vue.prototype.$u.debounce;
	Vue.prototype.$deepClone = Vue.prototype.$u.deepClone;
	Vue.prototype.$deepMerge = Vue.prototype.$u.deepMerge;
	Vue.prototype.$timeFormat = Vue.prototype.$u.timeFormat;
	Vue.prototype.$randomArray = Vue.prototype.$u.randomArray;
	Vue.prototype.$guid = Vue.prototype.$u.guid;
	Vue.prototype.$queryParams = Vue.prototype.$u.queryParams;
	Vue.prototype.$test = Vue.prototype.$u.test;
	Vue.prototype.$random = Vue.prototype.$u.random;
	Vue.prototype.$trim = Vue.prototype.$u.trim;
	Vue.prototype.$md5 = md5Libs.md5;
	Vue.prototype.$fileToBase64 = fileToBase64;
	Vue.prototype.$saveH5Image = saveH5Image;
	Vue.prototype.$copyText = copyText;
	Vue.prototype.$setCookie = setCookie;
	Vue.prototype.$removeCookie = removeCookie;
	Vue.prototype.$getDescBox = getDescBox;
	Vue.prototype.$verify = verify;


	Vue.prototype.$toBack = function() {
		Vue.prototype.$Router.back();
	}

	Vue.prototype.$toast = function(title = "", type = "default", duration, position, url, icon) {
		if (title.constructor == Object && title.title) {
			Vue.prototype.$store.commit("ui/showToast", title)
		} else {
			if (title) {
				Vue.prototype.$store.commit("ui/showToast", {
					title,
					type,
					duration,
					position,
					url,
					icon
				})
			}
		}
	};

	// 拨打电话
	Vue.prototype.$call = function(phone) {
		if(!phone) {
			Vue.prototype.$toast('手机号为空', 'warning')
			return
		}
		if (!Vue.prototype.$u.test.mobile(phone)) {
			Vue.prototype.$toast('号码格式不正确', 'error')
			return;
		}
		uni.makePhoneCall({
			phoneNumber: phone
		})
	};

	// 进入聊天
	Vue.prototype.$openChat = function(org_id, user_code, type,routerType = 1) {
		Vue.prototype.$loading();
		getGroupId({
			user_code_str: user_code,
			org_id_str: org_id,
			'X-Auth-Token': Vue.prototype.$store.state.user.userInfo['X-Auth-Token'],
			'X-User-Id': Vue.prototype.$store.state.user.userInfo['X-User-Id'],
			relation_type: type
		}).then(res => {
			Vue.prototype.$loading(false);
			if(routerType == 1){
				Vue.prototype.$Router.push({
					path: '/pages/chat/message',
					query: {
						group_id: res
					}
				})
			}else{
				Vue.prototype.$Router.replace({
					path: '/pages/chat/message',
					query: {
						group_id: res
					}
				})
			}
			
		}).catch(err => {
			Vue.prototype.$loading(false);
			Vue.prototype.$toast(err.msg || '获取聊天组失败')
		})
	};

	Vue.prototype.$modal = function(content, title, type, cancelText, confirmText, cancelColor, confirmColor) {
		console.log(content)
		if (content.constructor == Object) {
			return Vue.prototype.$store.dispatch("ui/showModal", content)
		} else {
			return Vue.prototype.$store.dispatch("ui/showModal", {
				content,
				title,
				cancelText,
				confirmText,
				type,
				confirmColor,
				cancelColor
			})
		}
	};

	Vue.prototype.$loading = function(isLoading) {
		if (isLoading !== false) {
			isLoading = true;
		}

		Vue.prototype.$store.commit("ui/setLoading", isLoading);
	}

	Vue.prototype.$system = function() {
		return new Promise(resolve => {
			let systemInfo = Vue.prototype.$store.state.system;
			if (systemInfo) {
				resolve(systemInfo);
			} else {
				uni.getSystemInfo({
					success: (data) => {
						Vue.prototype.$store.commit("setSystem", data);
						resolve(data);
					},
					fail: () => {
						resolve();
					}
				})
			}
		})
	}

	Vue.prototype.$isIOS = function() {
		return uni.getSystemInfoSync().platform === 'ios'
	}

	// 延期执行
	Vue.prototype.$delay = function() {
		let timer = null;
		return function(func, wait = 800) {
			if (timer) {
				clearTimeout(timer);
				timer = null;
			} else {
				timer = setTimeout(() => {
					func();
				}, wait)
			}
		}
	}();

	// 图片压缩并上传，size 单位kb
	Vue.prototype.$compressImage = function(url, size, quality = 30) {
		console.log(size, "size")
		return new Promise((resolve, reject) => {
			if (url) {
				if (size < 300) { // 小于300kb不压缩
					Vue.prototype.$upload(url).then(obs => {
						resolve({
							url,
							updateUrl: obs
						})
					}).catch(err => {
						reject("图片上传失败")
					})
				} else {
					uni.compressImage({
						src: url,
						quality,
						success: (res) => {
							Vue.prototype.$upload(res.tempFilePath).then(obs => {
								resolve({
									url,
									updateUrl: obs
								})
							}).catch((err) => {
								reject("图片上传失败")
							})
						}
					})
				}

			} else {
				reject("图片路径不存在")
			}
		})
	}


	Vue.prototype.$getPaymentStatus = function() {
		return new Promise((resolve, reject) => {
			// 是否设置了密码
			this.$loading()
			checkPaymentPassword({}).then(res => {
				if (!res.has_payment_password) {
					this.$loading(false)
					this.$Router.replace({
						name: 'resetPayPassword'
					})
				} else {
					// 是否认证开户
					this.$loading(false)
					hasMerchantWallet().then(res => {
						if (res.merchant_status === '0') {
							this.$loading(false)
							this.$Router.replace({
								name: 'openPay'
							})
						} else {
							reject()
							this.$loading(false)
						}
					}).catch(err => {
						reject(err)
						this.$loading(false)
					})
				}
			}).catch(err => {
				reject(err)
				this.$loading(false)
			});
		});
	}

	Vue.prototype.$getMinePermissionDetail = function() {
		return new Promise((resolve, reject) => {
			// 是否购买会员
			getPermissionDetail().then(res => {
				if (JSON.stringify(res.permission_detail) == '{}') {
					reject()
				} else {
					resolve()
				}
			}).catch(err => {
				resolve()
			})
		});
	}

	// 是否认证
	Vue.prototype.$isAuth = function() {
		return new Promise((resolve, reject) => {
			hasMerchantWallet().then(res => {
				resolve(res)
			}).catch(err => {
				reject(err)
			})
		});
	}



	// 是否上传第一个商品
	Vue.prototype.$isFirstProduct = function() {
		return new Promise((resolve, reject) => {
			productSpuList({
				classify_id: "",
				org_id: Vue.prototype.$store.state.user.userInfo.org_id,
				page: 1,
				per_page: 20,
				status: "0",
			}).then(res => {
				if (res.count_0 === 0 && res.count_1 === 0) {
					reject()
				} else {
					resolve()
				}
			}).catch(err => {
				console.log(err)
			})
		});
	}

	// 体验账号拦截
	Vue.prototype.$isExperience = function() {
		let isExperience = uni.getStorageSync('IsExperience') //是否为体验账号 //是否为体验账号
		if (isExperience) {
			Vue.prototype.$modal({
				type: 'theme',
				title: '登录提示',
				content: '请先登录再进行操作',
				cancelText: '取消',
				confirmText: '去登录',

			}).then(() => {
				Vue.prototype.$store.commit('user/logout')
				Vue.prototype.$store.commit('page/destroy')
				uni.setStorageSync('IsExperience', false) //设置体验账号
				Vue.prototype.$Router.replaceAll({
					name: 'login',
				})
			}).catch(async (err) => {

			})
			return true
		} else {
			return false
		}

	}
	
	// 等六拦截
	Vue.prototype.$loginExperience = function() {
		if(!uni.getStorageSync('auth_token')){
			Vue.prototype.$Router.push({
				name: 'login',
			})
			return false
		}else{
			return true
		}
	}

	// 统一扫码处理、
	Vue.prototype.$scan = function() {
		// #ifdef APP-PLUS
		uni.scanCode({
			success: (res) => {
				console.log('条码类型：' + res.scanType, 'QR_CODE');
				console.log('条码内容：' + JSON.stringify(res));
				if (res.scanType !== 'QR_CODE') {
					return Vue.prototype.$toast('只支持二维码扫描')
				};
				let result = JSON.parse((res.result).replace(/\'/g, '"'))
				try {
					if (result && result.params_type) {
						switch (result.params_type) {
							case 'user_info': // 添加好友二维码
								console.log(result.params)
								if (Vue.prototype.$store.state.user.userInfo.user_code == result
									.params.user_code) {
									Vue.prototype.$toast('不能添加自己为好友 啊')
									return
								}
								Vue.prototype.$Router.push({
									path: '/pages/my/friends/editFriends',
									query: {
										user_code: result.params.user_code,
										type: 'add'
									}
								})
								break;
							case 'product_info':
								Vue.prototype.$toast('暂未开放')
								break;
							case 'origin_place':
								Vue.prototype.$toast('暂未开放')
								break;
							case 'express_pay':
								var params = {
									code: result.params.order_code,
									url_type: 'pay',
									is_frozen: '0',
									account: 'company',
									remark: '',
									payment_type: '61', // 物流费
									amount: result.params.amount,
									pay_org_id: Vue.prototype.$store.state.user.userInfo.org_id,
									receipt_org_id: result.params.order_seller_org_id,
									// back_url: encodeURIComponent(window.location.href), // 支付成功后回调地址
								}
								this.$Router.push({
									path: '/pages/my/fundAccount/payment' + this
										.$queryParams(params),
								})
								break;
							case 'order_pay':
								var params = {
									code: result.params.order_code,
									url_type: 'pay',
									is_frozen: '0',
									account: 'company',
									remark: '',
									payment_type: '51', // 物流费
									amount: result.params.amount,
									pay_org_id: Vue.prototype.$store.state.user.userInfo.org_id,
									receipt_org_id: result.params.order_seller_org_id,
									// back_url: encodeURIComponent(window.location.href), // 支付成功后回调地址
								}
								this.$Router.push({
									path: '/pages/my/fundAccount/payment' + this
										.$queryParams(params),
								})
								break;
							case 'pc_login':
								Vue.prototype.$toast('暂未开放')
								break;
							case 'coupon':
								this.$Router.replace({
									path: '/pages/price/writeOff/index',
									query: {
										coupon_code:  result.coupon_code
									}
								});
								break;
							default:
								Vue.prototype.$toast('不支持的二维码')
						}
					}
				} catch (e) {
					Vue.prototype.$toast('不支持的二维码')
				}
			}
		});
		// #endif

		// #ifndef APP-PLUS
		this.$modal({
			content: "请在APP上进行扫码操作"
		})
		// #endif
		// this.$Router.push({
		// 	name: 'scan'
		// })
	};
}

export default install
