import { initMixin } from "./init"
/**
 * 这里是一个函数声明，只有在new的时候才会调用，接收一个 options 作为参数，
 * options 是一个对象，这个options就是用户传递进来的配置选项
 * 这个配置选项中包含 data el watch computed methods。。。
 * 在使用vue-cli脚手架进行开发的时候都是单组件文件。每个组件本质上都是一个实例
 */
function Vue(options) {
  // options 为用户传入的选项
  this._init(options) // 初始化操作
}

// 只要加载了index.js 这个文件下面的函数都会执行
// 并且是首先执行的，那么所有在mixin上挂载的所有原型
// 方法都会预先定义执行，init 是在new 的时候执行的
initMixin(Vue)

// 将vue导出
export default Vue
