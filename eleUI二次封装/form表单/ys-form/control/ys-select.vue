<template>
  <el-select v-model="val" v-bind="config.attrs" style="width: 100%" :filterable="config.filterable"
    :multiple="config.multiple" :collapse-tags="config.collapseTags" :remote="config.isRemoteSearch"
    :reserve-keyword="config.isRemoteSearch" :remote-method="remoteMethod" :loading="loading" :disabled="disabled">
    <el-option v-for="item in options" :key="item.value" :label="item[props.label]" :value="item[props.value]">
      <slot :data="item" />
    </el-option>
  </el-select>
</template>

<script>
import basic from '../mixins/basic';

export default {
  name: 'ysSelect',
  mixins: [basic],
  data() {
    return {
      options: [],
      props: {
        label: 'label',
        value: 'value'
      },
      loading: false
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
      if (config.reqFn && typeof config.reqFn === 'function') {
        this.fetchOptions(config)
        return
      }
      if (config.options && Array.isArray(config.options) && config.options.length) {
        this.options = config.options
      }
    },
    async fetchOptions(config) {
      const { reqFn, reqParams } = config
      const { data } = await reqFn(reqParams)
      this.options = data || []
    },
    initProps() {
      const props = this.config.props
      if (props && Object.keys(props).length) {
        this.props = { ...this.props, ...props }
      }
    },
    remoteMethod(query) {
      if (this.config.isRemoteSearch) {
        if (query) {
          this.loading = true;
          this.config.remoteSearchReqFn()
            .then(() => {
              this.loading = false
            }).finally(() => {
              this.loading = false
            })
        } else {
          this.options = [];
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
