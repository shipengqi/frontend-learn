# 多页路由与模板解析
## 路由配置
### 跳转
在配置路由前，首先我们要明确一点就是，**多页应用中的每个单页都是相互隔离的**，即如果你想从 page1 下的路由跳到 page2 下的路由，你无法使用 vue-router 中的方法进行跳转，
需要使用原生方法`location.href`或`location.replace`。

此外为了能够清晰的分辨路由属于哪个单页，我们应该给每个单页路由添加前缀，比如：
- index 单页：`/vue/`
- page1 单页：`/vue/page1/`
- page2 单页：`/vue/page2/`

其中`/vue/`为项目的二级目录，其后的目录代表路由属于哪个单页。因此我们每个单页的路由配置可以像这样：
```js
/* page1 单页路由配置 */

import Vue from 'vue'
import Router from 'vue-router'

// 首页
const Home = (resolve => {
    require.ensure(['../views/home.vue'], () => {
        resolve(require('../views/home.vue'))
    })
})

Vue.use(Router)

let base = `${process.env.BASE_URL}` + 'page1'; // 添加单页前缀

export default new Router({
    mode: 'history',
    base: base,
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home
        },
    ]
})
```

我们通过设置路由的 base 值来为每个单页添加路由前缀，如果是 index 单页我们无需拼接路由前缀，直接跳转至二级目录即可。

那么在单页间跳转的地方，我们可以这样写：
```html
<template>
  <div id="app">
    <div id="nav">
      <a @click="goFn('')">Index</a> |
      <a @click="goFn('page1')">Page1</a> |
      <a @click="goFn('page2')">Page2</a> |
    </div>
    <router-view/>
  </div>
</template>

<script>
export default {
    methods: {
        goFn(name) {
            location.href = `${process.env.BASE_URL}` + name
        }
    }
}
</script>
```

但是为了保持和 Vue 路由跳转同样的风格，我可以对单页之间的跳转做一下封装，实现一个`Navigator`类，类的代码可以查看本文最后的示例，封装完成后我们可以将跳转方法修改为：
```js
this.$openRouter({
    name: name, // 跳转地址
    query: {
        text: 'hello' // 可以进行参数传递
    },
})
```
使用上述`$openRouter`方法我们还需要一个前提条件，便是将其绑定到 Vue 的原型链上，我们在所有单页的入口文件中添加：
```js
import { Navigator } from '../../common' // 引入 Navigator

Vue.prototype.$openRouter = Navigator.openRouter; // 添加至 Vue 原型链
```

至此我们已经能够成功模仿 vue-router 进行单页间的跳转，但是需要注意的是因为其本质使用的是 location 跳转，所以必然会产生浏览器的刷新与重载。

### 重定向
当我们完成上述路由跳转的功能后，可以在本地服务器上来进行一下测试，你会发现 Index 首页可以正常打开，但是跳转 Page1、Page2 却仍然处于 Index 父组件下，这是因为浏览
器认为你所要跳转的页面还是在 Index 根路由下，同时又没有匹配到 Index 单页中对应的路由。这时候我们服务器需要做一次重定向，将下方路由指向对应的 html 文件即可：
```
/vue/page1 -> /vue/page1.html
/vue/page2 -> /vue/page2.html
```

在 vue.config.js 中，我们需要对 devServer 进行配置，添加`historyApiFallback`配置项，该配置项主要用于解决 HTML5 History API 产生的问题，
比如其`rewrites`选项用于重写路由：
```js
/* vue.config.js */

let baseUrl = '/vue/';

module.exports = {
    ...

    devServer: {
        historyApiFallback: {
            rewrites: [
                { from: new RegExp(baseUrl + 'page1'), to: baseUrl + 'page1.html' },
                { from: new RegExp(baseUrl + 'page2'), to: baseUrl + 'page2.html' },
            ]
        }
    }

    ...
}
```
上方我们通过 rewrites 匹配正则表达式的方式将`/vue/page1`这样的路由替换为访问服务器下正确 html 文件的形式，如此不同单页间便可以进行正确跳转和访问了。
最后需要注意的是如果你的应用发布到正式服务器上，你同样需要让服务器或者中间层作出合理解析，参考：
[HTML5 History 模式 # 后端配置例子](https://router.vuejs.org/zh/guide/essentials/history-mode.html#%E5%90%8E%E7%AB%AF%E9%85%8D%E7%BD%AE%E4%BE%8B%E5%AD%90)

而更多关于 historyApiFallback 的信息可以访问：[connect-history-api-fallback](https://github.com/bripkens/connect-history-api-fallback)

## 模板配置
### 模板渲染
这里所说的模板渲染是在我们的 html 模板文件中使用 html-webpack-plugin 提
供的 [default template](https://github.com/jaketrent/html-webpack-template/blob/86f285d5c790a6c15263f5cc50fd666d51f974fd/index.html) 语法进行模
板编写，比如：
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <title>模板</title>
    <% for (var chunk in htmlWebpackPlugin.files.css) { %>
        <% if(htmlWebpackPlugin.files.css[chunk]) {%>
            <link href="<%= htmlWebpackPlugin.files.css[chunk] %>" rel="stylesheet" />
        <%}%>
    <% } %>
  </head>
  <body>
    <div id="app"></div>
    <!-- built files will be auto injected -->

    <% for (var chunk in htmlWebpackPlugin.files.js) { %>
        <% if(htmlWebpackPlugin.files.js[chunk]) {%>
            <script type="text/javascript" src="<%= htmlWebpackPlugin.files.js[chunk] %>"></script>
        <%}%>
    <% } %>
  </body>
</html>
```
以上我们使用模板语法手动获取并遍历 htmlWebpackPlugin 打包后的文件并生成到模板中，其中的`htmlWebpackPlugin`变量是模板提供的可访问变量，其有以下特定数据：
```js
"htmlWebpackPlugin": {
    "files": {
        "css": [ "main.css" ],
        "js": [ "assets/head_bundle.js", "assets/main_bundle.js"],
        "chunks": {
            "head": {
                "entry": "assets/head_bundle.js",
                "css": [ "main.css" ]
            },
            "main": {
                "entry": "assets/main_bundle.js",
                "css": []
            },
        }
    }
}
```
我们通过`htmlWebpackPlugin.files`可以获取打包输出的 js 及 css 文件路径，包括入口文件路径等。

需要注意的是如果你在模板中编写了插入对应 js 及 css 的语法，你需要设置 inject 的值为 false 来关闭资源的自动注入：
```js
/* utils.js */
...

let conf = {
    entry: filePath, // page 的入口
    template: filePath, // 模板路径
    filename: filename + '.html', // 生成 html 的文件名
    chunks: ['manifest', 'vendor',  filename],
    inject: false, // 关闭资源自动注入
}

...
```
否则在页面会引入两次资源。


### 自定义配置
在模板渲染中，我们只能够使用 htmlWebpackPlugin 内部的一些属性和方法来进行模板的定制化开发，那么如果遇到需要根据不
同环境来引入不同资源，同时不同模板间的配置还可能不一样的需求情况的话，我们使用自定义配置会比较方便。比如我们需要在生产环境模板中引入第三方统计脚本：
```js
/* vue.config.js */

module.exports = {
    ...

    pages: utils.setPages({
        addScript() {
            if (process.env.NODE_ENV === 'production') {
                return `
                    <script src="https://s95.cnzz.com/z_stat.php?id=xxx&web_id=xxx" language="JavaScript"></script>
                `
            }

            return ''
        }
    }),

    ...
}
```
然后在页面模板中通过`htmlWebpackPlugin.options`获取自定义配置对象并进行输出：
```html
<% if(htmlWebpackPlugin.options.addScript){ %>
    <%= htmlWebpackPlugin.options.addScript() %>
<%}%>
```
同时你也可以针对个别模板进行配置，比如我想只在 Index 单页中添加统计脚本，在 Page1 单页中添加其他脚本，那么你可以给 addScript 传入标识符来进行判断输出，比如：
```html
<% if(htmlWebpackPlugin.options.addScript){ %>
    <%= htmlWebpackPlugin.options.addScript('index') %>
<%}%>
```
同时为 addScript 方法添加参数 from：
```js
addScript(from) {
    if (process.env.NODE_ENV === 'production') {
        let url = "https://xxx";

        if (from === 'index') {
            url = "https://s95.cnzz.com/z_stat.php?id=xxx&web_id=xxx";
        }

        return `
            <script src=${url} language="JavaScript"></script>
        `
    }

    return ''
}
```
这样我们就完成了自定义配置中的模板渲染功能。当然根据实际项目需求你的自定义配置项可能会更加复杂和灵活。



