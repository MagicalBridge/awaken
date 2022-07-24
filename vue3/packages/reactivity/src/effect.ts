// import { ReactiveEffect } from "vue";

class ReactiveEffect {
  public active: boolean = true
  public fn
  constructor(fn) {
    this.fn = fn
  }
  run() {
    // 执行这个函数的时候，就会到proxy上去取值，就会触发get方法。
    // 取值的时候，要让当前的属性和对应的effect关联起来 这就是依赖收集
    this.fn()
  }
}

export function effect(fn) {
  // 这个方法的作用是将用户传递进来的函数，变成一个响应式的effect
  // 这个属性就会记住effect 当属性发生变化的时候，重新执行函数。
  const _effect = new ReactiveEffect(fn)

  // 初始化的时候这个函数会先执行一次
  _effect.run()
}
