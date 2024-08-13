---
title: 其他
weight: 5
---

# 其他

## focus and tabindex 

- `div` 默认情况下是不会被 focus 的，需要 focus `div`。 可以添加 attribute `tabindex = -1`，这个表示可以 focus 但是不可以 `tab`，如果要可以 tab 那么是 `tabindex = 0`。
- `button` 默认情况下可以被 focus
- `a` 如果有 `herf` 可以被 focus，没有 `herf` 默认情况下不会被 focus。

`tabindex` 的 number 可以用来表示 focusable 和 tabable。

浏览器会从 tabindex 1 开始， tabindex 越大顺序越靠后, 数字重复就用 `parent -> child -> sibling` 的顺序 (所以对于一个区块只要分配一个值就可以了)。 tabindex 0 的顺序
会被放到最后。 例如：`1,1,2,2,2,2,3,4,5,0,0,0....`。

click 会有 focus 的， 但是没有 tab effect 边框
`display: none` 和 `visibility: hidden` 的元素是不可以 focus 的。
`document.click()` 这种模拟 click 的话, 是不会 focus 的, 可以再调用 `.focus()` 来 focus 元素。

## 伪类

**1.首先了解一下链接的四种状态：**

- `a:link`：普通的、未被访问的链接
- `a:visited`：用户已访问的链接
- `a:hover`： 鼠标指针位于链接的上方
- `a:active`：链接被点击的时刻


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

