/* @flow */

import config from 'core/config'
import {
  warn,
  cached
} from 'core/util/index'
import {
  mark,
  measure
} from 'core/util/perf'

import Vue from './runtime/index'
import {
  query
} from './util/index'
import {
  compileToFunctions
} from './compiler/index'
import {
  shouldDecodeNewlines,
  shouldDecodeNewlinesForHref
} from './util/compat'

// 根据 id 获取元素的 innerHTML
const idToTemplate = cached(id => {
  const el = query(id)
  return el && el.innerHTML
})

// 先使用 mount 变量缓存 Vue.prototype.$mount 方法
const mount = Vue.prototype.$mount
  // 然后重写 Vue.prototype.$mount 方法
Vue.prototype.$mount = function(
  el ? : string | Element,
  hydrating ? : boolean
): Component {
  el = el && query(el)

  /* istanbul ignore if */
  // 不能挂在到 <body> 元素或者 <html> 元素，因为挂载点的本意是 组件挂载的占位，
  // 它将会被组件自身的模板 替换掉，而 <body> 元素和 <html> 元素显然是不能被替换掉的。
  if (el === document.body || el === document.documentElement) {
    process.env.NODE_ENV !== 'production' && warn(
      `Do not mount Vue to <html> or <body> - mount to normal elements instead.`
    )
    return this
  }

  const options = this.$options
    // resolve template/el and convert to render function
  if (!options.render) {
    let template = options.template
    if (template) {
      if (typeof template === 'string') {
        if (template.charAt(0) === '#') {
          template = idToTemplate(template)
            /* istanbul ignore if */
          if (process.env.NODE_ENV !== 'production' && !template) {
            warn(
              `Template element not found or is empty: ${options.template}`,
              this
            )
          }
        }
      } else if (template.nodeType) {
        template = template.innerHTML
      } else {
        if (process.env.NODE_ENV !== 'production') {
          warn('invalid template option:' + template, this)
        }
        return this
      }
    } else if (el) {
      template = getOuterHTML(el)
    }
    if (template) {
      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
        mark('compile')
      }

      const {
        render,
        staticRenderFns
      } = compileToFunctions(template, {
        shouldDecodeNewlines,
        shouldDecodeNewlinesForHref,
        delimiters: options.delimiters,
        comments: options.comments
      }, this)
      options.render = render
      options.staticRenderFns = staticRenderFns

      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
        mark('compile end')
        measure(`vue ${this._name} compile`, 'compile', 'compile end')
      }
    }
  }
  return mount.call(this, el, hydrating)
}

// 获取元素的 outerHTML
/**
 * Get outerHTML of elements, taking care
 * of SVG elements in IE as well.
 */
function getOuterHTML(el: Element): string {
  if (el.outerHTML) {
    return el.outerHTML
  } else {
    const container = document.createElement('div')
    container.appendChild(el.cloneNode(true))
    return container.innerHTML
  }
}

// 在 Vue 上添加一个全局API `Vue.compile`
Vue.compile = compileToFunctions

export default Vue
