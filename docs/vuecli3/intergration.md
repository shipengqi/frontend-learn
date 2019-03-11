# 项目整合与优化
## 使用 alias 简化路径
使用 webpack 构建过 Vue 项目的同学应该知道 alias 的作用，我们可以使用它将复杂的文件路径定义成一个变量来访问。
在不使用 alias 的项目中，我们引入文件的时候通常会去计算被引入文件对于引入它的文件的相对路径，比如像这样：
```js
import HelloWorld from '../../../../HelloWorld.vue'
```
一旦相对层次结构较深，我们就很难去定位所引入文件的具体位置，其实这并不是我们应该操心的地方，完全可以交给 webpack 来进行处理。
在原生的 webpack 配置中我们可以定义 alias 来解决这一问题：
```js
const path = require('path')

const resolve = dir => {
    return path.join(__dirname, dir)
}

module.exports = {
    ...

    resolve: {
        alias: {
            '@': resolve('src'), // 定义 src 目录变量
            _lib: resolve('src/common'), // 定义 common 目录变量,
            _com: resolve('src/components'), // 定义 components 目录变量,
            _img: resolve('src/images'), // 定义 images 目录变量,
            _ser: resolve('src/services'), // 定义 services 目录变量,
        }
    },

    ...
}
```
上方我们在 webpack resolve（解析）对象下配置 alias 的值，将常用的一些路径赋值给了我们自定义的变量，这样我们便可以将第一个例子简化为：
```js
import HelloWorld from '_com/HelloWorld.vue'
```
而在 CLI 3.x 中我们无法直接操作 webpack 的配置文件，我们需要通过 chainWebpack 来进行间接修改，代码如下：
```js
/* vue.config.js */
module.exports = {
    ...

    chainWebpack: config => {
        config.resolve.alias
            .set('@', resolve('src'))
            .set('_lib', resolve('src/common'))
            .set('_com', resolve('src/components'))
            .set('_img', resolve('src/images'))
            .set('_ser', resolve('src/services'))
    },

    ...
}
```
这样我们修改 webpack alias 来简化路径的优化就实现了。但是需要注意的是对于在样式及 html 模板中引用路径的简写时，前面需要加上`~`符，否则路径解析会失败，如：
```css
.img {
    background: (~_img/home.png);
}
```

## 整合功能模块
在多页应用的构建中，由于存在多个入口文件，因此会出现重复书写相同入口配置的情况，这样对于后期的修改和维护都不是特别友好，需要修改所有入口文件的相同配置，
比如在 index 单页的入口中我们引用了`VConsole`及`performance`的配置，同时在 Vue 实例上还添加了`$openRouter`方法：
```js
import Vue from 'vue'
import App from './index.vue'
import router from './router'
import store from '@/store/'
import { Navigator } from '../../common'

// 如果是非线上环境，不加载 VConsole
if (process.env.NODE_ENV !== 'production') {
    var VConsole = require('vconsole/dist/vconsole.min.js');
    var vConsole = new VConsole();

    Vue.config.performance = true;
}

Vue.$openRouter = Vue.prototype.$openRouter = Navigator.openRouter;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
```
而在 page1 和 page2 的入口文件中也同样进行了上述配置，那我们该如何整合这些重复代码，使其能够实现一次修改多处生效的功能呢？最简单的方法便是封装成一个共用方法来进行调
用，这里我们可以在 common 文件夹下新建 entryConfig 文件夹用于放置入口文件中公共配置的封装，封装代码如下：
```js
import { Navigator } from '../index'

export default (Vue) => {

    // 如果是非线上环境，不加载 VConsole
    if (process.env.NODE_ENV !== 'production') {
        var VConsole = require('vconsole/dist/vconsole.min.js');
        var vConsole = new VConsole();

        Vue.config.performance = true;
    }

    Vue.$openRouter = Vue.prototype.$openRouter = Navigator.openRouter;
}
```
上述代码我们向外暴露了一个函数，在调用它的入口文件中传入 Vue 实例作为参数即可实现内部功能的共用，我们可以将原本的入口文件简化为:

```js
import Vue from 'vue'
import App from './index.vue'
import router from './router'
import store from '@/store/'
import entryConfig from '_lib/entryConfig/'

// 调用公共方法加载配置
entryConfig(Vue)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
```
这样我们便完成了入口文件配置的整合，当然你还可以给该函数传入 router 实例及自定义参数用于其他共用配置的封装。

## 开启 Gzip 压缩
使用[compression-webpack-plugin](https://github.com/webpack-contrib/compression-webpack-plugin)来开启 Gzip 压缩。
在 vue.config.js 配置文件中，我们通过 configureWebpack 中返回一个对象来实现 plugins 的合并：
```js
/* vue.config.js */
const isPro = process.env.NODE_ENV === 'production'

module.exports = {
    ...

    configureWebpack: config => {
        if (isPro) {
            return {
                plugins: [
                    new CompressionWebpackPlugin({
                         // 目标文件名称。[path] 被替换为原始文件的路径和 [query] 查询
                        asset: '[path].gz[query]',
                        // 使用 gzip 压缩
                        algorithm: 'gzip',
                        // 处理与此正则相匹配的所有文件
                        test: new RegExp(
                            '\\.(js|css)$'
                        ),
                        // 只处理大于此大小的文件
                        threshold: 10240,
                        // 最小压缩比达到 0.8 时才会被压缩
                        minRatio: 0.8，
                    })
                ]
            }
        }
    }
    ...
}
```
上方我们通过在生产环境中增加 Gzip 压缩配置实现了打包后输出增加对应的 .gz 为后缀的文件，而由于我们配置项中配置的是
只压缩大小超过 10240B（10kB）的 JS 及 CSS，因此不满足条件的文件不会进行 Gzip 压缩。

Gzip 压缩能在普通压缩的基础上再进行 50% 以上 的压缩。