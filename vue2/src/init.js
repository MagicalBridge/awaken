import { complileToFunction } from "./compiler/index.js"
import { callHook, mountComponent } from "./lifecycle.js"
import { initState } from "./state"
import { mergeOptions } from "./utils.js"

/**
 * 将构造函数作为参数传递进去，对构造函数进行扩展，
 * 这里使用了在构造函数的原型上进行扩展的方式，所有的组件实例均可以共享
 * 表示在vue的基础上做一次混合操作
 * 这种设计思想也是非常值得借鉴的。
 * @param {*} Vue
 */
export function initMixin(Vue) {
  // 扩展原型上的方法
  Vue.prototype._init = function (options) {
    // 原型方法中的this指向实例 所有的实例都具有这些方法，
    // 这里用vm表示this的引用比较方便识别。假设在这个函数中
    // 直接有一个函数声明，函数声明中的this就不好说是谁了。
    // 但是可以在函数中使用vm,这个就特别类似于 var that = this 那种写法
    const vm = this
    // 用户传递进来的options属性挂载到vm上面, 这时我们能够操作vm.$options
    // 如果用户写了全局的mixin，这个时候需要将全局的mixin 和当前用户传递进来的options合并
    vm.$options = mergeOptions(vm.constructor.options,options)
    
    // console.log(vm.$options)
    
    // 数据还没有创建的时候 调用
    callHook(vm,'beforeCreate')
    // 初始化状态 模板渲染的数据需要这个函数  不仅仅是有watch 还有computed props data 我们需要有一个统一的函数
    // 来处理这些参数。用户也是将不同的状态放在不同的对象下面进行维护
    initState(vm)
    // 数据已经初始化完毕
    callHook(vm,'created')

    // 数据初始化就这样结束了吗？ 当然没有 我们还需要将数据挂载到模板上面
    if (vm.$options.el) {
      // 将数据挂载到模板上
      vm.$mount(vm.$options.el)
    }
  }
  /**
   * 这个就是那个渲染的方法
   * 我们说，如果每次数据变化，就全部将模板替换，这种方式是很低效的
   * 因为vue2 中将模板转换成渲染函数，函数的执行效率要高很多。
   * 并且引入了虚拟dom的概念，每次数据变化，生成虚拟节点。而不是真正的操作dom
   * @param {*} el
   */
  Vue.prototype.$mount = function (el) {
    const vm = this
    const options = vm.$options
    el = document.querySelector(el)
    vm.$el = el
    // 这里解释下为什么要做这个判断，因为会有情况是用户手动写render方法
    // 这种情况下用户手写的render优先级要更高一些。这个函数的终极目标是帮助我们创建出虚拟节点
    // 这部分信息量比较大，我们可以在options的选项中添加 template 字段
    // 如果没写，才使用 html中写的dom节点，这点应该尤其注意
    if (!options.render) {
      let template = options.template
      if (!template) {
        template = el.outerHTML
        // 下面这一行打印的是字符串
        // console.log(template) <div id="app">{{name}}</div>
        // 这个函数是一个核心的函数，将我们传递进去的模板编译成 render函数
        let render = complileToFunction(template)
        options.render = render
      }
    }
    // 调用render方法 渲染成真实的dom替换掉页面的内容
    // 这个方法是定义在生命周期这个包中的
    mountComponent(vm, el)
  }
}
