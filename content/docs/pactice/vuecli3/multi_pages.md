# 使用 pages 构建多页应用
## 概念
> 首先我们可以把多页应用理解为由多个单页构成的应用，而何谓多个单页呢？其实你可以把一个单页看成是一个 html 文件，那么多个单页便是多个 html 文件，
多页应用便是由多个 html 组成的应用，如下图所示：

![](../img/multi_pages.jpg)

**多页应用的每个单页都可以拥有单页应用 src 目录下的文件及功能**，我们来看一下一个基础多页应用的目录结构：
```
├── node_modules               # 项目依赖包目录
├── build                      # 项目 webpack 功能目录
├── config                     # 项目配置项文件夹
├── src                        # 前端资源目录
│   ├── images                 # 图片目录
│   ├── components             # 公共组件目录
│   ├── pages                  # 页面目录
│   │   ├── page1              # page1 目录
│   │   │   ├── components     # page1 组件目录
│   │   │   ├── router         # page1 路由目录
│   │   │   ├── views          # page1 页面目录
│   │   │   ├── page1.html     # page1 html 模板
│   │   │   ├── page1.vue      # page1 vue 配置文件
│   │   │   └── page1.js       # page1 入口文件
│   │   ├── page2              # page2 目录
│   │   └── index              # index 目录
│   ├── common                 # 公共方法目录
│   └── store                  # 状态管理 store 目录
├── .gitignore                 # git 忽略文件
├── .env                       # 全局环境配置文件
├── .env.dev                   # 开发环境配置文件
├── .postcssrc.js              # postcss 配置文件
├── babel.config.js            # babel 配置文件
├── package.json               # 包管理文件
├── vue.config.js              # CLI 配置文件
└── yarn.lock                  # yarn 依赖信息文件
```

可以看出其实 pages 下的一个目录就是一个单页包含的功能，这里我们包含了 3 个目录就构成了多页应用。

除了目录结构的不同外，其实区别单页应用，多页应用在很多配置上都需要进行修改，比如单入口变为多入口、单模板变为多模板等，那么下面我们就来了解一下多页应用的具体实现。

## 多入口
在单页应用中，我们的入口文件只有一个，CLI 默认配置的是 main.js，但是到了多页应用，我们的入口文件便包含了 page1.js、page2.js、index.js等，
数量取决于 pages 文件夹下目录的个数，这时候为了项目的可拓展性，我们需要自动计算入口文件的数量并解析路径配置到 webpack 中的 entry 属性上，如：
```js
module.exports = {
    ...

    entry: {
        page1: '/xxx/pages/page1/page1.js',
        page2: '/xxx/pages/page2/page2.js',
        index: '/xxx/pages/index/index.js',
    },

    ...
}
```

那么我们如何读取并解析这样的路径呢，这里就需要使用工具和函数来解决了。我们可以在根目录新建 build 文件夹存放 utils.js 这样共用
的 webpack 功能性文件，并加入多入口读取解析方法：

```js
/* utils.js */
const path = require('path');

// glob 是 webpack 安装时依赖的一个第三方模块，该模块允许你使用 * 等符号,
// 例如 lib/*.js 就是获取 lib 文件夹下的所有 js 后缀名的文件
const glob = require('glob');

// 取得相应的页面路径，因为之前的配置，所以是 src 文件夹下的 pages 文件夹
const PAGE_PATH = path.resolve(__dirname, '../src/pages');

/*
* 多入口配置
* 通过 glob 模块读取 pages 文件夹下的所有对应文件夹下的 js * 后缀文件，如果该文件存在
* 那么就作为入口处理
*/
exports.getEntries = () => {
    let entryFiles = glob.sync(PAGE_PATH + '/*/*.js') // 同步读取所有入口文件
    let map = {}

    // 遍历所有入口文件
    entryFiles.forEach(filePath => {
        // 获取文件名
        let filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'))

        // 以键值对的形式存储
        map[filename] = filePath
    })

    return map
}
```

![](../img/glob.jpg)

上方我们使用了 [glob](https://github.com/isaacs/node-glob) 这一第三方模块读取所有 pages 文件夹下的入口文件，其需要进行安装：`yarn add glob --dev`

读取并存储完毕后，我们得到了一个入口文件的对象集合，这个对象我们便可以将其设置到 webpack 的 entry 属性上，这里我们需要修改 vue.config.js 的配置来间
接修改 webpack 的值：
```js
/* vue.config.js */

const utils = require('./build/utils')

module.exports = {
    ...

    configureWebpack: config => {
        config.entry = utils.getEntries()
    },

    ...
}
```

## 多模板
多模板的配置也是大同小异，这里所说的模板便是每个 page 下的 html 模板文件，而模板文件的作用主要用于 webpack 中`html-webpack-plugin`插件的配置，
其会根据模板文件生产一个编译后的 html 文件并自动加入携带 hash 的脚本和样式，基本配置如下：
```js
/* webpack 配置文件 */
const HtmlWebpackPlugin = require('html-webpack-plugin') // 安装并引用插件

module.exports = {
    ...

    plugins: [
        new HtmlWebpackPlugin({
            title: 'My Page', // 生成 html 中的 title
            filename: 'demo.html', // 生成 html 的文件名
            template: 'xxx/xxx/demo.html', // 模板路径
            chunks: ['manifest', 'vendor', 'demo'], // 所要包含的模块
            inject: true, // 是否注入资源
        })
    ]

    ...
}
```
以上是单模板的配置，那么如果是多模板只要继续往 plugins 数组中添加 HtmlWebpackPlugin 即可，但是为了和多入口一样能够灵活的获取 pages
目录下所有模板文件并进行配置，我们可以在 utils.js 中添加多模板的读取解析方法：
```js
/* utils.js */

// 多页面输出配置
// 与上面的多页面入口配置相同，读取 page 文件夹下的对应的 html 后缀文件，然后放入数组中
exports.htmlPlugin = configs => {
    let entryHtml = glob.sync(PAGE_PATH + '/*/*.html')
    let arr = []

    entryHtml.forEach(filePath => {
        let filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'))
        let conf = {
            template: filePath, // 模板路径
            filename: filename + '.html', // 生成 html 的文件名
            chunks: ['manifest', 'vendor',  filename],
            inject: true,
        }

        // 如果有自定义配置可以进行 merge
        if (configs) {
            conf = merge(conf, configs)
        }

        // 针对生产环境配置
        if (process.env.NODE_ENV === 'production') {
            conf = merge(conf, {
                minify: {
                    removeComments: true, // 删除 html 中的注释代码
                    collapseWhitespace: true, // 删除 html 中的空白符
                    // removeAttributeQuotes: true // 删除 html 元素中属性的引号
                },
                chunksSortMode: 'manual' // 按 manual 的顺序引入
            })
        }

        arr.push(new HtmlWebpackPlugin(conf))
    })

    return arr
}
```

![](../img/glob2.jpg)

以上我们仍然是使用 glob 读取所有模板文件，然后将其遍历并设置每个模板的 config，同时针对一些自定义配置和生产环境的配置进行了 merge 处理，
其中自定义配置的功能我会在下节进行介绍，这里介绍一下生产环境下 minify 配置的作用：将`html-minifier`的选项作为对象来缩小输出。

[html-minifier](https://github.com/kangax/html-minifier)是一款用于缩小 html 文件大小的工具，其有很多配置项功能，包括上述所列举的常用的删除注释、空白、引号等。

当我们编写完了多模板的方法后，我们同样可以在 vue.config.js 中进行配置，与多入口不同的是我们在 configureWebpack 中不能直接替换 plugins 的值，
因为它还包含了其他插件，这时候大家还记得第 3 节中讲到的使用 return 返回一个对象来进行 merge 操作吗？

```js
/* vue.config.js */

const utils = require('./build/utils')

module.exports = {
    ...

    configureWebpack: config => {
        config.entry = utils.getEntries() // 直接覆盖 entry 配置

        // 使用 return 一个对象会通过 webpack-merge 进行合并，plugins 不会置空
        return {
            plugins: [...utils.htmlPlugin()]
        }
    },

    ...
}
```

这时候我们运行命令 yarn build 后你会发现 dist 目录下生成了 3 个 html 文件，分别是 index.html、page1.html 和 page2.html。

## 使用 pages 配置
在 vue.config.js 中，我们还有一个配置没有使用，便是`pages`。`pages`对象允许我们为应用配置多个入口及模板，这就为我们的多页应用提供了开放的配置入口。官方示例代码如下：
```js
/* vue.config.js */
module.exports = {
    pages: {
        index: {
            // page 的入口
            entry: 'src/index/main.js',
            // 模板来源
            template: 'public/index.html',
            // 在 dist/index.html 的输出
            filename: 'index.html',
            // 当使用 title 选项时，
            // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
            title: 'Index Page',
            // 在这个页面中包含的块，默认情况下会包含
            // 提取出来的通用 chunk 和 vendor chunk。
            chunks: ['chunk-vendors', 'chunk-common', 'index']
        },
        // 当使用只有入口的字符串格式时，
        // 模板会被推导为 `public/subpage.html`
        // 并且如果找不到的话，就回退到 `public/index.html`。
        // 输出文件名会被推导为 `subpage.html`。
        subpage: 'src/subpage/main.js'
    }
}
```

pages 对象中的 key 就是入口的别名，而其 value 对象其实是入口 entry 和模板属性的合并，
这样我们上述介绍的获取多入口和多模板的方法就可以合并成一个函数来进行多页的处理，合并后的 setPages 方法如下：
```js
// pages 多入口配置
exports.setPages = configs => {
    let entryFiles = glob.sync(PAGE_PATH + '/*/*.js')
    let map = {}

    entryFiles.forEach(filePath => {
        let filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'))
        let tmp = filePath.substring(0, filePath.lastIndexOf('\/'))

        let conf = {
            // page 的入口
            entry: filePath,
            // 模板来源
            template: tmp + '.html',
            // 在 dist/index.html 的输出
            filename: filename + '.html',
            // 页面模板需要加对应的js脚本，如果不加这行则每个页面都会引入所有的js脚本
            chunks: ['manifest', 'vendor', filename],
            inject: true,
        };

        if (configs) {
            conf = merge(conf, configs)
        }

        if (process.env.NODE_ENV === 'production') {
            conf = merge(conf, {
                minify: {
                    removeComments: true, // 删除 html 中的注释代码
                    collapseWhitespace: true, // 删除 html 中的空白符
                    // removeAttributeQuotes: true // 删除 html 元素中属性的引号
                },
                chunksSortMode: 'manual'// 按 manual 的顺序引入
            })
        }

        map[filename] = conf
    })

    return map
}
```

上述代码我们 return 出的 map 对象就是 pages 所需要的配置项结构，我们只需在 vue.config.js 中引用即可：

```js
/* vue.config.js */

const utils = require('./build/utils')

module.exports = {
    ...

    pages: utils.setPages(),

    ...
}
```

当你运行打包命令来查看输出结果的时候，你会发现和之前的方式相比并没有什么变化，这就说明这两种方式都适用于多页的构建，但是这里还是推荐大家使用更便捷的 pages 配置。