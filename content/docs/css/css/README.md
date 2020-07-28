# CSS 基础

CSS 层叠样式表 (Cascading Style Sheets)，通常保存在`css`文件中。

## 目录
- [为什么使用 CSS](#为什么使用)
- [插入样式表的 4 种方式](#插入样式表的4种方式)
- [语法](#语法)
- [选择器](selector.md)
- [样式](style.md)

## 为什么使用 ##
CSS 可以给网页元素精确定位，并且解决了内容与表现分离的问题，也就是 HTML 标签用来定义内容，而 CSS 用来定义如何显示这些内容。

## 插入样式表的4种方式 ##
### 外部样式表
```html
<link rel="stylesheet" type="text/css" href="style.css">
```

属性值与单位之间不能有空格，如：`margin-left: 20 px`应该是 `margin-left: 20px`。

### 内部样式表
```html
<head>
<style>
hr {color:sienna;}
p {margin-left:20px;}
body {background-image:url("images/back40.gif");}
</style>
</head>
```

### 使用@import
```html
<head>
<style>
@import style.css
</style>
</head>
```
这里使用`@import`导入的`style.css`实质上还是内部样式表。
### 内联样式
不推荐使用。
```html
<p style="color:sienna;margin-left:20px">这是一个段落。</p>
```

### 多重样式优先级
如果某些属性在不同的样式表中被同样的选择器定义，那么属性值将从更具体的样式表中被继承过来。

内联样式 > 内部样式表 > 外部样式表 > 浏览器默认样式

## 语法 ##

CSS 由两部分组成，选择器和样式(key:value)。
```css
选择器 {key: value; key: value; ...}
```
选择器指这组样式要针对的对象，可以是标签的`id`，可以是`class`，也可以是一个标签，如`body`，`h1`，`table`。
[更多选择器](selector.md)。

注释语法:
```css
/*这是个注释*/
```