let esprima = require("esprima") // 把JS源代码转成AST语法树
let estraverse = require("estraverse") // 遍历语法树, 修改树上的节点
let escodegen = require("escodegen") // 把AST语法树重新转换成代码

let code = `function ast(){}`
let ast = esprima.parse(code)
let indent = 0
const padding = () => " ".repeat(indent)

estraverse.traverse(ast, {
  enter(node) {
    console.log(padding() + node.type + "进入")
    if (node.type === "FunctionDeclaration") {
      node.id.name = "newAst"
    }
    indent += 2
  },
  leave(node) {
    indent -= 2
    console.log(padding() + node.type + "离开")
  },
})

const result = escodegen.generate(ast)
console.log(result)
