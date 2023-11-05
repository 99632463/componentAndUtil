<template>
  <div>
    <el-input v-model="val" :type="type" v-bind="config.attrs" :disabled="disabled" />
    <div class="eye-wrap" v-if="['password', 'confirmPassword'].includes(config.value_type)">
      <img :src="eyeSrc" @click="toggleValueType">
    </div>
  </div>
</template>

<script>
import basic from '../mixins/basic';

export default {
  name: 'ysInput',
  mixins: [basic],
  data() {
    return {
      type: 'text',
      eyeSrc: require('../images/eye-open.png')
    }
  },
  watch: {
    'config.value_type': {
      handler(newVal) {
        if (['password', 'confirmPassword'].includes(this.config.value_type)) {
          this.type = 'password'
        } else if (newVal === 'number') {
          this.type = 'number'
        } else {
          this.type = 'text'
        }
      },
      immediate: true
    }
  },
  methods: {
    toggleValueType() {
      this.type = this.type === 'password' ? 'text' : 'password'
      this.eyeSrc = this.type === 'password' ?
        require('../images/eye-open.png') :
        require('../images/eye-close.png')
    }
  }
}
</script>

<style lang="scss" scoped>
.eye-wrap {
  position: absolute;
  right: 11px;
  top: 5px;
  cursor: pointer;
  font-size: 18px;

  img {
    width: 22px;
    height: 25px;
  }
}
</style>
