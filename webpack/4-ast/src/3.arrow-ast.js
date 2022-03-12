// 我们尝试手写一般babel插件

let babelCore = require("@babel/core")
// 这是babel的工具包，判断某个节点是不是某个类型，动态创建某个类型的节点
let types = require("babel-types")

// 箭头函数插件其实是一个钩子函数，在遍语法树的过程中，可以捕获某些特定类型的节点进行转换
// let ArrowFunctionsPlugin = require("babel-plugin-transform-es2015-arrow-functions") 

// 自己定义一个 ArrowFunctionsPlugin：
// 插件是一个对象，对象里面会有一个visitor的访问器

let ArrowFunctionsPlugin = {
  visitor:{
    // 处理所有的箭头函数节点
    // nodePath 是节点路径
    ArrowFunctionExpression(nodePath) {

    }
  }
}


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
  plugins:[ArrowFunctionsPlugin]
})

console.log(targetCode.code)

/**
  var _this = this;
  const sum = function (a, b) {
    console.log(_this);
    return a + b;
  };
 * 
*/