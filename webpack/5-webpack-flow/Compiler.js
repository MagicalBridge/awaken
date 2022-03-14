const { SyncHook } = require("tapable")

class Compiler {
  constructor(options) {
    this.options = options
    this.hooks = {
      run: new SyncHook(), // 开始自动编译 刚刚开始
      emit: new SyncHook(), // 会在将要写入文件的时候触发
      done: new SyncHook(), // 将会在完成编译时候触发，全部完成
    }
  }
  // run 方法接收一个回调函数作为参数
  run(callback) {
    console.log("Compiler开始编译了")
    callback(null, {
      toJson() {
        return {
          files: [], // 产出了哪些文件
          assets: [], // 生成了哪些资源
          chunk: [], // 生成了哪些模块
          moudle: [], // 模块信息
          entries: [], // 入口信息
        }
      },
    })
  }
}

module.exports = Compiler
