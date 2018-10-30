# Vue 初始化

## 运行机制
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
其中最重要的是通过`Object.defineProperty`设置`setter`与`getter`函数，对数据进行响应式化以及**依赖收集**。

初始化之后会调用`$mount`，如果这是没有`render`函数，但是存在`template`，就会进行**编译**。

## 编译
编译可以分成`parse`、`optimize`与`generate`三个阶段，编译结束后得到`render`函数。

### parse
`parse`会用正则等方式解析`template`模板中的指令、`class`、`style`等数据，形成`AST`（抽象语法树）

### optimize
`optimize`的主要作用是标记`static`静态节点，这是`Vue`在编译过程中的一处优化，后面当`update`更新界面时，会有一个`patch`的过程，
**`diff`算法会直接跳过静态节点，从而减少了比较的过程，优化了`patch`的性能。**

### generate
`generate`是将`AST`转化成`render`函数字符串的过程，得到结果是`render`的字符串以及`staticRenderFns`字符串。

在经历过这三个阶段以后，组件中就会存在渲染`VNode`所需的`render`函数了。

## 响应式
`Vue`是一个`MVVM`框架，`Vue`的响应式是基于`Object.defineProperty`的。

当 render function 被渲染的时候，会读取所需对象的值，这时会触发`getter`函数进行**依赖收集**。**依赖收集**的目的是将观察者`Watcher`对象
存放到当前闭包中的订阅者`Dep`的`subs`中。修改对象时，会触发`setter`通知`Dep`中的每个`Watcher`，值已经改变，调用`update`方法更新视图。
这中间还有一个 patch 的过程以及使用队列来异步更新的策略。

## 虚拟DOM
render function 会被转化成 VNode 节点，Virtual DOM 其实就是一棵以 JavaScript 对象（ VNode 节点）作为基础的树，
对象属性来描述节点，实际上它只是一层对真实 DOM 的抽象。最终可以通过一系列操作使这棵树映射到真实环境上。

```js
{
    tag: 'div',                 /*div标签*/
    children: [                 /*该标签的子节点*/
        {
            tag: 'a',           /*一个a标签*/
            text: 'click me'    /*标签的内容*/
        }
    ]
}
```
渲染后得到:
```html
<div>
    <a>click me</a>
</div>
```

## 更新视图
数据变化后，执行 render function 就可以得到一个新的 VNode 节点，新的 VNode 与旧的 VNode 一起传入 patch 进行比较，经过 diff 算法得出它们的**差异**。
最后只需将这些**差异**对应的 DOM 进行修改即可。