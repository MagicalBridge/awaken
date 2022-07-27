import babel from 'rollup-plugin-babel';
export default {
  input: "./src/index.js",
  output: {
    format: "umd", // 支持amd 和 commonjs 规范
    name: "Vue",
    file: "dist/vue.js",
    sourcemap: true,
  },
  plugins: [
    babel({
      exclude: "node_modules/**",
    }),
  ],
}
