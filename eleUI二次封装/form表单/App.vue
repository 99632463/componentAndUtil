<template>
  <div id="centerDiv">
    <!-- <router-view /> -->

    <ys-from :form="form" :form-items="formItems" :buttons="formButtons" :gutter="80" label-position="top"
      :disabled="formDisabled" :hidden="formHidden" :before-submit="handleSubmit">
    </ys-from>
  </div>
</template>

<script>
import ysFrom from './ys-form'
import ysSelect from './ys-form/control/ys-select'

export default {
  components: {
    ysFrom,
    ysSelect
  },
  data() {
    return {
      form: {
        name: '',
        age: '',
        hobby: '',
        fruits: [],
        type: 1,
        createDate: '',
        status: false,
        password: '',
        newpassword: ''
      },
      formHidden: {
        name: false
      },
      formDisabled: {
        name: true
      },
      formItems: [
        {
          type: 'input',
          label: '姓名',
          prop: 'name',
          required: true,
        },
        {
          type: 'input',
          value_type: 'number',
          label: '年龄',
          prop: 'age',
          required: true,
        },
        {
          type: 'select',
          label: '爱好',
          prop: 'hobby',
          required: true,
          props: {
            label: 'name',
            value: 'id'
          },
          options: [
            { name: '篮球', id: 1 },
            { name: '羽毛球', id: 2 }
          ],
          // slot: true
          // filterable: true,
          // isRemoteSearch: true,
          // remoteSearchReqFn: () => {}
          // reqFn: () => {},
          // reqParams: {}
        },
        {
          type: 'checkbox',
          label: '水果',
          prop: 'fruits',
          required: true,
          props: {
            label: 'name',
            value: 'id'
          },
          options: [
            { name: '苹果', id: 1 },
            { name: '香蕉', id: 2 }
          ]
        },
        {
          type: 'radio',
          label: '类型',
          prop: 'type',
          required: true,
          props: {
            label: 'name',
            value: 'id'
          },
          options: [
            { name: '是', id: 1 },
            { name: '否', id: 2 }
          ],
          callback: val => { }
        },
        {
          type: 'date',
          label: '日期',
          model: 'date',
          prop: 'createDate',
          required: true,
          format: 'yyyy/MM/dd'
        },
        {
          type: 'switch',
          prop: 'status',
          label: '滑动开关'
        },
        {
          type: 'input',
          value_type: 'password',
          prop: 'password',
          label: '密码',
          required: true,
        },
        {
          type: 'input',
          value_type: 'confirmPassword',
          prop: 'newpassword',
          label: '确认密码',
          required: true,
          label_html: {
            label: '密码',
            html: "<strong>自定义</strong",
            callback: () => {
              alert(1111)
            }
          }
        }
      ],
      formButtons: [
        { label: '提交', key: 'submit', type: 'primary' },
        { label: '重置', key: 'reset', type: 'primary' },
        { label: '返回', key: 'back', type: 'primary' }
      ]
    }
  },
  methods: {
    handleSubmit() {
      console.log(this.form);
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve()
        }, 1000)
      })
    }
  }
}
</script>