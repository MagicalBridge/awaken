// const EventEmitter = require("./events")
const EventEmitter = require("events")
// const util = require("util")

function Girl() {}
Object.setPrototypeOf(Girl.prototype, EventEmitter.prototype)
// util.inherits(Girl, EventEmitter) // 原型继承 需要通过实例来调用继承的方法
// Girl.prototype.__proto__ = EventEmitter.prototype;
// Girl.prototype = Object.create(EventEmitter.prototype)

let girl = new Girl()

// 绑定事件 绑定的时候还木有失恋
// girl.on("失恋了", (text) => {
//   console.log("哭" + text)
// })

// // 绑定事件 可以绑定多个事件
// girl.on("失恋了", (text) => {
//   console.log("吃" + text)
// })

// girl.on("失恋了", (text) => {
//   console.log("呜呜呜" + text)
// })

// setTimeout(() => {
//   // 发布事件
//   girl.emit("失恋了", "不开心")
// }, 1000)

// 将哭泣的函数抽离出去
// const cry = (text) => {
//   console.log("哭" + text)
// }
// // 绑定事件 （绑定的时候还木有失恋）
// girl.on("失恋了", cry)
// // 可以绑定多个事件
// girl.on("失恋了", (text) => {
//   console.log("吃" + text)
// })

// // 过了一段时间之后，真的失恋了，触发失恋方法
// setTimeout(() => {
//   girl.emit("失恋了", "不开心")
//   girl.off("失恋了", cry)
//   girl.emit("失恋了", "不开心")
// }, 1000)

girl.once("失恋了", () => {
  console.log("逛街")
})
// 将哭泣的函数抽离出去
const cry = (text) => {
  console.log("哭" + text)
}
// 绑定事件 （绑定的时候还木有失恋）
girl.on("失恋了", cry)
// 可以绑定多个事件
girl.on("失恋了", (text) => {
  console.log("吃" + text)
})

setTimeout(() => {
  girl.emit("失恋了", "不开心")
  girl.off("失恋了", cry)
  girl.emit("失恋了", "不开心")
}, 1000)
