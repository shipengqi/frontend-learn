/* @flow */

import config from '../config'
import { initUse } from './use'
import { initMixin } from './mixin'
import { initExtend } from './extend'
import { initAssetRegisters } from './assets'
import { set, del } from '../observer/index'
import { ASSET_TYPES } from 'shared/constants'
import builtInComponents from '../components/index'

import {
  warn,
  extend,
  nextTick,
  mergeOptions,
  defineReactive
} from '../util/index'

// 全局API 以静态属性和方法的形式添加到 Vue 构造函数上
export function initGlobalAPI (Vue: GlobalAPI) {
  // config
  const configDef = {}
  // Vue.config 代理的是从 core/config.js 导出的对象
  configDef.get = () => config
  if (process.env.NODE_ENV !== 'production') {
    configDef.set = () => {
      warn(
        'Do not replace the Vue.config object, set individual fields instead.'
      )
    }
  }
  // 在 Vue 构造函数上添加 config 属性
  Object.defineProperty(Vue, 'config', configDef)

  // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  // 尽量不要使用
  Vue.util = {
    warn,
    extend,
    mergeOptions,
    defineReactive
  }

  // 在 Vue 上添加了四个属性分别是 set、delete、nextTick 以及 options
  Vue.set = set
  Vue.delete = del
  Vue.nextTick = nextTick

  Vue.options = Object.create(null)
  ASSET_TYPES.forEach(type => {
    Vue.options[type + 's'] = Object.create(null)
  })
  // Vue.options 会变成下面这样
  // Vue.options = {
  //   components: Object.create(null),
  //   directives: Object.create(null),
  //   filters: Object.create(null),
  //   _base: Vue
  // }

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue

  extend(Vue.options.components, builtInComponents)
  // builtInComponents 值到处了一个包含`KeepAlive`的对象
  // Vue.options  会变成下面这样
  // Vue.options = {
  //   components: {
  //     KeepAlive
  //   },
  //   directives: Object.create(null),
  //   filters: Object.create(null),
  //   _base: Vue
  // }

  // 添加全局API use mixin extend 和 ASSET_TYPES 数组属对应的静态方法
  initUse(Vue)
  initMixin(Vue)
  initExtend(Vue)
  initAssetRegisters(Vue)
}
