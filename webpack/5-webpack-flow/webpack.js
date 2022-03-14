const Compiler = require("./Compiler")
// 这是webpack核心代码
function webpack(options) {
  // 1 初始化参数，从配置文件和shell语句中读取并合并参数，得到最终的配置对象
  let shellConfig = process.argv.slice(2).reduce((shellConfig, item) => {
    let [key, value] = item.split("=")
    shellConfig[key.slice(2)] = value
    return shellConfig
  }, {})

  let finalConfig = { ...options, ...shellConfig }
  let compiler = new Compiler(finalConfig)
  return compiler
}

module.exports = webpack
