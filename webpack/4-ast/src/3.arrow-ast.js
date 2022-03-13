// 我们尝试手写一般babel插件
let babelCore = require("@babel/core")
// 这是babel的工具包，判断某个节点是不是某个类型，动态创建某个类型的节点
let types = require("babel-types")

function getScopeInfo(path) {
  let thisPaths = []
  // 遍历当前路径的子路径，从当前路径向下查找
  // 如果遇到 this应用的节点 把它添加进数组中
  path.traverse({
    ThisExpression(path) {
      thisPaths.push(path)
    },
  })

  return thisPaths
}

function hoistFunctionEnvironment(path) {
  // 当前的路径向上找 查找this定义的位置
  const thisEnv = path.findParent((parent) => {
    return (
      // 作用域：函数作用域 全局作用域 并且不是箭头函数
      (parent.isFunction() && !path.ArrowFunctionExpression()) ||
      parent.isProgram()
    )
  })

  // 寻找到代码块中所有包含this的地方
  let thisPaths = getScopeInfo(path)

  // 节点里面有this指针
  if (thisPaths.length > 0) {
    // console.log(thisEnv)
    let thisBindings = "_this"

    // 在节点的作用域中添加一个变量
    thisEnv.scope.push({
      id: types.identifier(thisBindings), // 生成一个标识符 _this
      init: types.thisExpression(), // 生成一个this调用 this
    })
    // 替换 this 为 _this
    thisPaths.forEach((thisPath) => {
      thisPath.replaceWith(types.identifier(thisBindings))
    })
  }
}

// 自己定义一个 ArrowFunctionsPlugin：插件是一个钩子函数，返回一个对象，对象中拥有一个 visitor 属性，也是一个对象
let ArrowFunctionsPlugin = function () {
  return {
    visitor: {
      // 处理所有的箭头函数节点
      // nodePath 是节点路径
      ArrowFunctionExpression(path) {
        let node = path.node
        // 处理this的指向问题
        hoistFunctionEnvironment(path)
        // 将node的类型修改成 函数声明的形式
        node.type = "FunctionExpression"
      },
    },
  }
}

// 源代码是一个箭头函数
let sourceCode = `
  const sum = (a,b) => {
    console.log(this)
    return a + b
  }
`

// 调用 babel的转化能力
let targetCode = babelCore.transform(sourceCode, {
  // 使用的是箭头函数转换插件
  plugins: [ArrowFunctionsPlugin],
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
