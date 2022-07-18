const { build } = require("esbuild")
const { resolve } = require("path")
const args = require("minimist")(process.argv.slice(2))

const target = args._[0] || "reactivity"
const format = args.f || "global"

const pkg = require(resolve(__dirname, `../packages/${target}/package.json`))

const outputFormat = format.startsWith("global")
  ? "iife"
  : format === "cjs"
  ? "cjs"
  : "esm"

// 输出的文件
const outfile = resolve(
  __dirname,
  `../packages/${target}/dist/${target}.${format}.js`
)

build({
  entryPoints: [resolve(__dirname, `../packages/${target}/src/index.ts`)], // 入口
  outfile, // 出口
  bundle: true, // 是不是将文件打包在一起，包含第三方的模块
  sourcemap: true, // 是否生成sourcemap文件
  format: outputFormat, // 输出的文件格式
  globalName: pkg.buildOptions?.name, // iife 场景下 挂载的全局变量名称
  platform: format === "cjs" ? "node" : "browser",
  watch: {
    // 监控文件变化
    onRebuild(error) {
      if (!error) console.log(`rebuilt~~~~`)
    },
  },
}).then(() => {
  console.log("watching~~~")
})
