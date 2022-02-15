const program = require("commander")

// version方法：定义命令程序的版本号
// 参数说明：
//    版本号
//    flag（可以不填写，默认就是 -V,和 --version）
// 如果我们自己定义了 flag 参数 默认的参数就失效了 执行命令的时候 flag 参数就必须传递了。

program.usage("[options]")

program.version("1.0.0", "-V, --ver")

// options方法：定义命令的选项 
// 参数说明：
//    flag -xxx(简写) --xxx(全写) 
//    descript: 描述信息 即描述当前命令具体是做什么的
// 我们定义的这些配置项 在执行 --help 命令的时候都会出现
// option 方法支持链式调用。
program.option("-a, --add", "add something")
       .option("-u, --update", "update something")
       .option("-r, --remove", "remove something")


program.parse(process.argv)
