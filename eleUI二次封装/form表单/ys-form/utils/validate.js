export const validatePhone = (rules, value, callback) => {
  const phone_reg = /^1[3456789]\d{9}$/;
  if (phone_reg.test(value)) callback()
  else callback('请输入11位数正确的手机号码')
}

export const validateEmail = (rules, value, callback) => {
  const email_reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
  if (email_reg.test(value)) callback()
  else callback('请输入正确的邮箱格式')
}

export const validatePassword = (rules, value, callback) => {
  const reg = /^[]/;
  if (!value) {
    callback('请输入密码')
  } else if (!reg.test(value)) {
    callback('请输入xxxxxx')
  } else {
    callback()
  }
}