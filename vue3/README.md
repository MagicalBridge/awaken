## 包管理工具
Vue3中使用pnpm workspace来实现monorepo (pnpm是快速、节省磁盘空间的包管理器。主要采用符号链接的方式管理模块)

## 全局安装pnpm

```bash
npm install pnpm -g # 全局安装pnpm
```
```bash
pnpm init -y # 初始化配置文件
```

## 创建.npmrc文件并做配置

```
shamefully-hoist = true
```
默认情况下，pnpm并不会把安装的依赖拍平，配置了上面属性之后，会按照npm那种代码组织方式，将安装的依赖拍平。

## 配置workspace
pnpm-workspace.yaml 文件中配置了文件夹的规则。

```yml
packages:
  - 'packages/*'
```
>将packages下所有的目录都作为包进行管理。这样我们的Monorepo就搭建好了。确实比lerna + yarn workspace更快捷

## 环境搭建
开发环境，安装esbuild、typescript、minimist就可以了

## 初始化TS
```
pnpm tsc --init
```

## 创建模块
>我们现在packages目录下新建两个package，用于下一章手写响应式原理做准备
- reactivity 响应式模块
- shared 共享模块

所有包的入口均为 `src/index.ts` 这样可以实现统一打包。

- reactivity/package.json
```json
{
  "name": "@vue/reactivity",
  "version": "1.0.0",
  "main": "index.js",
  "module":"dist/reactivity.esm-bundler.js",
  "unpkg": "dist/reactivity.global.js",
  "buildOptions": {
    "name": "VueReactivity",
    "formats": [
      "esm-bundler",
      "cjs",
      "global"
    ]
  }
}
```
- shared/package.json
```json
{
  "name": "@vue/shared",
  "version": "1.0.0",
  "main": "index.js",
  "module": "dist/shared.esm-bundler.js",
  "buildOptions": {
    "formats": [
      "esm-bundler",
      "cjs"
    ]
  }
}
```
> formats为自定义的打包格式，有esm-bundler在构建工具中使用的格式、esm-browser在浏览器中使用的格式、cjs在node中使用的格式、global立即执行函数的格式



