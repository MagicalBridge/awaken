const Koa = require("koa")
const Router = require("koa-router")

const app = new Koa()
const router = new Router()
// cookie中一些常用字段的含义
// name value cookie存储值是以 键值对 形式存在的。
// domain: 针对某个域名生效 可以跨父域和子域  .baidu.com  a.baidu.com  b.baidu.com  默认是当前域名
// path：  当什么路径时可以访问cookie  可以设置cookie在哪里生效，默认是/ 都能被访问到
// expires/max-age: cookie存活时间 一般设置 max-age=10 代表是10s之后过期
// httpOnly: 表示浏览器无法通过代码来获取

router.get("/read", async (ctx, next) => {
  // koa用法
  ctx.body = ctx.cookies.get("name") || "empty"
})

router.get("/write", async (ctx, next) => {
  // koa用法
  ctx.cookies.set("name", "zf")
  ctx.cookies.set("age", "11", { httpOnly: true, domain: ".zf.cn" })
  ctx.body = "write ok"
})

/**
 * 使用nodemon 启动之后，首先访问 localhost:3000/write  age=11 这个cookie 是写不进去的，因为有domain的限制
 * name=zf 是可以写进去的，因为没有domain的限制。
 * 
 * 访问 localhost:3000/read 能够访问到的是 name=z 这个cookie 
 * 
 * domain 虽然在本地并不是很好测试，但是对于cookie的影响显而易见，我们可以看到，京东上有些cookie是 .jd.com 这种形式，那么
 * pc.jd.com  mobile.jd.com 都是能够访问的。
 */

app.use(router.routes())
app.listen(3000)
