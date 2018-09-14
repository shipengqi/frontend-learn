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
// 在重写 $mount 函数的最后一句 mount.call(this, el, hydrating) 能看出
// 这个缓存的作用就是保留原始的 $mount 方法，并在重写方法中添加了模板编译的功能
const mount = Vue.prototype.$mount
  // 然后重写 Vue.prototype.$mount 方法
Vue.prototype.$mount = function(
  el ? : string | Element, // 可以是一个字符串也可以是一个 DOM 元素
  hydrating ? : boolean // 用于 Virtual DOM 的补丁算法
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
  if (!options.render) { // 判断是否包含 render 函数
    // 使用 template 或 el 选项构建渲染函数
    let template = options.template
    if (template) { // 先尝试将 template 编译成渲染函数
      if (typeof template === 'string') {
        if (template.charAt(0) === '#') { // 第一个字符是 #，把该字符串作为 css 选择符去选中对应的元素，并把该元素的 innerHTML 作为模板
          template = idToTemplate(template)
            /* istanbul ignore if */
          if (process.env.NODE_ENV !== 'production' && !template) {
            warn(
              `Template element not found or is empty: ${options.template}`,
              this
            )
          }
        } // 第一个字符不是 #，就用 template 的字符串值作为模板
      } else if (template.nodeType) { // template 的类型是元素节点
        template = template.innerHTML
      } else { // template 选项无效
        if (process.env.NODE_ENV !== 'production') {
          warn('invalid template option:' + template, this)
        }
        return this
      }
    } else if (el) { // template 选项不存在时再检测 el 是否存在
      template = getOuterHTML(el) // 使用 el.outerHTML 作为 template
    }
    if (template) {
      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
        mark('compile')
      }

      const {
        render,
        staticRenderFns
      } = compileToFunctions(template, { // 将模板(template)字符串编译为渲染函数
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
