import { isObject } from "@vue/shared"

// WeakMap的key只能是对象
const reactiveMap = new WeakMap();

export function reactive(target) {
  // 如果传入的值不是对象，直接返回这个值
  if (!isObject(target)) {
    return target
  }

  // 这里从reactiveMap查找缓存列表 存在的话就直接返回，不走重复逻辑
  const existing = reactiveMap.get(target)
  if (existing) {
    return existing
  }

  // 创建proxy代理对象
  const proxy = new Proxy(target, {
    // 拦截对象属性的读取，比如 proxy.foo和proxy['foo']
    get(target, propKey, reactive) {
      console.log("这里可以记录这个属性使用了哪个effect")
      return Reflect.get(target, propKey, reactive)
    },
    // 拦截对象属性的设置 proxy.foo = v或proxy['foo'] = v，返回一个布尔值。
    set(target, propKey, value, reactive) {
      console.log("这里可以通知effect重新执行")
      return Reflect.set(target, propKey, value, reactive)
    },
  })

  // key：target对象  value: proxy对象
  reactiveMap.set(target,proxy)

  return proxy
}
