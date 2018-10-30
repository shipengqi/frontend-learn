# vue-router

[vue-router](https://router.vuejs.org)是Vue官方的核心插件之一，用来实现单页面应用(SPA)。

实现单页面应用的核心就是前端路由。SPA其实就是在前后端分离的基础上，加一层前端路由。
前端路由实现的方式有两种，`url`的`hash`，js通过`hashChange`事件监听`url`的改变。
另一种是`H5`的`history`模式。


## 安装
```bash
npm install vue-router

//main.js
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
```

## Usage
将组件(components)映射到路由(routes):
```javascript
//html
<div id="app">
    <router-link to="/list" class="header-title">ChapOps</router-link>
    <router-link to="/add" class="header-title">Add</router-link>
</div>
<router-view></router-view>

//main.js 路由配置
import Vue from 'vue'
import VueRouter from 'vue-router'

const RouterConfig = {
  // 使用 H5 的 History 模式
  mode: 'history',
  routes: Routers
};

const router = new VueRouter(RouterConfig);
const app = new Vue({
  el: "#app",
  router
})

//router.js 定义路由
const routers = [
  {
    path: '/list',
    meta: {
      title: 'My Bots'
    },
    component: (resolve) => require(['./views/list.vue'], resolve)
  },
  {
    path: '/add',
    meta: {
      title: 'Add Bot'
    },
    component: (resolve) => require(['./views/add.vue'], resolve)
  },
  {
    path: '*',
    redirect: '/list'
  }
];
export default routers;

```
通过注入路由器，我们可以在任何组件内通过`this.$router`访问路由器，使用`this.$router`的就不需要在封装路由的组件中都导入路由。
**最后一个`path`为`*`的路由，是为了当访问路径不存在时，访问list页面。**

**上面的写法，webpack会把每个路由打包，请求到该页面时才会加载，也就是懒加载（按需加载）**，如果需要一次性加载：
```javascript
  {
    path: '/add',
    component: require('./views/add.vue')
  }
```

> 路由懒加载在webpack打包后可能会抛出`404`的错误，改写成`resolve => require.ensure([], () => resolve(require('../views/BotList.vue')), 'chatops-view')`
之后，问题解决。把所有组件都打包在同个异步`chunk`中，只需要给`chunk`命名，提供`require.ensure`第三个参数作为`chunk`的名称
，Webpack 将相同`chunk`下的所有异步模块打包到一个异步块里面。

## 路径参数
在路由路径中使用参数：
```javascript
const routers = [
  {
    path: '/bot/:name',
    component: bot
  }
];
```
路径参数使用冒号`:`标记。参数值会被设置到`this.$route.params`。用上面的代码距离，当url`/bot/testBot`匹配到路由时，
可以通过`this.$route.params.name`访问。

## 监测路由变化
当使用路由参数时，例如从`/user/foo`导航到`/user/bar`，原来的组件实例会被复用。由于组件被复用，组件的生命周期钩子不会再被调用。
所以这是想要对参数变化做出响应可以使用侦听属性：

```javascript
const bot = {
  template: '...',
  watch: {
    '$route' (to, from) {
      // do someTing...
    }
  }
}
```

## 优先级
**同一个路径可以匹配多个路由，优先级按照路由的定义顺序：谁先定义的，谁的优先级就最高。**

## 路由嵌套
上面的例子里`<router-view>`是用来渲染路由匹配到的组件，同样地，一个被渲染组件同样可以包含自己的嵌套 `<router-view>`，例如：

```javascript
const bot = {
  template: '<div>
               <h2>Bot {{ $route.params.name }}</h2>
               <router-view></router-view>
             </div>',

}
```

要在嵌套的`<router-view>`中渲染组件，还需要配置`children`参数：
```javascript
const routers = [
  {
    path: '/bot/:name',
    component: bot,
    children: [
      {
        // /bot/:name/env 匹配成功，
        // botEnv 会被渲染在 bot 的 <router-view> 中
        path: 'env',
        component: botEnv
      },
      { path: '', component: bot },

    ]
  }
];
```
上面的配置，有一个`path`为空字符串的子理由，如果没有配置这个子路由，当访问`/bot/testBot` 时，不会渲染任何东西，因为没有匹配到合适的子路由。

> **以`/`开头的嵌套路径会被当作根路径。**

## 路由跳转
两种方式，一种是使用`<router-link>`：
```html
<div id="app">
    <router-link to="/list" class="header-title">ChapOps</router-link>
    <router-link to="/add" class="header-title">Add</router-link>
</div>
```
上面的`to`是一个`prop`，指定要跳转的`path`。
`router-link`还有一些其他的`prop`：
- `tag`，默认值: `a`，指定`router-link`渲染成某种标签，例如`<li>`。同样它还是会监听点击，触发导航。
- `replace`，下面会介绍。
- `active-class`，默认值: `router-link-active`，当路由匹配成功时，自动给当前元素添加一个`router-link-active`class。可以通过设置`active-class`修改class。

**使用`<router-link>`，在H5的history模式下会拦截点击，避免浏览器重新加载。**


如果要在JavaScript中跳转，就要使用`router.push`或者`this.$router.push`：
```html
  export default {
    name: "app",
    mounted() {
      this.$router.push({ path: "list"});
    }
  }
```

### `router.push` `router-link`用法
```javascript
// 字符串
router.push('home')

// 对象
router.push({ path: 'home' })

// 命名的路由
router.push({ name: 'user', params: { userId: 123 }})

// 带查询参数，变成 /register?plan=private
router.push({ path: 'register', query: { plan: 'private' }})


// 如果提供了 path，params 会被忽略,这里的 params 不生效
router.push({ path: '/user', params: { userId }}) // -> /user
```
同样的规则也适用于`router-link`组件的`to`属性。

### replace
`router.replace`和`router.push`的区别就是，`router.replace`不会向`history`添加新记录，而是替换掉当前的`history`记录。
`<router-link :to="..." replace>`和`router.replace(...)`的效果是一样的

### go
`router.go(n)`方法的参数是一个整数，意思是在 history 记录中向前或者后退多少步，类似`window.history.go(n)`。

## 路由命名
```javascript
const routers = [
  {
    path: '/bot/:name',
    name: bot,
    component: bot
  }
];

//调用
this.$router.push({ name: 'bot', params: { name: "testBot" }})

// 或者
<router-link :to="{ name: 'bot', params: { name: 123 }}">Bot</router-link>
```

## 视图命名
如果需要同时（同级）展示多个视图，就需要给视图命名：
```html
<router-view></router-view>
<router-view name="one"></router-view>
<router-view name="two"></router-view>
```
**如果`router-view`没有设置名字，默认为`default`。**
多个视图就需要多个组件:
```javascript
const routers = [
  {
    path: '/bot/:name',
    name: bot,
    components: {
      default: bot,
      one: One,
      two: Two
    }
  }
];
```

**在嵌套路由中也可以使用视图命名。**

## 重定向
```javascript
const routers = [
  {
    path: '/bot/:name',
    redirect: "/list"
  }
];

//重定向的目标也可以是一个命名的路由
const routers = [
  {
    path: '/bot/:name',
    redirect: {name: "list"}
  }
];

//还可以是一个函数，返回重定向的路径
const routers = [
  {
    path: '/bot/:name',
    redirect: (to) => {
      // 方法接收 目标路由 作为参数
      // return 重定向的 字符串路径/路径对象
      return ...
    }
  }
];
```

## 别名
`/a` 的别名是 `/b`，意味着，当用户访问 `/b` 时，URL 会保持为 `/b`，但是路由匹配则为 `/a`，就像用户访问 `/a` 一样。
```javascript
const routers = [
  { path: '/a', component: A, alias: '/b' }
];

```

## 路由组件`prop`
```javascript
const User = {
  template: '<div>User {{ $route.params.id }}</div>'
}
const router = new VueRouter({
  routes: [
    { path: '/user/:id', component: User }
  ]
})
```
上面的代码，使用`$route`，组件和路由高度解耦，可以通过`props`解耦:
```html
const User = {
  props: ['id'],
  template: '<div>User {{ id }}</div>'
}
const router = new VueRouter({
  routes: [
    { path: '/user/:id', component: User, props: true },

    // 对于包含命名视图的路由，你必须分别为每个命名视图添加 `props` 选项：
    {
      path: '/user/:id',
      components: { default: User, sidebar: Sidebar },
      props: { default: true, sidebar: false }
    }
  ]
})
```
**这里的`props`被设置为`true`，`$route.params`将会被设置为组件属性。`props`还可以是一个对象，它会被按原样设置为组件属性。也可以是一个函数**
```js
const router = new VueRouter({
  routes: [
    { path: '/promotion/from-newsletter', component: Promotion, props: { newsletterPopup: false } }
  ]
})


const router = new VueRouter({
  routes: [
    { path: '/search', component: SearchUser, props: (route) => ({ query: route.query.q }) }
  ]
})
```

## H5 History 模式
```javascript
const RouterConfig = {
  mode: 'history',
  routes: Routers
};

const router = new VueRouter(RouterConfig);
```
当你使用 history 模式时，URL 就像正常的 url，例如`http://website.com/bot/name`，也好看！
不过这种模式需要后台配置支持。服务端将所有路由都指向同一个`html`，如果 URL 匹配不到任何静态资源，则应该返回同一个`index.html`页面，否则刷新时页面会出现`404`。

```javascript
const http = require('http')
const fs = require('fs')
const httpPort = 80

http.createServer((req, res) => {
  fs.readFile('index.html', 'utf-8', (err, content) => {
    if (err) {
      console.log('We cannot open "index.htm" file.')
    }

    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8'
    })

    res.end(content)
  })
}).listen(httpPort, () => {
  console.log('Server listening on: http://localhost:%s', httpPort)
})


```
对于 Node.js/Express，推荐使用 [connect-history-api-fallback](https://github.com/bripkens/connect-history-api-fallback) 中间件。

> 这么做以后，你的服务器就不再返回 404 错误页面，因为对于所有路径都会返回 index.html 文件。为了避免这种情况，你应该在 Vue 应用里面覆盖所有的路由情况，
然后在给出一个`404`页面。

```js
const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '*', component: NotFoundComponent }
  ]
})
```

## 钩子
### 导航解析流程
1. 导航被触发。
2. 在失活的组件里调用离开守卫。
3. 调用全局的 beforeEach 守卫。
4. 在重用的组件里调用 beforeRouteUpdate 守卫 (2.2+)。
5. 在路由配置里调用 beforeEnter。
6. 解析异步路由组件。
7. 在被激活的组件里调用 beforeRouteEnter。
8. 调用全局的 beforeResolve 守卫 (2.5+)。
9. 导航被确认。
10. 调用全局的 afterEach 钩子。
11. 触发 DOM 更新。
12. 用创建好的实例调用 beforeRouteEnter 守卫中传给 next 的回调函数。


### beforeEach afterEach
beforeEach 和 afterEach ，它们会在路由即将改变前和改变后触发，钩子函数有3个参数：
- to，即将要进入的目标的路由对象
- from，当前导航即将要离开的路由对象
- next，调用该方法后，才能进入下一个钩子。

其他钩子函数查看[官方文档](https://router.vuejs.org/zh-cn/advanced/navigation-guards.html)

## 路由元信息
```javascript
const routers = [
  {
    path: '/list',
    meta: {
      title: 'My Bots'
    },
    component: (resolve) => require(['./views/list.vue'], resolve)
  },
  {
    path: '/add',
    meta: {
      title: 'Add Bot'
    },
    component: (resolve) => require(['./views/add.vue'], resolve)
  }
];
```
在钩子函数中可以通过`to.meta.some`来访问。

## 过渡动效
<router-view> 是基本的动态组件，所以我们可以用 <transition> 组件给它添加一些过渡效果：
```js
<transition>
  <router-view></router-view>
</transition>
```

## 数据获取

有时候，进入某个路由后，需要从服务器获取数据。我们可以通过两种方式来实现：

- 导航完成之后获取：先完成导航，然后在接下来的组件生命周期钩子中获取数据。在数据获取期间显示`loading`之类的指示。
- 导航完成之前获取：导航完成前（`beforeRouteEnter`），在路由进入的守卫中获取数据，在数据获取成功后执行导航。

## 滚动行为
`scrollBehavior`定义切换到新路由时的滚动位置。
```js
const router = new VueRouter({
  routes: [...],
  scrollBehavior (to, from, savedPosition) {
    // return 期望滚动到哪个的位置
  }
})
```
`savedPosition`通过浏览器的 前进/后退 按钮触发时才可用。
更多查看[官方文档](https://router.vuejs.org/zh/guide/advanced/scroll-behavior.html)。

## 懒加载
实现路由组件的懒加载:
1. 将异步组件定义为返回一个 Promise 的工厂函数
```js
const Foo = () => Promise.resolve({ /* 组件定义对象 */ })
```

2. 使用动态 import语法来定义代码分块点
```js
import('./Foo.vue') // 返回 Promise

const Foo = () => import('./Foo.vue')

// 把组件按组分块 一个特殊的注释语法来提供 chunk name
const Foo = () => import(/* webpackChunkName: "group-foo" */ './Foo.vue')
const Bar = () => import(/* webpackChunkName: "group-foo" */ './Bar.vue')
```


