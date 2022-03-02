// const Koa = require("Koa")
const Koa = require("./koa/lib/application")

let app = new Koa()

// app.use((ctx, next) => {
//   ctx.body = "hello koa"
// })

// 先将项目改造成这个样子
app.use((req, res) => {
  res.end("hello koa")
})

app.listen(3000, function () {
  console.log("项目启动了")
})
