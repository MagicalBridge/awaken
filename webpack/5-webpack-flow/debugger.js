// 核心包
// const webpack = require("webpack")
const webpack = require("./webpack")
// 配置文件
const webpackOptions = require("./webpack.config")
// 创建编译对象 全局只有一个
const compiler = webpack(webpackOptions)
// 执行run方法
compiler.run((err,stats) => {
  console.log(err);
  console.log(stats.toJson({
    assets: true
  }));
})
