<template>
  <el-radio-group v-model="val" v-bind="config.attrs" :disabled="disabled">
    <el-radio v-for="item in options" :key="item.value" :label="item[props.value]">{{ item[props.label] }}</el-radio>
  </el-radio-group>
</template>

<script>
import basic from '../mixins/basic';

export default {
  name: 'ysRadio',
  mixins: [basic],
  data() {
    return {
      options: [],
      props: {
        label: 'label',
        value: 'value'
      }
    }
  },
  watch: {
    config: {
      handler(newVal) {
        this.initOptions(newVal)
        this.initProps()
      },
      immediate: true
    }
  },
  methods: {
    initOptions(config) {
      if (config.options && Array.isArray(config.options) && config.options.length) {
        this.options = config.options
      }
    },
    initProps() {
      const props = this.config.props
      if (props && Object.keys(props).length) {
        this.props = { ...this.props, ...props }
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
