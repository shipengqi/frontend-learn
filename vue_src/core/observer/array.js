/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

import {
  def
} from '../util/index'

const arrayProto = Array.prototype

// arrayMethods.__proto__ === Array.prototype
export const arrayMethods = Object.create(arrayProto)

// 要拦截的数组变异方法
const methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]

/**
 * Intercept mutating methods and emit events
 */
methodsToPatch.forEach(function(method) {
  // cache original method
  const original = arrayProto[method]

  // def 函数在 arrayMethods 上定义与数组变异方法同名的函数
  def(arrayMethods, method, function mutator(...args) {
    const result = original.apply(this, args)
    const ob = this.__ob__
    let inserted
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
    }
    if (inserted) ob.observeArray(inserted)

    // notify change
    ob.dep.notify()
    return result
  })
})
