---
title: HTML 标签
weight: 1
---

# HTML 标签

## HTML 页面的基本结构

一个 HTML 页面的基本结构：

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Demo</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/x-icon" href="favicon.ico">
</head>
<body>
  <app-root></app-root>
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

## 常用标签

- `h1-h6` 标题，块级标签，占据一行
- `div` 块级容器标签
- `p` 段落，块级标签，占据一行
- `ul` 无序列表
- `ol` 有序列表
- `a` 链接，`<a href="#element-id">` 可以进行页面内位置的跳转。
- `form` 表单标签，
  - `action` 属性是提交的页面（例如 `https://www.baidu.com/s` ）
  - `method` 提交的方法，`get` 提交的数据会在链接上显示，一般用来搜索，`post` 提交的数据在 body 里面.
