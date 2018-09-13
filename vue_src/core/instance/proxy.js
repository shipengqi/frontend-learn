/* not type checking this file because flow doesn't play well with Proxy */

import config from 'core/config'
import {
  warn,
  makeMap,
  isNative
} from '../util/index'

let initProxy

// 只有在非生产环境下导出的 initProxy 才会有值
if (process.env.NODE_ENV !== 'production') {
  const allowedGlobals = makeMap(
    'Infinity,undefined,NaN,isFinite,isNaN,' +
    'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
    'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' +
    'require' // for Webpack/Browserify
  )

  const warnNonPresent = (target, key) => {
    warn(
      `Property or method "${key}" is not defined on the instance but ` +
      'referenced during render. Make sure that this property is reactive, ' +
      'either in the data option, or for class-based components, by ' +
      'initializing the property. ' +
      'See: https://vuejs.org/v2/guide/reactivity.html#Declaring-Reactive-Properties.',
      target
    )
  }

  const hasProxy =
    typeof Proxy !== 'undefined' && isNative(Proxy)

  if (hasProxy) {
    const isBuiltInModifier = makeMap('stop,prevent,self,ctrl,shift,alt,meta,exact')
    config.keyCodes = new Proxy(config.keyCodes, {
      set(target, key, value) {
        if (isBuiltInModifier(key)) {
          warn(`Avoid overwriting built-in modifier in config.keyCodes: .${key}`)
          return false
        } else {
          target[key] = value
          return true
        }
      }
    })
  }

  const hasHandler = {
    has(target, key) {
      const has = key in target
      const isAllowed = allowedGlobals(key) || (typeof key === 'string' && key.charAt(0) === '_')
      if (!has && !isAllowed) {
        warnNonPresent(target, key)
      }
      return has || !isAllowed
    }
  }

  const getHandler = {
    get(target, key) {
      if (typeof key === 'string' && !(key in target)) {
        warnNonPresent(target, key)
      }
      return target[key]
    }
  }

  // 给 initProxy 赋值
  initProxy = function initProxy(vm) {
    if (hasProxy) { // 判断宿主环境是否支持 js 原生的 Proxy 特性
      // determine which proxy handler to use
      const options = vm.$options

      // options.render._withStripped 这个属性只在测试代码中出现过，所以一般情况下这个条件都会为假
      // 也就是使用 hasHandler
      const handlers = options.render && options.render._withStripped ?
        getHandler :
        hasHandler
      vm._renderProxy = new Proxy(vm, handlers)
    } else {
      vm._renderProxy = vm
    }
  }
}

export {
  initProxy
}
