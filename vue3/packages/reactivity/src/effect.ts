// 借助js单线程的特性，先设置一个全局的变量
export let activeEffect = undefined

class ReactiveEffect {
  public active: boolean = true
  public fn
  public parent = null
  public deps = [] // effect中用了哪些属性 后续清理的时候需要使用
  constructor(fn) {
    this.fn = fn
  }
  run() {
    if (!this.active) {
      return this.fn()
    } else {
      // 执行这个函数的时候，就会到proxy上去取值，就会触发get方法。
      // 取值的时候，要让当前的属性和对应的effect关联起来 这就是依赖收集
      // 执行run函数的时候，将当前的这个实例赋值给这个变量, 也就放在了全局上
      try {
        this.parent = activeEffect
        activeEffect = this
        cleanEffect(this)
        return this.fn()
      } finally {
        // 因为我们的变量是放在全局上的，当我们函数执行完毕之后，还应该把这个值清空
        activeEffect = this.parent
        this.parent = null
      }
    }
  }
}

// 创建骨架
const targetMap = new WeakMap()

// 收集函数 这个函数接收两个参数，第一个参数是具体的对象
// 第二个参数是 propKey 具体到哪一个key。
// 一个属性可以对应多个effect。被多次引用
// 它的数据结构课程是这样的 { target: { name: [effect,effect], age: [effect,effect] } }
export function track(target, propKey) {
  // console.log(target, propKey, activeEffect)
  // 如果在 effect外部使用 某个属性，就不需要收集。
  if (activeEffect) {
    // 这里做依赖收集, 首先在map中查找搜索target是否存在
    let depsMap = targetMap.get(target)
    if (!depsMap) {
      // 如果不存在，就创建这样一个数据结构
      // target 本身就是一个对象
      targetMap.set(target, (depsMap = new Map()))
    }

    // 开始处理key相关
    let deps = depsMap.get(propKey)
    if (!deps) {
      // 这里把deps 设计成一个set，因为在同一个effect中
      // 可能会多次使用同一个属性，无需重复收集
      depsMap.set(propKey, (deps = new Set()))
    }
    // 没有收集这个依赖
    let shouldTrack = !deps.has(activeEffect)
    if (shouldTrack) {
      // 就把 activeEffect 放进去
      deps.add(activeEffect)
      // 双向记忆
      activeEffect.deps.push(deps)
    }
  }
}

export function trigger(target, propKey, value) {
  // 一层一层的查找
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    // 如果没有找到，说明没有依赖任何effect
    return
  }
  let effects = depsMap.get(propKey)
  // 获取到对应的 set 之后，遍历执行里面的run方法
  if (effects) {
    // 存一个副本，避免死循环
    effects = new Set(effects)
    effects.forEach((effect) => {
      // 这个代码防止的操作的是死循环的调用自己
      if (effect !== activeEffect) {
        effect.run()
      }
    })
  }
}

export function cleanEffect(effect) {
  // 每次执行之前将之前存放的set清理掉
  let deps = effect.deps // deps中存放的是所有属性的set
  for (let i = 0; i < deps.length; i++) {
    deps[i].delete(effect)
  }
  effect.deps.length = 0
}

export function effect(fn) {
  // 这个方法的作用是将用户传递进来的函数，变成一个响应式的effect
  // 这个属性就会记住effect 当属性发生变化的时候，重新执行函数。
  const _effect = new ReactiveEffect(fn)

  // 初始化的时候这个函数会先执行一次
  _effect.run()
}
