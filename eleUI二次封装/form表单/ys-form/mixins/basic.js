export default {
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    config: {
      type: Object,
      default: () => ({})
    },
    value: [String, Number, Array, Boolean, Date],
    disabled: Boolean
  },
  computed: {
    val: {
      get() {
        console.log(111, this.value);
        return this.value
      },
      set(newVal) {
        this.$emit('change', newVal)
        
        const { callback = () => {} } = this.config
        callback && callback(newVal)
      }
    }
  }
}