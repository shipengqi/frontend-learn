# env 文件与环境设置
一般一个项目都会有以下 3 种环境：

- 开发环境（开发阶段，本地开发版本，一般会使用一些调试工具或额外的辅助功能）
- 测试环境（测试阶段，上线前版本，除了一些 bug 的修复，基本不会和上线版本有很大差别）
- 生产环境（上线阶段，正式对外发布的版本，一般会进行优化，关掉错误报告）

作为一名开发人员，我们可能需要针对每一种环境编写一些不同的代码并且保证这些代码运行在正确的环境中，那么我们应该如何在代码中判断项目所处的环境
同时执行不同的代码呢？这就需要我们进行正确的环境配置和管理。

## 介绍
### 配置文件
正确的配置环境首先需要我们认识不同环境配置之间的关系，如图所示：

![](../img/env_config.jpg)

我们可以在根目录下创建以下形式的文件进行不同环境下变量的配置：
```
.env                # 在所有的环境中被载入
.env.local          # 在所有的环境中被载入，但会被 git 忽略
.env.[mode]         # 只在指定的模式中被载入
.env.[mode].local   # 只在指定的模式中被载入，但会被 git 忽略
```

比如我们创建一个名为`.env.stage`的文件，该文件表明其只在`stage`环境下被加载，在这个文件中，我们可以配置如下键值对的变量：
```
NODE_ENV=stage
VUE_APP_TITLE=stage mode
```

这时候我们怎么在 vue.config.js 中访问这些变量呢？很简单，使用`process.env.[name]`进行访问就可以了，比如：
```js
// vue.config.js

console.log(process.env.NODE_ENV); // development（在终端输出）
```

当你运行`yarn serve`命令后会发现输出的是`development`，因为`vue-cli-service serve`命令默认设置的环境是`development`，
你需要修改`package.json`中的`serve`脚本的命令为：
```js
"scripts": {
    "serve": "vue-cli-service serve --mode stage",
}
```

`--mode stage`其实就是修改了 webpack 4 中的`mode`配置项为`stage`，同时其会读取对应`.env.[model]`文件下的配置，如果没找到对应配置文件，
其会使用默认环境`development`，同样`vue-cli-service build`会使用默认环境`production`。

这时候如果你再创建一个`.env`的文件，再次配置重复的变量，但是值不同，如：
```
NODE_ENV=staging
VUE_APP_TITLE=staging mode
VUE_APP_NAME=project
```

因为`.env`文件会被所有环境加载，即公共配置，那么最终我们运行`vue-cli-service serve`打印出来的是哪个呢？答案是`stage`，
但是如果是`.env.stage.local`文件中配置成上方这样，答案便是`staging`，所以`.env.[mode].local`会覆盖`.env.[mode]`下的相同配置。
同理`.env.local`会覆盖`.env`下的相同配置。

相同配置项的权重：
```
.env.[mode].local > .env.[mode] > .env.local > .env
```

但是需要注意的是，除了相同配置项权重大的覆盖小的，不同配置项它们会进行合并操作，类似于 Javascript 中的`Object.assign`的用法。

### 环境注入

通过上述配置文件的创建，我们成功使用命令行的形式对项目环境进行了设置并可以自由切换，但是需要注意的是我们在 Vue 的前端代码中打印
出的`process.env`与 vue.config.js 中输出的可能是不一样的，这需要普及一个知识点：
webpack 通过`DefinePlugin`内置插件将`process.env`注入到客户端代码中。

```js
// webpack 配置
{
    ...

    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV)
            }
        }),
    ],

    ...
}
```
由于 vue-cli 3.x 封装的 webpack 配置中已经帮我们完成了这个功能，所以我们可以直接在客户端代码中打印出`process.env`的值，
该对象可以包含多个键值对，也就是说可以注入多个值，但是经过 CLI 封装后仅支持注入环境配置文件中以`VUE_APP_`开头的变量，而`NODE_ENV`和`BASE_URL`这两个特殊变量除外。
比如我们在权重最高的`.env.stage.local`文件中写入：
```
NODE_ENV=stage2
VUE_APP_TITLE=stage mode2
NAME=vue
```

然后我们尝试在 vue.config.js 中打印`process.env`，终端输出：
```js
{
    ...

    npm_config_ignore_scripts: '',
    npm_config_version_git_sign: '',
    npm_config_ignore_optional: '',
    npm_config_init_version: '1.0.0',
    npm_package_dependencies_vue_router: '^3.0.1',
    npm_config_version_tag_prefix: 'v',
    npm_node_execpath: '/usr/local/bin/node',
    NODE_ENV: 'stage2',
    VUE_APP_TITLE: 'stage mode2',
    NAME: 'vue',
    BABEL_ENV: 'development',

    ...
}
```

可以看到输出内容除了我们环境配置中的变量外还包含了很多 npm 的信息，但是我们在入口文件`main.js`中打印会发现输出：
```js
{
    "BASE_URL": "/vue/",
    "NODE_ENV": "stage2",
    "VUE_APP_TITLE": "stage mode2"
}
```
可见注入时过滤调了非`VUE_APP_`开头的变量，其中多出的`BASE_URL`为你在 vue.config.js 设置的值，默认为`/`，其在环境配置文件中设置无效。

### 额外配置
以上我们通过新建配置文件的方式为项目不同环境配置不同的变量值，能够实现项目基本的环境管理，但是`.env`这样的配置文件中的参数目前只支持静态值，
无法使用动态参数，在某些情况下无法实现特定需求，这时候我们可以在根目录下新建`config`文件夹用于存放一些额外的配置文件。
```js
/* 配置文件 index.js */

// 公共变量
const com = {
    IP: JSON.stringify('xxx')
};

module.exports = {

    // 开发环境变量
    dev: {
    	env: {
            TYPE: JSON.stringify('dev'),
            ...com
    	}
    },

    // 生产环境变量
    build: {
    	env: {
            TYPE: JSON.stringify('prod'),
            ...com
    	}
    }
}
```
上方代码我们把环境变量分为了公共变量、开发环境变量和生产环境变量，当然这些变量可能是动态的，比如用户的 ip 等。
现在我们要在 vue.config.js 里注入这些变量，我们可以使用`chainWebpack`修改`DefinePlugin`中的值：
```js
/* vue.config.js */
const configs = require('./config');

// 用于做相应的 merge 处理
const merge = require('webpack-merge');

// 根据环境判断使用哪份配置
const cfg = process.env.NODE_ENV === 'production' ? configs.build.env : configs.dev.env;

module.exports = {
    ...

    chainWebpack: config => {
        config.plugin('define')
            .tap(args => {
                let name = 'process.env';

                // 使用 merge 保证原始值不变
                args[0][name] = merge(args[0][name], cfg);

                return args
            })
    },

    ...
}
```
最后我们可以在客户端成功打印出包含动态配置的对象：
```js
{
    "NODE_ENV": "stage2",
    "VUE_APP_TITLE": "stage mode2",
    "BASE_URL": "/vue/",
    "TYPE": "dev",
    "IP": "xxx"
}
```

### 实际场景
结合以上环境变量的配置，我们项目中一般会遇到一些实际场景： 比如在非线上环境我们可以给自己的移动端项目开启 [vConsole](https://github.com/Tencent/vConsole) 调试，
但是在线上环境肯定不需要开启这一功能，我们可以在入口文件中进行设置，代码如下：

```js
/* main.js */

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

// 如果是非正式环境，加载 VConsole
if (process.env.NODE_ENV !== 'production') {
    var VConsole = require('vconsole/dist/vconsole.min.js');
    var vConsole = new VConsole();
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

```

我们还可以使用配置中的`BASE_URL`来设置路由的`base`参数：
```js
/* router.js */

import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import About from './views/About.vue'

Vue.use(Router)

let base = `${process.env.BASE_URL}`; // 获取二级目录

export default new Router({
    mode: 'history',
    base: base, // 设置 base 值
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/about',
            name: 'about',
            component: About
        }
    ]
})
```