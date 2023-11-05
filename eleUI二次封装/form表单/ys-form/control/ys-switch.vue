<template>
  <el-switch v-model="val" :active-color="config.activeColor" :inactive-color="config.inactiveColor" :disabled="disabled">
  </el-switch>
</template>

<script>
import basic from '../mixins/basic';

export default {
  name: 'ysSwitch',
  mixins: [basic]
}
</script>

<style lang="scss" scoped></style>
