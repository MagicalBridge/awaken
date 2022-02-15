## 关于这个包入口文件的配置

姜文老师在课程中配置的入口文件是`bin`, 我搜索了 bin 字段的含义。
[bin字段的作用](https://javascript.ruanyifeng.com/nodejs/packagejson.html#toc4)。文中介绍到，bin项用来指定各个内部命令对应的可执行文件的位置。

```json
"bin": {
  "someTool": "./bin/someTool.js"
}
```

上面代码指定，someTool 命令对应的可执行文件为 bin 子目录下的 someTool.js，Npm会寻找这个文件，在`node_modules/.bin/`目录下建立符号链接, 在上面的例子中，someTool.js会建立符号链接 `node_modules/.bin/someTool`,由于`node_modules/.bin/`目录会在运行时加入系统的`PATH`变量，因此在运行npm时，就可以不带路径，直接通过命令来调用这些脚本。


## 关于这个包入口文件的开头声明

如何快速记忆呢？ #! /usr/bin/env node **有病的环境 node**


## 代码中使用的Object.entries(obj) 这个方法：
[参考链接](https://segmentfault.com/a/1190000011616239)

返回的是对象中自身可枚举属性的键值对数组, 其排列与使用 for...in 循环遍历该对象时返回的顺序一致（区别在于 for-in 循环也枚举原型链中的属性）。

```js
const obj = { foo: 'bar', baz: 42 };
console.log(Object.entries(obj)); // [ ['foo', 'bar'], ['baz', 42] ]
```

## command的这个包的使用方法：
[参考资料](https://juejin.cn/post/6844903797907521544)



