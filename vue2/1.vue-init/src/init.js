import { compileToFunction } from "./compiler/index"
import { mountComponent } from "./lifecycle"
import { initState } from "./state"
export function initMixin(Vue) {
  // 表示在vue的基础上做一次混合操作
  Vue.prototype._init = function (options) {
    // el,data
    const vm = this // var that = this;

    vm.$options = options // 后面会对options进行扩展操作

    // 对数据进行初始化 watch computed props data ...
    initState(vm) // vm.$options.data  数据劫持

    if (vm.$options.el) {
      // 将数据挂载到这个模板上
      vm.$mount(vm.$options.el)
    }
  }
  Vue.prototype.$mount = function (el) {
    const vm = this
    const options = vm.$options
    el = document.querySelector(el)
    vm.$el = el
    // 把模板转化成 对应的渲染函数 =》 虚拟dom概念 vnode =》 diff算法 更新虚拟dom =》 产生真实节点，更新
    if (!options.render) {
      // 没有render用template，目前没render
      let template = options.template
      if (!template && el) {
        // 用户也没有传递template 就取el的内容作为模板
        template = el.outerHTML
        let render = compileToFunction(template)
        options.render = render
      }
    }
    // options.render 就是渲染函数
    // 调用render方法 渲染成真实dom 替换掉页面的内容
    // 根据render 方法产生虚拟节点，再将虚拟节点变成真实节点 插入页面中 组件的挂载流程
    mountComponent(vm, el)
  }
}
