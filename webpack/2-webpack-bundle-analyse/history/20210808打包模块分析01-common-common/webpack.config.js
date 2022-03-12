const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = {
  mode: "development",
  entry: {
    main: "./src/index.js",
  },
  devtool: "source-map",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
  },
  devServer: {
    port: 8083, // 指定HTTP 服务器的端口号
    open: true, // 自动打开浏览器
  },
  module: {
    rules: [
      {
        test: /\.txt$/,
        use: ["row-loader"],
      },
    ],
  },
  plugins: [
    // 插件是一个数组
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
  ],
}
