# Vue 深入学习

## 目录
- [Vue 运行机制](#运行机制)
- [编译](#编译)

## 运行机制 ##
### 初始化
我们知道通过`new Vue()`得到一个`vue`实例，既然要了解`vue`的运行机制，我们就来看看`new Vue()`到底做了些什么。
```javascript
function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  this._init(options)
}
```

这里调用了`_init`函数进行初始化，它会初始化生命周期、事件、 `props`、 `methods`、 `data`、 `computed` 与 `watch` 等。
其中最重要的是通过`Object.defineProperty`设置`setter`与`getter`函数，用来实现**响应式**以及**依赖收集**。

初始化之后会调用`$mount`，如果这是没有`render`函数，但是存在`template`，就会进行**编译**。

## 编译 ##
编译可以分成`parse`、`optimize`与`generate`三个阶段，编译结束后得到`render`函数。

### parse
`parse`会用正则等方式解析`template`模板中的指令、`class`、`style`等数据，形成`AST`

### optimize
`optimize`的主要作用是标记`static`静态节点，这是`Vue`在编译过程中的一处优化，后面当`update`更新界面时，会有一个`patch`的过程，
`diff`算法会直接跳过静态节点，从而减少了比较的过程，优化了`patch`的性能。

### generate
`generate`是将`AST`转化成`render`函数字符串的过程，得到结果是`render`的字符串以及`staticRenderFns`字符串。

在经历过这三个阶段以后，组件中就会存在渲染`VNode`所需的`render`函数了。

## 响应式


