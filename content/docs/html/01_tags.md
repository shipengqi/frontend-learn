---
title: HTML 标签
weight: 1
---

# HTML 页面的基本结构

一个 HTML 页面的基本结构：

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Demo</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <!-- 设置不同尺寸的 favicon，浏览器会根据分辨率自动加载合适的 favicon -->
  <link rel="icon" type="image/x-icon" href="favicon-16x16.ico" sizes="16x16">
  <link rel="icon" type="image/x-icon" href="favicon-32x32.ico" sizes="32x32">
  <link rel="icon" type="image/x-icon" href="favicon-48x48.ico" sizes="48x48">
  <link rel="icon" type="image/x-icon" href="favicon.ico"> <!-- Fallback for older browsers -->
  <link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png"> <!-- 针对苹果设备，苹果设备保存网页到桌面的图标 -->
  <link rel="manifest" href="site.webmanifest"> <!-- For PWA -->
</head>
<body>
  <app-root></app-root>
  <!-- <script></script> -->
</body>
</html>
```

- `<!doctype html>`：声明文档类型是 html5。
- `<html>`：根标签，一般只包含 `head` 和 `body` 标签。
- `<head>`：标签内容一般不会显示在页面上，用于描述页面的信息。
- `<body>`：页面的主要内容。
- `<title>`：页面标题。
- `<meta name="keywords" content="..., .., ..">`：针对搜索引擎的页面关键字。
- `<meta name="description" content="...">`：针对搜索引擎的页面描述。
- `<style>`：书写 css 样式。
- `<link>`：一般用来加载 css 文件或者 favicon。
- `<script>`：用来加载 javascript 文件。**`<script>` 一般会放在 `<body>` 标签里的最下面**，原因：
  - 当 javascript 文件比较大的时候，会阻塞页面中的其他元素的加载，导致整个页面加载缓慢。
  - 另外 javascript 可能会处理页面中元素，如果 javascript 先加载，但是元素还没有生成，会导致报错。

# 常用标签

常用的标签，后期都是可以使用 CSS 去自定义样式。那为什么要定义这么多标签，而不是使用一个标签再配合 CSS 实现样式，这是因为一个重要的概念，**语义化**。

语义化的好处：

- 可读性更好。
- 对搜索引擎友好。

## 文本类标签

### 文本结构

- `h1-h6` 标题，块级标签，占据一行
- `p` 段落，块级标签，占据一行

### 文本修饰

- `em`: 强调
- `strong`: 加粗
- `u`: 下划线
- `sup`: 上标
- `sub`: 下标

### 通用

- `span` 一个通用标签，可以用它来替换所有的文本标签。

### 列表

- `ul` 无序列表
- `ol` 有序列表

### 其他

- `br` 换行，单标签
- `hr` 横线，单标签

## 结构化标签

结构化标签没有默认的样式。

### 常规结构

- `header`: 页面头部
- `nav`: 导航
- `main`: 主要区域
- `footer`: 页脚

### 文章结构

- `article`: 文档内容
- `section`: 文档中的通用区块，通常包含一组相关的内容
- `aside`: 文档中附加区块，通常包含侧边栏、广告等

### 通用

- `div`：（Division）块级容器标签

## 媒体资源标签

- `img`：图片
- `svg`：矢量图
- `video`：视频
- `audio`：音频
- `canvas`：画布

## 表单标签

- `form` 表单标签，
  - `action` 属性是提交的页面（例如 `https://www.baidu.com/s` ）
  - `method` 提交的方法，`get` 提交的数据会在链接上显示，一般用来搜索，`post` 提交的数据在 body 里面.
- `input`、`textarea` 输入或选择
- `select`：下拉列表
  - `option`：选项
- `button`：按钮
- `label`：标签

## 链接

- `a` 链接，`<a href="#element-id">` 可以进行页面内位置的跳转。

# 实体符号

HTML 中的预留字符必须被替换为实体符号才可以使用。例如在 HTML 中不能使用 `<` `>`，浏览器会误认为它们是标签。

如果希望正确地显示预留字符，必须在 HTML 源代码中使用实体符号。

[MDN Web Docs (Entity)](https://developer.mozilla.org/en-US/docs/Glossary/Entity)。
