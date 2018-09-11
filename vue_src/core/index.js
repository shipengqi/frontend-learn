// 引入 Vue 的构造函数，对其原型添加属性和方法，即实例属性和实例方法
import Vue from './instance/index'

import { initGlobalAPI } from './global-api/index'
import { isServerRendering } from 'core/util/env'
import { FunctionalRenderContext } from 'core/vdom/create-functional-component'

//为 Vue 添加全局的API，也就是静态的方法和属性
//调用 initGlobalAPI 方法，参数是 Vue 构造函数
initGlobalAPI(Vue)

// 在 Vue.prototype 上添加 $isServer, 代理了 isServerRendering 方法
Object.defineProperty(Vue.prototype, '$isServer', {
  get: isServerRendering
})

// 在 Vue.prototype 上添加 $ssrContext
Object.defineProperty(Vue.prototype, '$ssrContext', {
  get () {
    /* istanbul ignore next */
    return this.$vnode && this.$vnode.ssrContext
  }
})

// 在 Vue 构造函数上定义了 FunctionalRenderContext 静态属性，为了在 ssr 中使用它
// expose FunctionalRenderContext for ssr runtime helper installation
Object.defineProperty(Vue, 'FunctionalRenderContext', {
  value: FunctionalRenderContext
})

// Vue 的版本号 rollup 的 replace 插件会把 __VERSION__  替换为 version 的值
Vue.version = '__VERSION__'

export default Vue
