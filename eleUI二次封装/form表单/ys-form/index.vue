<template>
  <el-form ref="form" :model="form" :label-width="labelWidth" :disabled="allDisabled" :label-position="labelPosition"
    :class="{ 'label-block': labelPosition == 'top' }">
    <el-row :gutter="gutter">
      <template v-for="item in formItems">
        <el-col v-if="!hidden[item.prop]" :span="item.col || col" :key="item.prop">
          <el-form-item :label="item.label" :prop="item.prop" :rules="item.rules" :label-width="item.labelWidth">
            <span v-if="item.label_html" slot="label" class="label-html">
              <span>{{ item.label_html.label }}</span>
              <span @click="item.label_html.callback && item.label_html.callback(item) " v-html="item.label_html.html"></span>
            </span>
            <slot v-if="item.slot" :name="item.prop" />
            <component v-else :is="'ys-' + item.type" v-model="form[item.prop]" :config="item"
              :disabled="disabled[item.prop]" />
          </el-form-item>
        </el-col>
      </template>
    </el-row>
    <el-form-item v-if="buttons && buttons.length">
      <el-button v-for="item in buttons" :key="item.key" :type="item.type" :loading="item.loading"
        @click="handleButton(item)">
        {{ item.label }}
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { getComponents } from './utils'
import createRules from './createRules'

export default {
  components: {
    ...getComponents(require.context('./control', false, /.vue$/))
  },
  props: {
    labelWidth: {
      type: String,
      default: () => '80px'
    },
    form: {
      type: Object,
      default: () => ({})
    },
    formItems: {
      type: Array,
      default: () => []
    },
    buttons: {
      type: Array,
      default: () => []
    },
    beforeSubmit: {
      type: Function,
      default: function () { }
    },
    col: {
      type: Number,
      default: () => 12
    },
    gutter: {
      type: Number,
      default: () => 0
    },
    hidden: {
      type: Object,
      default: () => ({})
    },
    disabled: {
      type: Object,
      default: () => ({})
    },
    allDisabled: Boolean,
    labelPosition: {
      type: String,
      default: () => 'right'
    }
  },
  data() {
    return {
      items: []
    }
  },
  created() {
    this.items = createRules(this.formItems, this.form)
  },
  methods: {
    handleButton(item) {
      this[item.key] && this[item.key](item)
    },
    submit(item) {
      if (item.callback && typeof item.callback === 'function') {
        item.callback(item)
      } else {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.$set(item, 'loading', true)
            if (this.beforeSubmit && typeof this.beforeSubmit === 'function') {
              this.beforeSubmit()
                .then(() => {
                  this.$set(item, 'loading', false)
                }).finally(() => {
                  this.$set(item, 'loading', false)
                })
            }
          }
        })
      }
    },
    reset() {
      this.$refs.form.resetFields()
    },
    back() {
      this.$router.back()
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep.label-block .el-form-item__label{
  display: flex;
}
.label-html{
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
