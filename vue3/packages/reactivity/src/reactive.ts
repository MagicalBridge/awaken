import { isObject } from "@vue/shared"
import { track } from "./effect"

// WeakMap的key只能是对象
const reactiveMap = new WeakMap()

const enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive",
}

export function reactive(target) {
  // 如果传入的值不是对象，直接返回这个值
  if (!isObject(target)) {
    return target
  }

  // 这里是一个小的技巧，对于普通对象来来说, 上面肯定是不包含 __v_isReactive 这个属性的
  // 第一次操作之后返回一个proxy，下次如果把代理对象传递进来之后，只要取属性，就会进入get方法
  //
  if (target[ReactiveFlags.IS_REACTIVE]) {
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
      // proxy 在取属性的走在这里  target[ReactiveFlags.IS_REACTIVE] 为true
      // 会直接返回proxy对象，不会再代理一遍。
      if (propKey === ReactiveFlags.IS_REACTIVE) {
        return true
      }
      // console.log("这里可以记录这个属性使用了哪个effect")
      // 这里做依赖收集函数的调用
      track(target, propKey)
      return Reflect.get(target, propKey, reactive)
    },
    // 拦截对象属性的设置 proxy.foo = v或proxy['foo'] = v，返回一个布尔值。
    set(target, propKey, value, reactive) {
      console.log("这里可以通知effect重新执行")
      return Reflect.set(target, propKey, value, reactive)
    },
  })

  // key：target对象  value: proxy对象
  reactiveMap.set(target, proxy)

  return proxy
}
