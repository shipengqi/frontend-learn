/* @flow */

import config from '../config'
import {
  warn
} from './debug'
import {
  nativeWatch
} from './env'
import {set
} from '../observer/index'

import {
  ASSET_TYPES,
  LIFECYCLE_HOOKS
} from 'shared/constants'

import {
  extend,
  hasOwn,
  camelize,
  toRawType,
  capitalize,
  isBuiltInTag,
  isPlainObject
} from 'shared/util'

/**
 * Option overwriting strategies are functions that handle
 * how to merge a parent option value and a child option
 * value into the final value.
 */
// 这时的 strats 合并策略还是一个空对象
const strats = config.optionMergeStrategies

/**
 * Options with restrictions
 */
// 添加 el、propsData 的合并策略
// 这两个策略先判断了是否有 vm 参数，没有就打印警告，提示el、propsData只能使用 new 创建实例时使用
// 比如在子组件中使用了 el 选项，就会得到警告
// 也就是说，没有 vm 参数时，就是子组件
if (process.env.NODE_ENV !== 'production') {
  strats.el = strats.propsData = function(parent, child, vm, key) {
    // 的为什么通过 vm 来判断是否是子组件
    // 在 mergeField 函数中，查看 vm 的来源
    if (!vm) {
      warn(
        `option "${key}" can only be used during instance ` +
        'creation with the `new` keyword.'
      )
    }
    // el、propsData 的合并策略函数本质上还是 defaultStrat，只不过多了一个子组件的判断
    return defaultStrat(parent, child)
  }
}

/**
 * Helper that recursively merges two data objects together.
 */
function mergeData(to: Object, from: ? Object): Object {
  if (!from) return to
  let key, toVal, fromVal
  const keys = Object.keys(from)
  for (let i = 0; i < keys.length; i++) {
    key = keys[i]
    toVal = to[key]
    fromVal = from[key]
    if (!hasOwn(to, key)) {
      // 如果 from 对象中的 key 不在 to 对象中，则使用 set 函数为 to 对象设置 key 及相应的值
      // 这个 set 函数就是全局API Vue.set
      set(to, key, fromVal)
    } else if (isPlainObject(toVal) && isPlainObject(fromVal)) {
      // 如果 from 对象中的 key 也在 to 对象中，且这两个属性的值都是纯对象则递归进行深度合并
      mergeData(toVal, fromVal)
    }
  }
  return to
}

/**
 * Data
 */
// 合并 data 选项，或者子组件的 data 函数选项
// mergeDataOrFn 函数的返回值，根据下面的代码，能看出来，返回值有四种情况：
// 1. Vue.extend 中，父类的 data 选项，一个函数
// 2. Vue.extend 中，子类的 data 选项，一个函数
// 3. mergedDataFn 函数
// 4. mergedInstanceDataFn 函数
export function mergeDataOrFn(
  parentVal: any,
  childVal: any,
  vm ? : Component
): ? Function {
  if (!vm) { // Vue.extend 中，也就是 data 函数
    // in a Vue.extend merge, both should be functions
    if (!childVal) {
      return parentVal
    }
    if (!parentVal) {
      return childVal
    }
    // when parentVal & childVal are both present,
    // we need to return a function that returns the
    // merged result of both functions... no need to
    // check if parentVal is a function here because
    // it has to be a function to pass previous merges.
    return function mergedDataFn() {
      return mergeData(
        // childVal 要么是子组件的选项（函数），要么是使用 new 操作符创建实例时的选项
        // 如果是函数的话就通过执行该函数从而获取到一个纯对象
        // 子组件的 data 选项函数可以接受参数，参数就是 .call(this, this) 的第二个 this
        typeof childVal === 'function' ? childVal.call(this, this) : childVal,
        typeof parentVal === 'function' ? parentVal.call(this, this) : parentVal
      )
    }
  } else {
    return function mergedInstanceDataFn() {
      // instance merge
      const instanceData = typeof childVal === 'function' ?
        childVal.call(vm, vm) :
        childVal
      const defaultData = typeof parentVal === 'function' ?
        parentVal.call(vm, vm) :
        parentVal
      if (instanceData) {
        return mergeData(instanceData, defaultData)
      } else {
        return defaultData
      }
    }
  }
}

// 选项 data 的合并策略
// strats.data 最终 会被处理成一个函数，因为，通过函数返回数据对象，
// 保证了每个组件实例都有一个唯一的数据副本，避免了组件间数据互相影响。
// 为什么返回一个函数，放在初始化时执行，而不在这里直接执行函数得到结果？
// 因为 props 的初始化先于 data 选项的初始化，子组件的 data 选项会用到 props 中的数据
strats.data = function(
  parentVal: any,
  childVal: any,
  vm ? : Component
): ? Function {
  if (!vm) { // 不多解释，这里处理的是子组件的 data 选项
    if (childVal && typeof childVal !== 'function') { // childVal 应该是一个函数，我们知道子组件的 data 必须是一个返回对象的函数
      process.env.NODE_ENV !== 'production' && warn(
          'The "data" option should be a function ' +
          'that returns a per-instance value in component ' +
          'definitions.',
          vm
        )
        // 直接返回 parentVal
      return parentVal
    }
    return mergeDataOrFn(parentVal, childVal)
  }

  return mergeDataOrFn(parentVal, childVal, vm)
}

/**
 * Hooks and props are merged as arrays.
 */
// 生命周期钩子选项的合并策略
// 返回一个钩子函数的数组
function mergeHook(
  parentVal: ? Array < Function > ,
  childVal : ? Function | ? Array < Function >
) : ? Array < Function > {
  return childVal ? // 判断组件选项中是否有对应的钩子函数
    parentVal ? // 如果有 childVal 则判断是否有 parentVal
    parentVal.concat(childVal) : // 如果有 parentVal 则使用 concat 方法将二者合并为一个数组
    Array.isArray(childVal) ? // 如果没有 parentVal 则判断 childVal 是不是一个数组
    childVal : [childVal] : parentVal // 如果 childVal 是一个数组则直接返回，否则将其作为数组的元素，然后返回数组，
    // 如果没有 childVal 则直接返回 parentVal，这里思考为什么 parentVal 一定是数组
    // 这种串联的三目运算符，我觉得可读性比较差
}

// LIFECYCLE_HOOKS 常量，由与生命周期钩子同名的字符串组成的数组
LIFECYCLE_HOOKS.forEach(hook => {
  // 这行代码说明了每个生命周期钩子的合并策略都是相同的
  strats[hook] = mergeHook
})

/**
 * Assets
 *
 * When a vm is present (instance creation), we need to do
 * a three-way merge between constructor options, instance
 * options and parent options.
 */
// 资源(assets)选项的合并策略
// 在 Vue 中 directives、filters 以及 components 被认为是资源
function mergeAssets(
  parentVal: ? Object,
  childVal : ? Object,
  vm ? : Component,
  key : string
) : Object {
  const res = Object.create(parentVal || null)
  if (childVal) {
    // assertObjectType 用来检测 childVal 是不是一个纯对象的
    process.env.NODE_ENV !== 'production' && assertObjectType(key, childVal, vm)

    // 合并 Vue.options 中内置的组件 指令 过滤器
    return extend(res, childVal)
  } else {
    return res
  }
}

// ASSET_TYPES 常量是由与资源选项“同名”的三个字符串组成的数组，但是少了`s`
ASSET_TYPES.forEach(function(type) {
  strats[type + 's'] = mergeAssets
})

/**
 * Watchers.
 *
 * Watchers hashes should not overwrite one
 * another, so we merge them as arrays.
 */
// 选项 watch 的合并策略
strats.watch = function(
  parentVal: ? Object,
  childVal : ? Object,
  vm ? : Component,
  key : string
): ? Object {
  // Firefox 浏览器中 Object.prototype 拥有原生的 watch 函数
  // 所以这里判断如果通过原型访问到了原生的 watch，说明用户并没有提供 Vue 的 watch 选项，直接重置为 undefined。
  // work around Firefox's Object.prototype.watch...
  if (parentVal === nativeWatch) parentVal = undefined
  if (childVal === nativeWatch) childVal = undefined
    /* istanbul ignore if */
  if (!childVal) return Object.create(parentVal || null)
  if (process.env.NODE_ENV !== 'production') {
    assertObjectType(key, childVal, vm)
  }
  if (!parentVal) return childVal
  const ret = {}
  extend(ret, parentVal)
  for (const key in childVal) {
    let parent = ret[key]
    const child = childVal[key]
    if (parent && !Array.isArray(parent)) {
      parent = [parent]
    }
    ret[key] = parent ?
      parent.concat(child) :
      Array.isArray(child) ? child : [child]
  }
  return ret
}

/**
 * Other object hashes.
 */
// 选项 props、methods、inject、computed 的合并策略
strats.props =
  strats.methods =
  strats.inject =
  strats.computed = function(
    parentVal: ? Object,
    childVal : ? Object,
    vm ? : Component,
    key : string
  ): ? Object {
    if (childVal && process.env.NODE_ENV !== 'production') {
      assertObjectType(key, childVal, vm)
    }
    if (!parentVal) return childVal
    const ret = Object.create(null)
    extend(ret, parentVal)
    if (childVal) extend(ret, childVal)
    return ret
  }

// 选项 provide 的合并策略，与 data 相同
strats.provide = mergeDataOrFn

/**
 * Default strategy.
 */
// 这是一个默认的合并策略函数
// 如果子选项是 undefined， 就返回父选项，否则返回子选项
const defaultStrat = function(parentVal: any, childVal: any): any {
  return childVal === undefined ?
    parentVal :
    childVal
}

/**
 * Validate component names
 */
function checkComponents(options: Object) {
  // 遍历每个组件
  for (const key in options.components) {
    validateComponentName(key)
  }
}
// 
export function validateComponentName(name: string) {
  // 组件的名字由普通的字符和中横线(-)组成，且必须以字母开头
  if (!/^[a-zA-Z][\w-]*$/.test(name)) {
    warn(
      'Invalid component name: "' + name + '". Component names ' +
      'can only contain alphanumeric characters and the hyphen, ' +
      'and must start with a letter.'
    )
  }
  // isBuiltInTag 判断组件的名字是否是内置的标签
  // config.isReservedTag 判断组件的名字是否是保留标签
  // config.isReservedTag 在 platforms/web/runtime/index.js 中添加的
  if (isBuiltInTag(name) || config.isReservedTag(name)) {
    warn(
      'Do not use built-in or reserved HTML elements as component ' +
      'id: ' + name
    )
  }
}

/**
 * Ensure all props option syntax are normalized into the
 * Object-based format.
 */
// 将 props 规范化为对象 
function normalizeProps(options: Object, vm: ? Component) {
  const props = options.props
  if (!props) return
  const res = {}
  let i, val, name
  if (Array.isArray(props)) { // 数组转为对象
    i = props.length
    while (i--) {
      val = props[i]
      if (typeof val === 'string') {
        name = camelize(val)
        res[name] = {
          type: null
        }
      } else if (process.env.NODE_ENV !== 'production') {
        warn('props must be strings when using array syntax.')
      }
    }
  } else if (isPlainObject(props)) { //规范化对象
    // 如
    // props: {
    //   someData1: Number,
    //   someData2: {
    //     type: String,
    //     default: ''
    //   }
    // }
    // 转为
    // props: {
    //   someData1: {
    //     type: Number
    //   },
    //   someData2: {
    //     type: String,
    //     default: ''
    //   }
    // }
    for (const key in props) {
      val = props[key]
      name = camelize(key)
      res[name] = isPlainObject(val) ?
        val : {
          type: val
        }
    }
  } else if (process.env.NODE_ENV !== 'production') {
    warn(
      `Invalid value for option "props": expected an Array or an Object, ` +
      `but got ${toRawType(props)}.`,
      vm
    )
  }
  options.props = res
}

/**
 * Normalize all injections into Object-based format
 */
function normalizeInject(options: Object, vm: ? Component) {
  // 先使用变量 inject 缓存了 options.inject
  const inject = options.inject
    // 没有 inject 直接返回
  if (!inject) return
    // normalized 和 options.inject 都引用了同一个空对象
  const normalized = options.inject = {}
  if (Array.isArray(inject)) {
    for (let i = 0; i < inject.length; i++) {
      normalized[inject[i]] = {
        from: inject[i]
      }
    }
  } else if (isPlainObject(inject)) {
    for (const key in inject) {
      const val = inject[key]
      normalized[key] = isPlainObject(val) ?
        extend({
          from: key
        }, val) : {
          from: val
        }
    }
  } else if (process.env.NODE_ENV !== 'production') {
    warn(
      `Invalid value for option "inject": expected an Array or an Object, ` +
      `but got ${toRawType(inject)}.`,
      vm
    )
  }
}

/**
 * Normalize raw function directives into object format.
 */
function normalizeDirectives(options: Object) {
  const dirs = options.directives
  if (dirs) {
    for (const key in dirs) {
      const def = dirs[key]
      if (typeof def === 'function') { // 注册的指令是一个函数
        dirs[key] = {
          bind: def,
          update: def
        }
      }
    }
  }
}

function assertObjectType(name: string, value: any, vm: ? Component) {
  if (!isPlainObject(value)) {
    warn(
      `Invalid value for option "${name}": expected an Object, ` +
      `but got ${toRawType(value)}.`,
      vm
    )
  }
}

/**
 * Merge two option objects into a new one.
 * Core utility used in both instantiation and inheritance.
 */
// 注意这个函数返回的是一个新的对象，不仅在 _init 函数中用到，在 Vue.extend 中也会用到
// mergeOptions 函数的作用就是对所有选项的规范化，并且合并选项
export function mergeOptions(
  parent: Object,
  child: Object,
  vm ? : Component
): Object {
  if (process.env.NODE_ENV !== 'production') {
    // 校验组件的名字是否符合要求
    checkComponents(child)
  }
  //child 可以是一个对象外，也可以是一个函数
  if (typeof child === 'function') {
    child = child.options // 函数的静态属性 options 作为 child
  }
  // 规范化 props
  // props 可以是字符串数组，也可以是一个对象，这里要做的就是，不论传入的 props 是什么，都先规范化成一种方式来处理
  // 在平常开发中可以借鉴这种思路
  normalizeProps(child, vm)

  // 规范化 inject，inject 是2.2.版本新增，配合 provide 使用，可以实现父组件向子组件注入数据
  // 使用方法与 props 类似
  normalizeInject(child, vm)

  // 规范化 directives，这个选项是用来注册局部指令的
  normalizeDirectives(child)

  // 这里是处理 extends 和 mixins 选项的
  // 递归调用了 mergeOptions
  const extendsFrom = child.extends
  if (extendsFrom) {
    parent = mergeOptions(parent, extendsFrom, vm)
  }
  if (child.mixins) {
    for (let i = 0, l = child.mixins.length; i < l; i++) {
      parent = mergeOptions(parent, child.mixins[i], vm)
    }
  }

  // mergeOptions 返回的是一个新的对象，就是这个 options
  // 函数的前半段是在规范化选项，接下来就是合并选项
  const options = {}
  let key
  for (key in parent) {
    mergeField(key)
  }
  for (key in child) {
    // 判断一个属性是否是对象自身的属性
    // 如果 child 对象的键也在 parent 上出现，那么就不再调用 mergeField，因为在上一个 for in 循环中已经调用过了，避免重复调用。
    if (!hasOwn(parent, key)) {
      mergeField(key)
    }
  }

  function mergeField(key) {
    // strats 就是在文件头部引用的 config.optionMergeStrategies
    // 选项覆盖策略是处理如何将父选项值和子选项值合并到最终值的函数。这个对象下包含很多函数，这些函数就可以认为是合并特定选项的策略。
    const strat = strats[key] || defaultStrat

    // vm 是 mergeOptions 的第三个参数，也就是当前 Vue 实例，但是如果是在 Vue.extend 中调用 mergeOptions 函数时
    // 是没有传入第三个参数的，可以查看 core/global-api/extend.js
    // 子组件的实现方式就是通过实例化子类完成的，子类是通过 Vue.extend 创造出来的
    options[key] = strat(parent[key], child[key], vm, key)
  }
  return options
}

/**
 * Resolve an asset.
 * This function is used because child instances need access
 * to assets defined in its ancestor chain.
 */
export function resolveAsset(
  options: Object,
  type: string,
  id: string,
  warnMissing ? : boolean
): any {
  /* istanbul ignore if */
  if (typeof id !== 'string') {
    return
  }
  const assets = options[type]
    // check local registration variations first
  if (hasOwn(assets, id)) return assets[id]
  const camelizedId = camelize(id)
  if (hasOwn(assets, camelizedId)) return assets[camelizedId]
  const PascalCaseId = capitalize(camelizedId)
  if (hasOwn(assets, PascalCaseId)) return assets[PascalCaseId]
    // fallback to prototype chain
  const res = assets[id] || assets[camelizedId] || assets[PascalCaseId]
  if (process.env.NODE_ENV !== 'production' && warnMissing && !res) {
    warn(
      'Failed to resolve ' + type.slice(0, -1) + ': ' + id,
      options
    )
  }
  return res
}
