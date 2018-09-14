/* @flow */

import {
  warn,
  remove,
  isObject,
  parsePath,
  _Set as Set,
  handleError
} from '../util/index'

import {
  traverse
} from './traverse'
import {
  queueWatcher
} from './scheduler'
import Dep, {
  pushTarget,
  popTarget
} from './dep'

import type {
  SimpleSet
} from '../util/index'

let uid = 0

/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 */
export default class Watcher {
  vm: Component;
  expression: string;
  cb: Function;
  id: number;
  deep: boolean;
  user: boolean;
  computed: boolean;
  sync: boolean;
  dirty: boolean;
  active: boolean;
  dep: Dep;
  deps: Array < Dep > ;
  newDeps: Array < Dep > ;
  depIds: SimpleSet;
  newDepIds: SimpleSet;
  before: ? Function;
  getter: Function;
  value: any;

  constructor(
    vm: Component,
    expOrFn: string | Function,
    cb: Function,
    options ? : ? Object,
    isRenderWatcher ? : boolean // 标识该观察者实例是否是渲染函数的观察者
  ) {
    this.vm = vm // 指明了这个观察者是属于哪一个组件的
    if (isRenderWatcher) { // isRenderWatcher 只有在 mountComponent 函数中创建渲染函数观察者时为真
      vm._watcher = this
    }
    vm._watchers.push(this)
      // options
    if (options) {
      this.deep = !!options.deep // 当前观察者实例对象是否是深度观测
      this.user = !!options.user //当前观察者实例对象是 开发者定义的 还是 内部定义的
      this.computed = !!options.computed // 当前观察者实例对象是否是计算属性的观察者
      this.sync = !!options.sync // 观察者当数据变化时是否同步求值并执行回调
      this.before = options.before // Watcher 实例的钩子，触发更新之前调用
    } else {
      // 全部初始化为 false
      this.deep = this.user = this.computed = this.sync = false
    }
    this.cb = cb
    this.id = ++uid // uid for batching
    this.active = true // 观察者实例对象是否是激活状态
    this.dirty = this.computed // for computed watchers

    // 这四个属性，用来实现避免收集重复依赖，移除无用依赖
    this.deps = []
    this.newDeps = []
    this.depIds = new Set()
    this.newDepIds = new Set()

    this.expression = process.env.NODE_ENV !== 'production' ?
      expOrFn.toString() :
      ''
      // parse expression for getter
    if (typeof expOrFn === 'function') {
      this.getter = expOrFn
    } else {
      this.getter = parsePath(expOrFn)
      if (!this.getter) {
        this.getter = function() {}
        process.env.NODE_ENV !== 'production' && warn(
          `Failed watching path: "${expOrFn}" ` +
          'Watcher only accepts simple dot-delimited paths. ' +
          'For full control, use a function instead.',
          vm
        )
      }
    }
    if (this.computed) {
      this.value = undefined
      this.dep = new Dep()
    } else {
      this.value = this.get() // this.value 属性保存着被观察目标的值
    }
  }

  /**
   * Evaluate the getter, and re-collect dependencies.
   */
  get() {
    pushTarget(this) // Dep.target = this
    let value
    const vm = this.vm
    try {
      value = this.getter.call(vm, vm)
    } catch (e) {
      if (this.user) {
        handleError(e, vm, `getter for watcher "${this.expression}"`)
      } else {
        throw e
      }
    } finally {
      // "touch" every property so they are all tracked as
      // dependencies for deep watching
      if (this.deep) {
        traverse(value)
      }
      popTarget()
      this.cleanupDeps()
    }
    return value
  }

  /**
   * Add a dependency to this directive.
   */
  addDep(dep: Dep) {
    const id = dep.id
    if (!this.newDepIds.has(id)) { // 判断 dep.id 是否已经存在，同一个观察者它只会收集一次
      this.newDepIds.add(id)
      this.newDeps.push(dep)
      if (!this.depIds.has(id)) { // newDepIds 属性用来避免在 一次求值的过程中收集重复的依赖，depIds 属性是用来在 多次求值 中避免收集重复依赖
        // 每一次求值之后 newDepIds 属性都会被清空
        dep.addSub(this) // 将的观察者添加到 Dep 实例对象的 subs 数组中，真正用来收集观察者的方法
      }
    }
  }

  /**
   * Clean up for dependency collection.
   */
  cleanupDeps() {
    let i = this.deps.length
      // 移除废弃的观察者
    while (i--) {
      const dep = this.deps[i]
      if (!this.newDepIds.has(dep.id)) {
        dep.removeSub(this)
      }
    }
    let tmp = this.depIds
    this.depIds = this.newDepIds
    this.newDepIds = tmp
    this.newDepIds.clear()
    tmp = this.deps
    this.deps = this.newDeps
    this.newDeps = tmp
    this.newDeps.length = 0
  }

  /**
   * Subscriber interface.
   * Will be called when a dependency changes.
   */
  update() {
    /* istanbul ignore else */
    if (this.computed) {
      // A computed property watcher has two modes: lazy and activated.
      // It initializes as lazy by default, and only becomes activated when
      // it is depended on by at least one subscriber, which is typically
      // another computed property or a component's render function.
      if (this.dep.subs.length === 0) {
        // In lazy mode, we don't want to perform computations until necessary,
        // so we simply mark the watcher as dirty. The actual computation is
        // performed just-in-time in this.evaluate() when the computed property
        // is accessed.
        this.dirty = true
      } else {
        // In activated mode, we want to proactively perform the computation
        // but only notify our subscribers when the value has indeed changed.
        this.getAndInvoke(() => {
          this.dep.notify()
        })
      }
    } else if (this.sync) { // 同步更新
      this.run()
    } else {
      queueWatcher(this) // 将当前观察者放入更新队列
    }
  }

  /**
   * Scheduler job interface.
   * Will be called by the scheduler.
   */
  run() {
    if (this.active) {
      this.getAndInvoke(this.cb)
    }
  }

  getAndInvoke(cb: Function) {
    const value = this.get() // 重新求值
    if (
      value !== this.value ||
      // Deep watchers and watchers on Object/Arrays should fire even
      // when the value is the same, because the value may
      // have mutated.
      isObject(value) || // 新值 value 和旧值 this.value相等的情况下，如果是对象，也要执行
      this.deep
    ) {
      // set new value
      const oldValue = this.value
      this.value = value
      this.dirty = false // 代表已经求过值了
      if (this.user) { // 开发者定义 那些通过 watch 选项或 $watch 函数定义的观察者 可能出现错误
        try {
          cb.call(this.vm, value, oldValue)
        } catch (e) {
          handleError(e, this.vm, `callback for watcher "${this.expression}"`)
        }
      } else {
        cb.call(this.vm, value, oldValue)
      }
    }
  }

  /**
   * Evaluate and return the value of the watcher.
   * This only gets called for computed property watchers.
   */
  evaluate() {
    if (this.dirty) {
      this.value = this.get()
      this.dirty = false
    }
    return this.value
  }

  /**
   * Depend on this watcher. Only for computed property watchers.
   */
  depend() {
    if (this.dep && Dep.target) {
      this.dep.depend()
    }
  }

  /**
   * Remove self from all dependencies' subscriber list.
   */
  teardown() {
    if (this.active) {
      // remove self from vm's watcher list
      // this is a somewhat expensive operation so we skip it
      // if the vm is being destroyed.
      if (!this.vm._isBeingDestroyed) { // 每个组件实例都有一个 vm._isBeingDestroyed 属性，标识该组件实例是否被销毁，为真则已经销毁
        remove(this.vm._watchers, this)
      }
      let i = this.deps.length
      while (i--) {
        this.deps[i].removeSub(this)
      }
      this.active = false
    }
  }
}
