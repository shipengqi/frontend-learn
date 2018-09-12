/* @flow */

import config from '../config'
import {
  initProxy
} from './proxy'
import {
  initState
} from './state'
import {
  initRender
} from './render'
import {
  initEvents
} from './events'
import {
  mark,
  measure
} from '../util/perf'
import {
  initLifecycle,
  callHook
} from './lifecycle'
import {
  initProvide,
  initInjections
} from './inject'
import {
  extend,
  mergeOptions,
  formatComponentName
} from '../util/index'

let uid = 0

/*initMixin，在Vue的原型上增加 _init 方法， 用来初始化 Vue 实例*/
export function initMixin(Vue: Class < Component > ) {
  Vue.prototype._init = function(options ? : Object) {
    const vm: Component = this
      // a uid
    vm._uid = uid++

      // 在非生产环境下，config.performance 和 mark 都为真，执行下面的代码，
      // config.performance 来自于 core/config.js 文件，Vue.config 同样引用了这个对象
      // Vue.config.performance 设置为 true，可开启性能追踪，追踪下面四个场景：
      // 1、组件初始化(component init)
      // 2、编译(compile)，将模板(template)编译成渲染函数
      // 3、渲染(render)，其实就是渲染函数的性能，或者说渲染函数执行且生成虚拟DOM(vnode)的性能
      // 4、打补丁(patch)，将虚拟DOM渲染为真实DOM的性能
      // 实现的方式就是在初始化的代码的开头和结尾分别使用 mark 函数打上两个标记，然后通过 measure 函数对这两个标记点进行性能计算。
      let startTag, endTag
        /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      startTag = `vue-perf-start:${vm._uid}`
      endTag = `vue-perf-end:${vm._uid}`
      mark(startTag)
    }

    // _isVue 设置为 true。用来标识对象是一个 Vue 实例，避免该对象被响应系统观测
    // a flag to avoid this being observed
    vm._isVue = true
      // _isComponent 是一个内部选项，在 Vue 创建组件的时候才会有
      // merge options
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options)
    } else {
      // 在 Vue 实例上添加 $options 属性，这个属性用于当前 Vue 的初始化
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor), // What? 进入 core/instance/init.js 这个函数最后返回的是 Vue.options
        options || {}, //调用 new Vue() 实例时，传入的对象
        vm // 当前Vue实例
      )
    }
    /* istanbul ignore else */
    if (process.env.NODE_ENV !== 'production') {
      initProxy(vm)
    } else {
      vm._renderProxy = vm
    }

    // 这一系列 init* 方法，都使用到了上面在实例上添加的 $options 属性
    // expose real self
    vm._self = vm
    initLifecycle(vm)
    initEvents(vm)
    initRender(vm)
    callHook(vm, 'beforeCreate')
    initInjections(vm) // resolve injections before data/props
    initState(vm)
    initProvide(vm) // resolve provide after data/props
    callHook(vm, 'created')

    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      vm._name = formatComponentName(vm, false)
      mark(endTag)
      measure(`vue ${vm._name} init`, startTag, endTag)
    }

    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  }
}

export function initInternalComponent(vm: Component, options: InternalComponentOptions) {
  const opts = vm.$options = Object.create(vm.constructor.options)
    // doing this because it's faster than dynamic enumeration.
  const parentVnode = options._parentVnode
  opts.parent = options.parent
  opts._parentVnode = parentVnode

  const vnodeComponentOptions = parentVnode.componentOptions
  opts.propsData = vnodeComponentOptions.propsData
  opts._parentListeners = vnodeComponentOptions.listeners
  opts._renderChildren = vnodeComponentOptions.children
  opts._componentTag = vnodeComponentOptions.tag

  if (options.render) {
    opts.render = options.render
    opts.staticRenderFns = options.staticRenderFns
  }
}

// 作用是解析构造者的 options
export function resolveConstructorOptions(Ctor: Class < Component > ) {
  // Ctor 就是 vm.constructor
  let options = Ctor.options
  if (Ctor.super) { // super 属性与 Vue.extend 有关
    const superOptions = resolveConstructorOptions(Ctor.super)
    const cachedSuperOptions = Ctor.superOptions
    if (superOptions !== cachedSuperOptions) {
      // super option changed,
      // need to resolve new options.
      Ctor.superOptions = superOptions
        // check if there are any late-modified/attached options (#4976)
      const modifiedOptions = resolveModifiedOptions(Ctor)
        // update base extend options
      if (modifiedOptions) {
        extend(Ctor.extendOptions, modifiedOptions)
      }
      options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions)
      if (options.name) {
        options.components[options.name] = Ctor
      }
    }
  }
  return options
}

function resolveModifiedOptions(Ctor: Class < Component > ): ? Object {
  let modified
  const latest = Ctor.options
  const extended = Ctor.extendOptions
  const sealed = Ctor.sealedOptions
  for (const key in latest) {
    if (latest[key] !== sealed[key]) {
      if (!modified) modified = {}
      modified[key] = dedupe(latest[key], extended[key], sealed[key])
    }
  }
  return modified
}

function dedupe(latest, extended, sealed) {
  // compare latest and sealed to ensure lifecycle hooks won't be duplicated
  // between merges
  if (Array.isArray(latest)) {
    const res = []
    sealed = Array.isArray(sealed) ? sealed : [sealed]
    extended = Array.isArray(extended) ? extended : [extended]
    for (let i = 0; i < latest.length; i++) {
      // push original options and not sealed options to exclude duplicated options
      if (extended.indexOf(latest[i]) >= 0 || sealed.indexOf(latest[i]) < 0) {
        res.push(latest[i])
      }
    }
    return res
  } else {
    return latest
  }
}
