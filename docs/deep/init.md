# Vue 初始化

`new Vue()`发生了什么？
我们首先找到入口`src/core/index.js`，发现Vue的构造函数在`src/core/instance/index.js`中：
```js
function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  this._init(options)
}
```
调用了`_init`函数，`_init`是在`initMixin`方法中添加到原型上的，`_init`在`src/core/instance/init.js`中：
```js
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
    // 非生产环境下执行 initProxy(vm)，生产环境下直接在实例上添加 _renderProxy 实例属性（当前实例）
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

    // callHook 函数的作用是调用生命周期钩子函数
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

      // 将组件挂载到给定元素
      // 在 platforms/web/runtime/index.js 中有定义 $mount
      // 在 src/platforms/web/entry-runtime-with-compiler.js 中也有定义 $mount
      vm.$mount(vm.$options.el)
    }
  }
}
```

Vue 初始化主要就干了几件事情，合并配置，初始化生命周期，初始化事件中心，初始化渲染，初始化 data、props、computed、watcher 等等。

## 挂载