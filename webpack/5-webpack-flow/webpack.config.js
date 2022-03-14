const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = {
  mode: "development",
  devtool: false,
  entry: {
    main: "./src/index.js",
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.txt$/,
        use: ["raw-loader"],
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
