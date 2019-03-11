# 包管理工具与配置项
## 介绍
### npm 与 package.json
npm 是 Node Package Manager 的简称， node 的包管理工具，也是目前世界上最大的开源库生态系统。
官方地址为：www.npmjs.com。

在最外层目录中，可以看到有`package.json`这一文件，该文件便是我们需要了解的包管理文件。
```js
{
    "name": "my-project",
    "version": "0.1.0",
    "private": true,
    "scripts": {
        "serve": "vue-cli-service serve",
        "build": "vue-cli-service build",
        "lint": "vue-cli-service lint"
    },
    "dependencies": {
        "vue": "^2.5.16",
        "vue-router": "^3.0.1",
        "vuex": "^3.0.1"
    },
    "devDependencies": {
        "@vue/cli-plugin-babel": "^3.0.0-beta.15",
        "@vue/cli-service": "^3.0.0-beta.15",
        "less": "^3.0.4",
        "less-loader": "^4.1.0",
        "vue-template-compiler": "^2.5.16"
    },
    "browserslist": [
        "> 1%",
        "last 2 versions",
        "not ie <= 8"
    ]
}
```
详细的package.json文件配置项介绍可以参考：[package.json](https://docs.npmjs.com/files/package.json)

### 第三方插件配置
`browserslist`这一配置项，就是第三方插件配置项，该配置的主要作用是用于在不同的前端工具之间共享目标浏览器和 Node.js 的版本：
```js
"browserslist": [
    "> 1%", // 表示包含所有使用率 > 1% 的浏览器
    "last 2 versions", // 表示包含浏览器最新的两个版本
    "not ie <= 8" // 表示不包含 ie8 及以下版本
]
```

比如像 [autoprefixer](https://www.npmjs.com/package/autoprefixer) 这样的插件需要把你写的 css 样式适配不同的浏览器，
那么这里要针对哪些浏览器呢，就是上面配置中所包含的。

而如果写在 autoprefixer 的配置中，那么会存在一个问题，万一其他第三方插件也需要浏览器的包含范围用于实现其特定的功能，
那么就又得在其配置中设置一遍，这样就无法得以共用。所以在`package.json`中配置`browserslist`的属性使得所有工具都会自动找到目标浏览器。

你也可以单独写在`.browserslistrc`的文件中：
```
# Browsers that we support

> 1%
last 2 versions
not ie <= 8
```

至于它是如何去衡量浏览器的使用率和版本的，数据都是来源于 [Can I Use](https://caniuse.com/)。你也可以访问 [browserl.ist](https://browserl.ist/)
 去搜索配置项所包含的浏览器列表，比如搜索`last 2 versions`会得到你想要的结果，或者在项目终端运行如下命令查看：

```shell
npx browserslist
```

### vue-cli 包安装
vue-cli 3.x 还提供了其专属的`vue add`命令，但是需要注意的是该命令安装的包是以`@vue/cli-plugin`或者`vue-cli-plugin`开头，即只能安装 Vue 集成的包。

比如：
```shell
vue add jquery
```

会安装`vue-cli-plugin-jquery`，很显然这个插件不存在便会安装失败。又或者你运行：
```shell
vue add @vue/eslint
```

其会解析为完整的包名`@vue/cli-plugin-eslint`，因为该包存在所以会安装成功。

`vue add`不仅会将包安装到你的项目中，其还会改变项目的代码或文件结构，所以安装前最好提交你的代码至仓库。

`vue add`中还有两个特例，如下：
```shell
# 安装 vue-router
vue add router

# 安装 vuex
vue add vuex
```

这两个命令会直接安装`vue-router`和`vuex`并改变你的代码结构，使你的项目集成这两个配置，并不会去安装添加`vue-cli-plugin`或`@vue/cli-plugin`前缀的包。