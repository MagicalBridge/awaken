import babel from "@rollup/plugin-babel"
import resolve from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"

export default {
  input: "src/main.js",
  output: {
    file: "dist/bundle.cjs.js", //输出文件的路径和名称
    format: "iife", //五种输出格式：amd/es6/iife/umd/cjs
    name: "bundleName", //当format为iife和umd时必须提供，将作为全局变量挂在window下
    global: {
      lodash: "_",
      jquery: "$",
    },
  },
  external: ["lodash", "jquery"],
  plugins: [
    babel({
      babelHelpers: "bundled", // 这个配置babel希望被显示的配置上去
      exclude: "node_modules/**",
    }),
    resolve(),
    commonjs(),
  ],
}
