// 这是babel的核心包
let babelCore = require("@babel/core")
// 这是babel的工具包，判断某个节点是不是某个类型，动态创建某个类型的节点
let types = require("babel-types")
// 箭头函数插件
let arrowFunctionsPlugin = require("babel-plugin-transform-es2015-arrow-functions") 
// 源代码是一个箭头函数
let sourceCode = `
  const sum = (a,b) => {
    console.log(this)
    return a + b
  }
`;

// 调用 babel的转化能力
let targetCode = babelCore.transform(sourceCode,{
  // 使用的是箭头函数转换插件
  plugins:[arrowFunctionsPlugin]
})

console.log(targetCode.code)