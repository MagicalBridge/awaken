const url = require("url")

const request = {
  // 在 application中的createContext方法中
  // ctx.request.req = req 将原生的req 属性挂载到了request上面

  // 这种写法是属性访问器，访问path的时候其实调用的是原生上的方法
  get path() {
    return url.parse(this.req.url).pathname
  },
  get url() {
    return this.req.url
  },
  get method() {
    return this.req.method
  },
}

module.exports = request
