// 批量导入组件
export const getComponents = files => {
  if (files) {
    return files.keys().reduce((obj, key) => {
      const instance = files(key).default
      return obj[instance.name] = instance, obj
    }, {})
  }
}