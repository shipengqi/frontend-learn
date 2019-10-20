# 服务器端渲染
服务器端渲染(SSR)，项目中暂时没有用到，所以只学习记录一些概念和简单用法，以后用到在深入学习。

## SPA （Single-Page Application - 单页应用程序）
使用Vue的单页应用有什么好处：
- 在客户端管理路由，用户切换路由，无需向服务器重新请求页面和静态资源，只需要使用 ajax 获取数据在客户端完成渲染，这样可以减少了很多不必要的网络传输，缩短了响应时间。
- 声明式渲染，从烦人的DOM操作中解放出来，集中处理业务逻辑。
- 组件化视图，无论是功能组件还是UI组件都可以进行抽象，写一次到处用。
- 前后端并行开发，只需要与后端定好数据格式，前期用模拟数据，就可以与后端并行开发了。
- 对复杂项目的各个组件之间的数据传递 vue  - Vuex 状态管理模式

## 为什么使用服务器端渲染
本节介绍摘自 [Vue.js 服务器端渲染指南](https://ssr.vuejs.org/zh/)。

服务器端渲染流程：
<img src="/images/vue/ssr.png" width="80%" height="">

## 优点
与传统 SPA相比，服务器端渲染(SSR)的优势主要在于：
- 更好的 SEO(Search Engine Optimization)顾名思义就是一系列为了提高 网站收录排名，吸引精准用户的方案。由于搜索引擎爬虫抓取工具可以直接查看完全渲染的页面。
请注意，截至目前，Google 和 Bing 可以很好对同步 JavaScript 应用程序进行索引。在这里，同步是关键。
如果你的应用程序初始展示 loading 菊花图，然后通过 Ajax 获取内容，抓取工具并不会等待异步完成后再行抓取页面内容。
也就是说，如果 SEO 对你的站点至关重要，而你的页面又是异步获取内容，则你可能需要服务器端渲染(SSR)解决此问题。
- 更快的内容到达时间(time-to-content)，特别是对于缓慢的网络情况或运行缓慢的设备。
无需等待所有的 JavaScript 都完成下载并执行，才显示服务器渲染的标记，所以你的用户将会更快速地看到完整渲染的页面。
通常可以产生更好的用户体验，并且对于那些「内容到达时间(time-to-content)与转化率直接相关」的应用程序而言，服务器端渲染(SSR)至关重要。

## 弊端
- 开发条件所限。浏览器特定的代码，只能在某些生命周期钩子函数(lifecycle hook)中使用；一些外部扩展库(external library)可能需要特殊处理，才能在服务器渲染应用程序中运行。
- 涉及构建设置和部署的更多要求。与可以部署在任何静态文件服务器上的完全静态单页面应用程序(SPA)不同，服务器渲染应用程序，需要处于 Node.js server 运行环境。
- 更多的服务器端负载。在 Node.js 中渲染完整的应用程序，显然会比仅仅提供静态文件的 server 更加大量占用 CPU 资源(CPU-intensive - CPU 密集)，
因此如果你预料在高流量环境(high traffic)下使用，请准备相应的服务器负载，并明智地采用缓存策略。

## 开始使用

### 安装
```bash
npm install vue-server-renderer --save

#或者
yarn add vue-server-renderer
```

> `vue-server-renderer` 和 `vue` 必须匹配版本。


### 渲染Vue实例
```javascript
const Vue = require('vue')
const app = new Vue({
  template: `<div>Hello Vue</div>`
})
const renderer = require('vue-server-renderer').createRenderer()

//使用回调函数
renderer.renderToString(app, (err, html) => {
  if (err) throw err
  console.log(html); // <div data-server-rendered="true">Hello Vue</div>
})

//Promise方式：
renderer.renderToString(app).then(html => {
  console.log(html); // <div data-server-rendered="true">Hello Vue</div>
}).catch(err => {
  console.error(err);
})
```

### 与Express集成
```javascript
const Vue = require('vue')
const server = require('express')()
const renderer = require('vue-server-renderer').createRenderer()

server.get('/', (req, res) => {
  const app = new Vue({
    data: {
      name: `xiaoming`
    },
    template: `<div>Hello {{name}}</div>`
  })

  renderer.renderToString(app, (err, html) => {
    if (err) {
      return res.status(500).end('Internal Server Error');
    }
    res.end(`
      <!DOCTYPE html>
      <html lang="en">
        <head><title>SSR</title></head>
        <body>${html}</body>
      </html>
    `)
  })
})

server.listen(8080)
```