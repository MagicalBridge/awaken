const HtmlWebpackPlugin = require("html-webpack-plugin")
const HotModuleReplacementPlugin = require("webpack/lib/HotModuleReplacementPlugin")
const path = require("path")

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },
  devServer: {
    port: 8090,
    hot: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
    new HotModuleReplacementPlugin()
  ],
}
