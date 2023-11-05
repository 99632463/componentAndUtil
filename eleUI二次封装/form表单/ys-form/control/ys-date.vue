<template>
  <el-date-picker v-bind="config.attrs" style="width: 100%" v-model="val" :type="config.model || 'datetime'"
    :format="config.format" :value-format="config.format || 'yyyy-MM-dd HH:mm:ss'"
    :placeholder="config.placeholder || '选择日期'" :start-placeholder="config.start_placeholder || '开始日期'"
    :end-placeholder="config.end_placeholder || '结束日期'" :range-separator="config.range || '~'" :disabled="disabled"
    :picker-options="pickerOptions()">
  </el-date-picker>
</template>

<script>
import basic from '../mixins/basic';

export default {
  name: 'ysDate',
  mixins: [basic],
  methods: {
    pickerOptions() {
      const {
        disable_today_before, disable_before_include_today, disable_today_after,
        disable_after_include_today
      } = this.config
      return {
        disabledDate: time => {
          if (disable_today_before)
            return time.getTime() < new Date() - 8.64e7
          else if (disable_before_include_today)
            return time.getTime() < new Date()
          else if (disable_today_after)
            return time.getTime() > new Date()
          else if (disable_after_include_today)
            return time.getTime() > new Date() - 8.64e7
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
