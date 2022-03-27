// const Koa = require("Koa")
const Koa = require("./koa")

let app = new Koa()

// 先将项目改造成这个样子
app.use((ctx) => {
  // console.log(ctx.req.url);
  // console.log(ctx.request.path);
  // console.log(ctx.request.req.url);
  console.log(ctx.path)
})

app.listen(3000, function () {
  console.log("项目启动了")
})
