/* @flow */

import Dep from './dep'
import VNode from '../vdom/vnode'
import {
  arrayMethods
} from './array'
import {
  def,
  warn,
  hasOwn,
  hasProto,
  isObject,
  isPlainObject,
  isPrimitive,
  isUndef,
  isValidArrayIndex,
  isServerRendering
} from '../util/index'

const arrayKeys = Object.getOwnPropertyNames(arrayMethods)

/**
 * In some cases we may want to disable observation inside a component's
 * update computation.
 */
export let shouldObserve: boolean = true

export function toggleObserving(value: boolean) {
  shouldObserve = value
}

/**
 * Observer class that is attached to each observed
 * object. Once attached, the observer converts the target
 * object's property keys into getter/setters that
 * collect dependencies and dispatch updates.
 */
export class Observer {
  value: any;
  dep: Dep;
  vmCount: number; // number of vms that has this object as root $data

  constructor(value: any) {
    this.value = value // 观测的数据对象
    this.dep = new Dep()
    this.vmCount = 0

    // 微数据对象添加了一个 __ob__ 属性（不可枚举），前面有提到，判断是否有这个属性，来避免重复观测数据
    def(value, '__ob__', this)
    if (Array.isArray(value)) { // 处理数组，我们知道 数组的变异方法，是可以被观测到的
      const augment = hasProto ? // 检测当前环境是否可以使用 __proto__ 属性
        protoAugment :
        copyAugment
      augment(value, arrayMethods, arrayKeys)
      this.observeArray(value)
    } else {
      this.walk(value) // 处理纯对象
    }
  }

  /**
   * Walk through each property and convert them into
   * getter/setters. This method should only be called when
   * value type is Object.
   */
  // 遍历对象 为每个属性调用了 defineReactive
  walk(obj: Object) {
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i])
    }
  }

  /**
   * Observe a list of Array items.
   */
  observeArray(items: Array < any > ) {
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i])
    }
  }
}

// helpers

/**
 * Augment an target Object or Array by intercepting
 * the prototype chain using __proto__
 */
function protoAugment(target, src: Object, keys: any) {
  /* eslint-disable no-proto */
  target.__proto__ = src
    /* eslint-enable no-proto */
}

/**
 * Augment an target Object or Array by defining
 * hidden properties.
 */
/* istanbul ignore next */
// 不支持 __proto__ 属性的时候如何做兼容处理
function copyAugment(target: Object, src: Object, keys: Array < string > ) {
  for (let i = 0, l = keys.length; i < l; i++) {
    const key = keys[i]
    def(target, key, src[key])
  }
}

/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
// 第一个参数是要观测的数据，第二个参数是一个布尔值，代表将要被观测的数据是否是根级数据。
export function observe(value: any, asRootData: ? boolean): Observer | void {
  if (!isObject(value) || value instanceof VNode) {
    return
  }
  let ob: Observer | void

  // 当一个数据对象被观测之后将会在该对象上定义 __ob__ 属性，所以 if 分支的作用是用来避免重复观测一个数据对象。
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__
  } else if (
    shouldObserve && // 一个打开数据观测的开关
    !isServerRendering() && // 断是否是服务端渲染
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) && // 数据对象必须是可扩展的
    !value._isVue // Vue 实例对象拥有 _isVue 属性，这个条件用来避免 Vue 实例对象被观测
  ) {
    ob = new Observer(value)
  }
  if (asRootData && ob) {
    ob.vmCount++
  }
  return ob
}

/**
 * Define a reactive property on an Object.
 */
// 将数据对象的数据属性转换为访问器属性
export function defineReactive(
  obj: Object,
  key: string,
  val: any,
  customSetter ? : ? Function,
  shallow ? : boolean
) {
  const dep = new Dep() // 用来收集依赖，每个数据对象的属性都有自己的 Dep 对象，来收集依赖


  // Object.getOwnPropertyDescriptor 函数获取字段可能已有的属性描述对象
  const property = Object.getOwnPropertyDescriptor(obj, key)
  if (property && property.configurable === false) { // 如果属性不可配置，直接返回
    return
  }

  // cater for pre-defined getter/setters
  // 如果属性已经存在 get 或 set 方法，防止原有的 set 和 get 方法被覆盖，先缓存 set 和 get，下面会用到
  const getter = property && property.get
  const setter = property && property.set

  // 如果只有两个参数，也就是只有参数 obj 和 key
  // 当属性存在 getter 时，是不会触发取值动作的，即 val = obj[key] 不会执行，所以 val 是 undefined，不进行深度观测
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key]
  }

  // 这里的 observe(val) val 只有在 if ((!getter || setter) && arguments.length === 2) 的情况下才有值
  let childOb = !shallow && observe(val) // 如果 shallow 不为真，调用 observe(val) 深度观测对象，默认情况下就没有传入 shallow
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      const value = getter ? getter.call(obj) : val // 返回正确的值
      if (Dep.target) { // 每一个数据字段都通过闭包引用着属于自己的 dep 常量，Dep.target 就是要被收集的依赖(观察者)
        dep.depend() // 收集依赖的方法
        if (childOb) { // childOb === data.key.__ob__

          // 这里有收集了一次依赖，因为上面的 dep.depend() 收集的是下面 set 中 dep.notify() 方法通知到的依赖
          // 而这里收集的是 $set 或 Vue.set 给数据对象添加新属性时触发，通知的依赖
          childOb.dep.depend()
          if (Array.isArray(value)) {
            dependArray(value)
          }
        }
      }
      return value
    },
    set: function reactiveSetter(newVal) {
      // newVal 是新的将要被设置的值
      // 先获取旧值
      const value = getter ? getter.call(obj) : val

      /* eslint-disable no-self-compare */
      // 如果旧值与新值相等，或者值是 NaN 直接返回
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if (process.env.NODE_ENV !== 'production' && customSetter) {
        customSetter()
      }

      // 设置正确的值
      if (setter) {
        setter.call(obj, newVal)
      } else {
        val = newVal
      }

      // 如设置的新值是一个数组或者纯对象，那么该数组或纯对象是未被观测的，需要对新值进行观测
      childOb = !shallow && observe(newVal)

      // 通知所有观察者值发生改变
      dep.notify()
    }
  })
}

/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 */
// Vue.set
export function set(target: Array < any > | Object, key: any, val: any): any {
  if (process.env.NODE_ENV !== 'production' &&
    (isUndef(target) || isPrimitive(target))
  ) { // isPrimitive 判断一个值是否是原始类型值
    warn(`Cannot set reactive property on undefined, null, or primitive value: ${(target: any)}`)
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key)
    target.splice(key, 1, val)
    return val
  }
  if (key in target && !(key in Object.prototype)) {
    target[key] = val
    return val
  }
  const ob = (target: any).__ob__
  if (target._isVue || (ob && ob.vmCount)) {
    process.env.NODE_ENV !== 'production' && warn(
      'Avoid adding reactive properties to a Vue instance or its root $data ' +
      'at runtime - declare it upfront in the data option.'
    )
    return val
  }
  if (!ob) {
    target[key] = val
    return val
  }
  defineReactive(ob.value, key, val)
  ob.dep.notify()
  return val
}

/**
 * Delete a property and trigger change if necessary.
 */
// Vue.delete
export function del(target: Array < any > | Object, key: any) {
  if (process.env.NODE_ENV !== 'production' &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(`Cannot delete reactive property on undefined, null, or primitive value: ${(target: any)}`)
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.splice(key, 1)
    return
  }
  const ob = (target: any).__ob__
  if (target._isVue || (ob && ob.vmCount)) {
    process.env.NODE_ENV !== 'production' && warn(
      'Avoid deleting properties on a Vue instance or its root $data ' +
      '- just set it to null.'
    )
    return
  }
  if (!hasOwn(target, key)) {
    return
  }
  delete target[key]
  if (!ob) {
    return
  }
  ob.dep.notify()
}

/**
 * Collect dependencies on array elements when the array is touched, since
 * we cannot intercept array element access like property getters.
 */
function dependArray(value: Array < any > ) {
  for (let e, i = 0, l = value.length; i < l; i++) {
    e = value[i]
    e && e.__ob__ && e.__ob__.dep.depend()
    if (Array.isArray(e)) {
      dependArray(e)
    }
  }
}
