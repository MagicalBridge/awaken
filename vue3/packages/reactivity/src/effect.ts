// 借助js单线程的特性，先设置一个全局的变量
export let avtiveEffect = undefined

class ReactiveEffect {
  public active: boolean = true
  public fn
  public parent = null
  constructor(fn) {
    this.fn = fn
  }
  run() {
    // 执行这个函数的时候，就会到proxy上去取值，就会触发get方法。
    // 取值的时候，要让当前的属性和对应的effect关联起来 这就是依赖收集
    // 执行run函数的时候，将当前的这个实例赋值给这个变量, 也就放在了全局上
    try {
      this.parent = avtiveEffect
      avtiveEffect = this
      this.fn()
    } finally {
      // 因为我们的变量是放在全局上的，当我们函数执行完毕之后，还应该把这个值清空
      avtiveEffect = this.parent
      this.parent = null
    }
  }
}

// 收集函数
export function track(target, propKey) {
  console.log(target, propKey, avtiveEffect)
}

export function effect(fn) {
  // 这个方法的作用是将用户传递进来的函数，变成一个响应式的effect
  // 这个属性就会记住effect 当属性发生变化的时候，重新执行函数。
  const _effect = new ReactiveEffect(fn)

  // 初始化的时候这个函数会先执行一次
  _effect.run()
}
