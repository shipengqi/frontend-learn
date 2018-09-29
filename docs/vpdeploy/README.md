# VuePress 部署
[VuePress](https://github.com/vuejs/vuepress)由两部分组成，一部分是支持用 Vue 开发主题的极简静态网站生成器，另一个部分是为书写技术文档而优化的默认主题。它的诞生初衷是为了支持 Vue 及其子项目的文档需求。

我们这里是使用技术文档默认主题。

## 安装
```bash
# 将 VuePress 作为一个本地依赖安装
yarn add -D vuepress
# 或者
npm install -D vuepress

# 新建一个 docs 文件夹
mkdir docs

# 新建一个 markdown 文件
echo "# Hello VuePress!" > docs/README.md
```

修改`package.json`：
```javascript
{
  "scripts": {
    "docs:dev": "vuepress dev ./docs",
    "docs:build": "vuepress build ./docs"
  }
}
```

开始使用：
```bash
yarn docs:dev
```

构建：
```bash
yarn docs:build
```
默认情况下，静态的 HTML 文件会被生成在`.vuepress/dist`，可以通过`.vuepress/config.js`中的`dest`字段修改。

## 配置
我们再`docs`目录下创建一个`.vuepress`文件夹，创建配置文件`.vuepress/config.js`，暴露出一个 js 对象：
```javascript
module.exports = {
  title: 'Hello VuePress',
  description: 'Just playing around'
}
```

更多[配置选项](https://vuepress.vuejs.org/zh/config/)。

### 主题
VuePress 自带了一个默认的主题，专为写技术文档，我们就用默认的。查看[默认主题](https://vuepress.vuejs.org/zh/default-theme-config)。

### 应用
VuePress 是一个 Vue 应用，我们可以创建一个`.vuepress/enhanceApp.js`来做一些应用级别的配置。`enhanceApp.js`应该`export default`一个钩子函数，
并接受一个包含了一些应用级别属性的对象作为参数。你可以使用这个钩子来安装一些附加的 Vue 插件、注册全局组件，或者增加额外的路由钩子等：
```js
export default ({
  Vue, // VuePress 正在使用的 Vue 构造函数
  options, // 附加到根实例的一些选项
  router, // 当前应用的路由实例
  siteData // 站点元数据
}) => {
  // ...做一些其他的应用级别的优化
}
```

## 静态资源
我们是使用`markdown`来编写文档，VuePress 内置了 Markdown 拓展， Markdown 文件会被 webpack 编译成 Vue 组件，可以使用相对路径：
```md
![An image](./image.png)
```
文件会被复制到正确的位置。

我们可以使用`~`前缀来明确地指出这是一个 webpack 的模块请求：
```md
![Image from alias](~@alias/image.png)
![Image from dependency](~some-dependency/image.png)
```

Webpack 的别名可以通过`.vuepress/config.js`中[configurewebpack](https://vuepress.vuejs.org/zh/config/#configurewebpack)配置。

公共文件应该放在`.vuepress/public`中，例如：`favicons`。公共文件会被复制到静态文件夹中。

如果文档被部署到了一个非根路径，需要在`.vuepress/config.js`中设置`base`，例如，部署到`https://foo.github.io/bar/`，那么`base`的值就应该被设置为`/bar/`(应当总是以斜杠开始，并以斜杠结束)。

有了基础路径，如果引用一张放在`.vuepress/public`中的图片，需要使用这样路径：`/bar/image.png`，如果需要修改`base`，这样的路径引用将会显得异常脆弱。
为了解决这个问题，VuePress 提供了内置的一个 helper `$withBase`（它被注入到了 Vue 的原型上），可以帮助生成正确的路径：
```vue
<img :src="$withBase('/foo.png')" alt="foo">
```
Markdown 文件中也可以上述语法。


## 部署
前面我们配置`package.json`：
```javascript
{
 "scripts": {
   "docs:build": "vuepress build ./docs"
 }
}
```



### GitHub Pages
如果要发布到`https://<USERNAME>.github.io/`则不需要配置`base`，如果要发布到`https://<USERNAME>.github.io/<REPO>/`
将`base`设置为`"/<REPO>/"`。

创建部署脚本`deploy.sh`：
```bash
#!/bin/bash
# exit on errors
set -e

npm run docs:build

cd docs/.vuepress/dist

git init
git config user.name 'shipengqi'
git config user.email 'pooky.shipengqi@gmail.com'
git add -A
git commit -m 'deploy'

git push -f git@github.com:shipengqi/mVue.git master:gh-pages
```