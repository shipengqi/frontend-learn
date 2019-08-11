# HTML 全局属性 事件属性

## 目录
- [HTML全局属性](#全局属性)
- [HTML事件属性](#事件属性)

## 全局属性 ##

- `accesskey`，设置访问元素的快捷键，不同浏览器的使用方式不同。
- `class`，添加元素类名，区分大小写。
- `dir`，元素内容的文本方向。
  - `ltr`，从左向右
  - `rtl`，从右向左
  - `auto`，自动
- `id`，元素id。
- `lang`，元素内容的语言。
- `style`，元素行内样式。
- `tabindex`，按tab键切换元素的顺序。
- `title`，元素的额外信息，通常会在鼠标移到元素上时显示这段提示信息。

## 事件属性 ##

### 窗口事件
在`<body>`标签内：
- `onblur`，窗口失去焦点
- `onfocus`，窗口获得焦点
- `onload`，文档对象加载完成后触发，通常在`<body>`中，用于在页面完全载入后执行指定的脚本(包括图片，脚本，css文件等)。


### 表单事件
适用于所有 HTML 元素, 但该 HTML 元素需在`<form>`表单内：

- `onblur`，元素失去焦点， 通常用于检验元素的值(当用户离开表单输入域时)。
- `onchange`，元素值改变时触发，适用于`<input>`,`<textarea>`和`<select>`。
- `onfocus`，元素获得焦点时触发，适用于`<input>`,`<a>`和`<select>`。
- `onselect`，选取元素文本后触发，适用于`<input type="file">`,`<input type="file">`，`<input type="file">`，`<<keygen>`和`<textarea>`。
例如在上面适用的某个元素中通过鼠标选中文本。
- `onsubmit`，在表单提交时触发，适用于`<form>`。

### 键盘事件
按下键盘按键时触发，触发顺序`onkeydown` -> `onkeypress` -> `onkeyup`。
- `onkeydown`，按下键盘按键时触发。
- `onkeypress`，有些按键不能触发（例如：ALT, CTRL, SHIFT, ESC），可以使用 onkeydown 代替。
- `onkeyup`，松开按键时触发

以上事件都不能用于以下元素: `<base>`, `<bdo>`, `<br>`, `<head>`, `<html>`, `<iframe>`, `<meta>`, `<param>`, `<script>`,`<style>`, 或 `<title>`。

### 鼠标事件

- `onclick`，单击鼠标时触发。
- `ondblclick`，双击鼠标时触发。
- `onmousedown`，按下鼠标按钮时触发。
- `onmouseup`，松开鼠标按键时触发。
- `onmousemove`，鼠标指针移动到元素时触发。
- `onmouseout`，与 onmousemove 相反。
- `onmouseover`，鼠标指针移至元素之上时触发。

以上事件都不能用于以下元素: `<base>`, `<bdo>`, `<br>`, `<head>`, `<html>`, `<iframe>`, `<meta>`, `<param>`, `<script>`,`<style>`, 或 `<title>`。

### 多媒体事件
- `onabort`，发生中止事件。