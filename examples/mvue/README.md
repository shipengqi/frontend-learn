# mVue
A simple implementation for MVVM of Vue.js, and deep into Vue.js.

## 开始

- `src`目录下是对`Vue`双向绑定简化版的源码。
- `vue_src`目录是`Vue`的源码，加了学习源码的注释。
- `vue_router_src`目录是`vue-router`的源码。
- `vuex_src`目录是`vuex`的源码。
- `docs`目录下是`Vue`的学习笔记。也可以直接访问[这里](https://shipengqi.github.io/frontend-learn)。

## 简单介绍
Vue.js 在做 2.0 重构时，引入了 Flow 做静态类型检查，选择 Flow，主要是因为 Babel 和 ESLint 都有对应的 Flow 插件以支持语法，
可以完全沿用现有的构建配置，非常小成本的改动就可以拥有静态类型检查的能力。

### Flow
Flow 两个重要的特性：
- 类型推断，通过变量的使用上下文来推断出变量类型，并检查类型。
- 类型注释，基于注释来判断类型。

### Vue 源码目录
`src`目录下我们能看到：
```
src
├── compiler        # 编译相关
├── core            # 核心代码
├── platforms       # 不同平台的支持
├── server          # 服务端渲染
├── sfc             # .vue 文件解析
├── shared          # 共享代码
```

- compiler，所有编译相关的代码。它包括把模板解析成 ast 语法树，ast 语法树优化，代码生成等功能。
- core，核心代码，包括内置组件、全局 API 封装，Vue 实例化、观察者、虚拟 DOM、工具函数等等。
- platform，Vue 是一个跨平台的框架，可以跑在 web 上，也可以配合 weex 跑在 native 客户端上，platform 是 Vue.js 的入口，
`web`和`weex`目录，分别打包成运行在 web 上和 weex 上的 Vue.js。
- server，所有服务端渲染相关的逻辑都在这个目录下。
- sfc，目录下的代码逻辑会把 .vue 文件内容解析成一个 JavaScript 的对象。
- shared，定义一些工具方法，被浏览器端的 Vue.js 和服务端的 Vue.js 所共享。

### Vue 源码构建
Vue 通过 Rollup 构建，构建脚本在`package.json`中：
```js
{
  "script": {
    "build": "node scripts/build.js",
    "build:ssr": "npm run build -- web-runtime-cjs,web-server-renderer",
    "build:weex": "npm run build --weex"
  }
}
```

打开`scripts/build.js`：
```js
let builds = require('./config').getAllBuilds()

// filter builds via command line arg
if (process.argv[2]) {
  const filters = process.argv[2].split(',')
  builds = builds.filter(b => {
    return filters.some(f => b.output.file.indexOf(f) > -1 || b._name.indexOf(f) > -1)
  })
} else {
  // filter out weex builds by default
  builds = builds.filter(b => {
    return b.output.file.indexOf('weex') === -1
  })
}

build(builds)
```
先从配置文件读取配置，再通过命令行参数对构建配置做过滤，这样就可以构建出不同用途的 Vue 了.