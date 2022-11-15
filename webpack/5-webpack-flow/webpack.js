const Compiler = require("./Compiler")
// 这是webpack核心代码
function webpack(options) {
  // 1 初始化参数，从配置文件和shell语句中读取并合并参数，得到最终的配置对象
  let shellConfig = process.argv.slice(2).reduce((shellConfig, item) => {
    let [key, value] = item.split("=")
    shellConfig[key.slice(2)] = value
    return shellConfig
  }, {})
  // 2 用上一步得到的参数初始化 `Compiler` 对象
  let finalConfig = { ...options, ...shellConfig }
  let compiler = new Compiler(finalConfig)

  // 3 加载所有配置的插件
  const { plugins } = finalOptions
  // 每个插件都有一个 apply 方法，执行这个方法的时候，将compiler传递进去。
  for (let plugin of plugins) {
    plugin.apply(compiler)
  }
  // 最终返回compiler对象
  return compiler
}

module.exports = webpack
