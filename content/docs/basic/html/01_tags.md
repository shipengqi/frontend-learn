---
title: HTML 标签
weight: 1
---

# HTML 标签

一个 HTML 页面的基本结构：

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>NgApp</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/x-icon" href="favicon.ico">
</head>
<body>
  <app-root></app-root>
</body>
</html>
```

`<!doctype html>`：声明文档类型是 html5。
`<html>`：根标签，一般只包含 `head` 和 `body` 标签
`<head>`：标签内容一般不会显示在页面上，用于描述页面的信息。
`<body>`：页面的主要内容
`<title>`：页面标题
`<meta name="keywords" content="..., .., ..">`：针对搜索引擎的页面关键字
`<meta name="description" content="...">`：针对搜索引擎的页面描述
`<style>`：书写 css 样式

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

## css 常用属性




### 滤镜属性

`-webkit-filter`：滤镜属性。
- `blur()` 设置元素的模糊度，默认是 `0px`。 例如：`-webkit-filter: blur(20px)`, `blur()` 中的值越大越模糊。
- `grayscale()` 灰度，正常是 `0%`，也可以写数字。例如：`-webkit-filter: grayscale(100%)`。
- `sepia()` 褐色，正常是 `0%` 可以写数字。例如：`-webkit-filter: sepia(100%)` 。
- `brightness()` 亮度，正常亮度 `100%` 可以写数字，例如：`-webkit-filter: brightness(100%)` 。如果需要过度曝光的效果可以 `brightness(500%)`。
- `contrast()` 对比度，正常是 `100%` 可以写数字，例如：`-webkit-filter: contrast(1000%)` 和 `-webkit-filter: contrast(10)` 是一个意思。
- `saturate()` 饱和度，正常是 `100%` 可以写数字，例如：`-webkit-filter: saturate(1000%)`。
- `hue-rotate()` 色相旋转，正常是 `0deg` 可以写数字，例如：`-webkit-filter: hue-rotate(45deg)`。
- `invert()` 色相反转，底片效果，正常是 `0` 可以写数字，`-webkit-filter: invert(100%)`。

多个属性组合：`-webkit-filter: blur(20px) brightness(100%)`。

### 常用单位

`%` 百分比。
`px` 像素单位。
`em` 相对单位，相对于父元素的字体大小。不建议使用。`2em` 就是父元素 `font-size` 的两倍。`1em` 就是 1 倍。
`rem` 相对单位，相对于根元素（`html` 标签）的字体大小。
`vw` `viewport width` 视窗宽度。`1vw` 就等于视窗宽度的 `1%`。 
`vh` `viewport height` 视窗宽度。`1vh` 就等于视窗高度的 `1%`。

## Other

块元素 `display: block` 可以使用 `margin: 0 auto` 来实现水平居中


`transition` 两个状态的过渡动画，`transition: all 2s` all 表示所有属性。


## 滚动条

`overflow:scroll` x 和 y 轴的滚动条
`overflow-x:scroll` x 轴的滚动条
`overflow-y:scroll`  y 轴的滚动条

`::-webkit-scrollbar` —— 整个滚动条，可以设置宽度等。
`::-webkit-scrollbar-button` —— 滚动条两端的按钮（上下箭头）。
`::-webkit-scrollbar-thumb` —— 滚动条上的滚动滑块。
`::-webkit-scrollbar-track` —— 滚动条轨道。
`::-webkit-scrollbar-track-piece`——滚动条没有滑块的轨道部分。
`::-webkit-scrollbar-corner` —— 当同时有垂直滚动条和水平滚动条时交汇的部分。通常是浏览器窗口的右下角。
`::-webkit-resizer` —— 出现在某些元素底角的可拖动调整大小的滑块。


`-webkit` 开头的样式，只针对 webkit 内核浏览器有效。

```css
/*定义滚动条高宽及背景
 高宽分别对应横竖滚动条的尺寸*/
::-webkit-scrollbar
{
    width:16px;
    height:16px;
    background-color:#F5F5F5;
}
/*定义滚动条轨道
 内阴影+圆角*/
::-webkit-scrollbar-track
{
    -webkit-box-shadow:inset 0 0 6px rgba(0,0,0,0.3);
    border-radius:10px;
    background-color:#F5F5F5;
}
/*定义滑块
 内阴影+圆角*/
::-webkit-scrollbar-thumb
{
    border-radius:10px;
    -webkit-box-shadow:inset 0 0 6px rgba(0,0,0,.3);
    background-color:#555;
}

```

IE 浏览器：

`scrollbar-arrow-color`: 三角箭头的颜色
`scrollbar-face-color`: 立体滚动条的颜色（包括箭头部分的背景色）
`scrollbar-3dlight-color`: 立体滚动条亮边的颜色
`scrollbar-highlight-color`: 滚动条的高亮颜色（左阴影？）
`scrollbar-shadow-color`: 立体滚动条阴影的颜色
`scrollbar-darkshadow-color`: 立体滚动条外阴影的颜色
`scrollbar-track-color`: 立体滚动条背景颜色
`scrollbar-base-color`: 滚动条的基色


## 换行

文本换行的属性：

### overflow-wrap

当一个不能被分开的字符串太长而不能填充其 `div` 时，为防止其溢出，浏览器是否允许这样的单词中断换行。

- `normal`：默认换行行为，换行符将出现在空格和连字符处。
- `anywhere`：在字符串之间的任意点来进行中断，仅当在其行上显示单词会导致溢出时，浏览器才会中断该单词。
- `break-word`：如果行内没有多余的地方容纳该单词到结尾，则那些正常的不能被分割的单词会被强制分割换行。


### word-break

用于指定怎样在单词内进行断行。可以使用该属性在内容发生溢出的确切位置拆分单词并将其换行到下一行。

- `normal`：默认的断行规则。
- `break-all`：对于 non-CJK (CJK 指中文/日文/韩文) 的文本，可在任意字符间断行。
- `keep-all`：即使内容溢出，浏览器也不会将分词应用于 CJK 文本。 应用 `keep-all` 值的效果与非 CJK 书写系统的正常效果相同。简单来说就是，像英语这种 CJK 文本不
  会断行，像中文这种 Non-CJK 文本表现同 normal。
- `break-word`：弃用。


### white-space

用来设置如何处理元素中的空白。

- `normal`：默认的断行规则。
- `nowrap`：防止文本自动换行。
- `pre`：文本之间的空白会被浏览器保留。其行为方式类似 HTML 中的 `<pre>` 标签。

### line-break

用来处理如何断开带有标点符号的中文、日文或韩文文本的行。简而言之，该属性可以用来处理过长的标点符号。

### text-overflow

属性指定当文本溢出包含它的元素时，应该如何显示。可以设置溢出后，文本被剪切、显示省略号 (`...`) 或显示自定义字符串（不是所有浏览器都支持）。

- `clip`：剪切文本。
- `ellipsis`：显示省略符号 `...` 来代表被修剪的文本。
- `string`：使用给定的字符串来代表被修剪的文本。
- `initial`：设置为属性默认值。
- `inherit`：从父元素继承该属性值。 

`text-overflow` 需要配合以下两个属性使用：

- `white-space: nowrap;`
- `overflow: hidden;`


## scrollHeight, clientHeight, offsetHeight

每个 html 元素都具有 `clientHeight` `offsetHeight` `scrollHeight` `offsetTop` `scrollTop` 这 5 个和元素高度、滚动、位置相关的属性。

`clientHeight`：包括 `padding` 但不包括 `border`、水平滚动条、`margin` 的元素的高度。对于 `inline` 的元素这个属性一直是 0，单位 `px`，只读元素。
`offsetHeight`：包括 `padding`、`border`、水平滚动条，但不包括 `margin` 的元素的高度。对于 `inline` 的元素这个属性一直是 0，单位 `px`，只读元素。

有滚动条时的情况：

当本元素的子元素比本元素高且 `overflow=scroll` 时，本元素会 `scroll`，这时：

`scrollHeight`: 因为子元素比父元素高，父元素不想被子元素撑的一样高就显示出了滚动条，在滚动的过程中本元素有部分被隐藏了，`scrollHeight` 代表包括当
前不可见部分的元素的高度。而可见部分的高度其实就是 `clientHeight`，也就是 `scrollHeight>=clientHeight` 恒成立。在有滚动条时讨论 `scrollHeight` 才有意义，
在没有滚动条时 `scrollHeight==clientHeight` 恒成立。单位 `px`，只读元素。
`scrollTop`: 代表在有滚动条时，滚动条向下滚动的距离也就是元素顶部被遮住部分的高度。在没有滚动条时 `scrollTop==0` 恒成立。单位 `px`，可读可设置。
`offsetTop`: 当前元素顶部距离最近父元素顶部的距离,和有没有滚动条没有关系。单位 `px`，只读元素。

## linear-gradient

从头部开始的线性渐变。

```css
background-image: linear-gradient(direction, color-stop1, color-stop2, ...);
```

- `direction`	用角度值指定渐变的方向（或角度）。
- `color-stop1`, `color-stop2`,...	用于指定渐变的起止颜色。

线性渐变，需要指定两种颜色，还可以实现不同方向（指定为一个角度）的渐变效果，如果不指定方向，默认从上到下渐变：
```css
/* 从上到下，蓝色渐变到红色 */
linear-gradient(blue, red);
 
/* 渐变轴为45度，从蓝色渐变到红色 */
linear-gradient(45deg, blue, red);
 
/* 从右下到左上、从蓝色渐变到红色 */
linear-gradient(to left top, blue, red);
 
/* 从下到上，从蓝色开始渐变、到高度40%位置是绿色渐变开始、最后以红色结束 */
linear-gradient(0deg, blue, green 40%, red);
```

示例：

渐变轴为 90 度， `#19224A 0%` `#222E61 25%` `#23346A 65%` `#146693 90%` `#088CB2 100%`：

```css
background-image: linear-gradient(90deg, #19224A 0, #222E61 25%, #23346A 65%, #146693 90%, #088CB2);
```

## RGBA

RGB是一种色彩标准，由红（Red）、绿（Green）、蓝（Blue）3种颜色变化来得到各种颜色。而RGBA，说白了就是在RGB基础上增加了一个透明度通道 Alpha。

```css
rgba(R, G, B, A)
```

R，指的是红色值（Red）；G，指的是绿色值（Green）；B，指的是蓝色值（Blue）；A，指的是透明度（Alpha）。

R、G、B这三个可以为整数，取值范围为 `0~255`，也可以为百分比，取值范围为 `0%~100%`。参数 A 为透明度，跟 `opacity` 属性是一样的，取值范围为 `0.0~1.0`。


示例：

```css
background-color:rgba(255,0,255,1.0);
```

定义背景颜色 `background-color` 为 RGBA 颜色，因此 RGBA 颜色中的透明度也只是针对元素的背景颜色，而不会改变元素内部文本的透明度。

下面的 css 子元素以及文本内容都会受到影响。
```css
{
  background-color:rgb(255, 0, 255);
  opacity:0.3;
}
```

## 伪类

**1.首先了解一下链接的四种状态：**
a:link - 普通的、未被访问的链接
a:visited - 用户已访问的链接
a:hover - 鼠标指针位于链接的上方
a:active - 链接被点击的时刻


这四种状态可以直接用，但是请注意
当为链接的不同状态设置样式时，请按照以下次序规则：

a:hover 必须位于 a:link 和 a:visited 之后
a:active 必须位于 a:hover 之后

```css
<!--通过background-color设置点击状态的背景颜色-->
a:link {background-color:#B2FF99;}
a:visited {background-color:#FFFF85;}
a:hover {background-color:#FF704D;}
a:active {background-color:#FF704D;}

<!--去掉下划线-->
    a{ text-decoration:none}

<!--默认方式是存在下划线的-->
    a{ text-decoration:underline}
```
