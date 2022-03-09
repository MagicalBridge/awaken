// 发布订阅模式能够解耦合，核心就是把多个方法先暂存起来，最后依次执行
// 观察者模式 vue2 基于发布订阅的 (发布订阅之间是没有依赖关系的)
const fs = require("fs")
const path = require("path")
// 事件中心
let events = {
  _events: [],
  on(fn) {
    this._events.push(fn)
  },
  emit(data) {
    this._events.forEach((fn) => fn(data))
  },
}

events.on(() => {
  console.log("每emit一次 就触发一次")
})

let arr = []
events.on((data) => {
  console.log("每emit一次 就push一次")
  arr.push(data)
})

events.on(() => {
  if (arr.length === 2) {
    // 最终结果还是计数器
    console.log("读取完毕", arr)
  }
})

// 订阅有顺序 可以采用数组来控制
fs.readFile(path.resolve(__dirname, "./a.txt"), "UTF8", function (err, data) {
  if (!err) {
    events.emit(data)
  }
})
fs.readFile(path.resolve(__dirname, "./b.txt"), "UTF8", function (err, data) {
  if (!err) {
    events.emit(data)
  }
})