const http = require("http")

class Application {
  use() {}
  handleRequest = (req, res) => {
    console.log(req)
    console.log(res)
  }
  listen(...args) {
    // 执行原生的http方法创建服务
    const server = http.createServer(this.handleRequest)
    server.listen(...args)
  }
}

new Application().handleRequest()

module.exports = Application
