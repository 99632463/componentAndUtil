import { validatePhone, validateEmail, validatePassword } from './utils/validate'

const createRules = (data, field) => {
  data.forEach(item => {
    let ruleArray = []

    // 必填规则
    if (item.required) {
      ruleArray.push({ required: true, message: item.message || createMessage(item) })
    }
    // 自定义其它规则
    if (item.rules && Array.isArray(item.rules) && item.rules.length) {
      ruleArray = ruleArray.concat(item.rules)
    }
    // 自定义验证手机号
    if (item.value_type === 'phone') {
      ruleArray.push({ validator: validatePhone, trigger: 'change' })
    }
    // 自定义验证邮箱
    if (item.value_type === 'email') {
      ruleArray.push({ validator: validateEmail, trigger: 'change' })
    }
    // 自定义验证密码
    if (item.value_type === 'password') {
      ruleArray.push({ validator: validatePassword, trigger: 'change' })
    }
    // 自定义验证确认密码
    if (item.value_type === 'confirmPassword') {
      // const reg = /^[]/;
      const p1 = data.filter(item => item.value_type === 'password')[0]
      const validateConfirmPassword = (rules, value, callback) => {
        const password = field[p1.prop]

        if (!value) {
          callback('请输入确认密码')
        } else if (value !== password) {
          callback('两次密码输入不一致')
        }
        // else if (!reg.test(value)) {        } 
        else {
          callback()
        }
      }
      ruleArray.push({ validator: validateConfirmPassword, trigger: 'change' })
    }

    item.rules = ruleArray
  })
  return data
}

const createMessage = item => {
  let msg = ''
  switch (item.type) {
    case 'input':
      msg = '请输入';
      break;
    case 'select':
    case 'checkbox':
    case 'date':
      msg = '请选择';
      break;
  }
  return `${msg}${item.label}`
}

export default createRules