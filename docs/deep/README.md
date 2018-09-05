# Vue 深入学习

## 目录
- [Vue 运行机制](#运行机制)

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
其中最重要的是通过`Object.defineProperty`设置`setter`与`getter`函数，用来实现**响应式**以及**依赖收集**，后面会详细讲到，这里只要有一个印象即可。


