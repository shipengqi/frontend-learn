<h1 align="center">
  HTML CSS 学习笔记
</h1>

<p align="center">
  <img alt="HTML5" src="img/html.png" width="20%" height="">
</p>

HTML（Hyper Text Markup Language），它不是编程语言，而是一个描述性的标记语言（其他标记语言，比如`Markdown`），描述超文本内容的显示方式，它是全球描述网页的内容和外观的标准。

HTML 最基本的使用方法就是`<标记符>内容</标记符>`。标记符一般是一对，一个开头标记（`<tag>`），一个结束标记（`</tag>`）。也有部分标记没有结束标记(`<br>`，`<hr>`)，
对于这种标记，建议添加一个`/`结束标记，比如 `<br />`，`<hr />`。

浏览器在打开 HTML 文件时，会解释每一个标记符，然后显示标记符所表达的内容。例如`<i>我是斜体</i>`展示的字体就是斜体，`<b>我是粗体</b>`
展示的字体是粗体。

基本结构，HTML 标签对大小写不敏感：
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Html</title>
    头内容...
</head>
<body>
  内容主体...
</body>
</html>
```

大多数 HTML 元素被定义为块级元素或内联元素。块级元素在浏览器显示时，通常会以新行来开始和结束（例如`<h1>`, `<p>`, `<ul>`, `<table>`）。内联元素则不会（例如`<b>`, `<td>`, `<a>`, `<img>`）。
`<div>`是最常用的元素，它是块级元素，是用于组合其他 HTML 元素的容器。

## 目录
- [HTML 基础](html/)
- [HTML5 基础](h5/)
- [CSS 基础](css/)
- [CSS3 基础](css3/)
- [响应式web设计](responsive/)
