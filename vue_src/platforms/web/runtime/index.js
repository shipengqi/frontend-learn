/* @flow */
// Vue 针对 web 平台的包装
// 设置平台化的 Vue.config。
// 在 Vue.options 上混合了两个指令(directives)，分别是 model 和 show。
// 在 Vue.options 上混合了两个组件(components)，分别是 Transition 和 TransitionGroup。
// 在 Vue.prototype 上添加了两个方法：__patch__ 和 $mount。

import Vue from 'core/index'
import config from 'core/config'
import {
  extend,
  noop
} from 'shared/util'
import {
  mountComponent
} from 'core/instance/lifecycle'
import {
  devtools,
  inBrowser,
  isChrome
} from 'core/util/index'

import {
  query,
  mustUseProp,
  isReservedTag,
  isReservedAttr,
  getTagNamespace,
  isUnknownElement
} from 'web/util/index'

import {
  patch
} from './patch'
import platformDirectives from './directives/index'
import platformComponents from './components/index'

// Vue.config 在 initGlobalAPI 方法中添加的
// 从 core/config.js 文件导出的 config 对象，大部分属性都是初始化了一个初始值
// config 对象与平台有关的配置，在这里被覆盖了
// install platform specific utils
Vue.config.mustUseProp = mustUseProp
Vue.config.isReservedTag = isReservedTag
Vue.config.isReservedAttr = isReservedAttr
Vue.config.getTagNamespace = getTagNamespace
Vue.config.isUnknownElement = isUnknownElement

// 在 initGlobalAPI 方法中给 Vue.options 添加了 directives components 和 filters 属性，但都是空对象。
// 在这里给 directives components 添加 web 平台运行时的特定组件和指令。
// install platform runtime directives & components
extend(Vue.options.directives, platformDirectives)
extend(Vue.options.components, platformComponents)

//添加 __patch__ 方法，如果在浏览器环境运行的话，这个方法的值为 patch 函数，否则是一个空函数 noop。
// 在 Vue.prototype 上添加 $mount 方法
// install platform patch function
Vue.prototype.__patch__ = inBrowser ? patch : noop

// public mount method
Vue.prototype.$mount = function(
  el ? : string | Element, // 可以是一个字符串也可以是一个 DOM 元素
  hydrating ? : boolean // 用于 Virtual DOM 的补丁算法
): Component {
  el = el && inBrowser ? query(el) : undefined
  return mountComponent(this, el, hydrating)
}

// vue-devtools 的全局钩子，包裹在 setTimeout 中
// devtools global hook
/* istanbul ignore next */
if (inBrowser) {
  setTimeout(() => {
    if (config.devtools) {
      if (devtools) {
        devtools.emit('init', Vue)
      } else if (
        process.env.NODE_ENV !== 'production' &&
        process.env.NODE_ENV !== 'test' &&
        isChrome
      ) {
        console[console.info ? 'info' : 'log'](
          'Download the Vue Devtools extension for a better development experience:\n' +
          'https://github.com/vuejs/vue-devtools'
        )
      }
    }
    if (process.env.NODE_ENV !== 'production' &&
      process.env.NODE_ENV !== 'test' &&
      config.productionTip !== false &&
      typeof console !== 'undefined'
    ) {
      console[console.info ? 'info' : 'log'](
        `You are running Vue in development mode.\n` +
        `Make sure to turn on production mode when deploying for production.\n` +
        `See more tips at https://vuejs.org/guide/deployment.html`
      )
    }
  }, 0)
}

export default Vue
