import babel from "rollup-plugin-babel" // rollup 打包可以采用babel
export default {
  input: "./src/index.js", // 打包的出口
  output: {
    format: "umd", // 支持amd 和 commonjs规范 window.Vue
    name: "Vue",
    file: "dist/vue.js",
    sourcemap: true, // 调试功能 es5 -> es6源代码
  },
  plugins: [
    babel({
      // 使用babel进行转化 但是排除node_modules文件
      exclude: "node_modules/**", // glob 语法 不去编译下面的文件夹
    }),
  ],
}
