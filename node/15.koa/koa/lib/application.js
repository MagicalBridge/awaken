const http = require("http")

const context = require("./context")
const request = require("./request")
const response = require("./response")

class Application {
  constructor() {
    // 每个应用都扩展了一个全新的 context、request、response
    // 从而实现应用的隔离
    this.context = Object.create(context)
    this.request = Object.create(request)
    this.response = Object.create(response)
  }

  createContext(req, res) {
    // 每次请求来的时候都应该根据当前应用的上下文创建一个全新的上下文
    let ctx = Object.create(this.context)
    let request = Object.create(this.request)
    let response = Object.create(this.response)
    // 这个是koa中封装的属性
    ctx.request = request
    // 同时原生的req属性也会挂载到 request 上
    ctx.request.req = ctx.req = req
    return ctx
  }

  use(middleware) {
    this.fn = middleware
  }

  handleRequest = (req, res) => {
    const ctx = this.createContext(req, res)
    this.fn(ctx)
  }

  listen(...args) {
    // 执行原生的http方法创建服务
    const server = http.createServer(this.handleRequest)
    server.listen(...args)
  }
}

module.exports = Application
