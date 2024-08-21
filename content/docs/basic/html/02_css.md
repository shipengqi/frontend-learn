---
title: CSS 属性
weight: 2
---

# CSS 属性

## 选择器

### 优先级

CSS 选择器优先级：`ID > Class > Tag > *`

## 容器属性

### 盒子模型属性

一个元素的组成：`内容` + `内边距` + `边框` + `外边距`

- `width` 和 `height` 定义宽高。
- `padding` 内边距，定义内容和边框的间距。
- `border` 定义边框。
- `margin` 外边距，定义边框和其他元素的间距。

`box-sizing`：盒子模型默认是 `box-sizing: content-box`。
  - `border-box`：不会因为 `border`、`padding` 而改变元素的大小，会改变内容的大小。例如定义了元素的宽高都为 `300px`，那么 `内容` + `内边距` + `边框` 就是 `300px`。
  - `content-box`：默认值，会因为 `border` 和 `padding` 而改变大小，但是不会改变内容的大小。例如定义了元素的宽高都为 `300px`，内容的宽高就是 `300px`，不包含 `内边距` 和 `边框`。

### 元素类型 (块级/行级/行块)


`div` 默认就是**块级元素**，浏览器会自动给 `div` 添加 `display: block` 的属性 （user agent stylesheet 就是浏览器添加的属性）。

- **块级元素**（`div` `p`）：默认会**占据一整行**，可以定义宽高。包含 `display: block` 的属性。定义宽高以后仍然会占据一整行，元素的宽度不够一整行，那么剩下的会是外边距来占满一整行。
- **行级元素**（`span`）：会**根据内容自身的大小来占据大小，没有宽高**。也就是说对行级元素设置宽高是无效的。另外包含 `display: inline` 的属性也是行级元素。也可以通过添加 `display: block` 的属性来变成块级元素。
- **行块元素**：**不会占据一整行，但是可以有宽高**，包含 `display: inline-block` 属性的元素就是行块元素。

### 背景

- `background`：复合属性，`background: {color} {image} {repeat} {position} {size}`。
- `background-clip`：背景的绘制区域。
  - `border-box`：默认值，边框区域
  - `padding-box`：内边距区域
  - `content-box`：内容区域
- `background-color`：背景颜色。设置单色背景时有效。对图片背景，渐变背景无效。
- `background-image`：背景图片。
- `background-repeat`：背景重复，对图片背景有效。
  - `no-repeat`：不重复
  - `repeat`：重复
  - `repeat-x`：只重复水平方向
  - `repeat-y`：只重复垂直方向
- `background-origin`：背景的绘制起点，对图片背景有效。
  - `border-box`：从边框区域开始绘制
  - `padding-box`：从内边距区域开始绘制
  - `content-box`：从内容区域开始绘制
- `background-position`：绘制背景图片的位置。`left` `right` `bottom` 或者 `x y` 坐标。如果不设置这个属性，那么绘制背景会从背景图片的左上角开始绘制。设置该属性，例如 `background-position: 10px 10px`，会根据 `background-origin` 的值，再偏移 `10px 10px` 位置开始绘制。`left` 就是从背景图片左侧居中的位置开始绘制。`right bottom` 就是右下角位置开始绘制。
- `background-size`：背景大小。背景图片的大小可以大于或者小于绘制背景的区域，这个时候就可以设置该值俩调整背景图片的显示。
  - `cover`：横向或者纵向等比例缩放背景图片，完整的覆盖整个背景绘制区域。多余的部分就不显示了。
  - `contain`：横向或者纵向等比例缩放背景图片去放到背景绘制区域。
  - `{width} {height}`：背景大小。
- `background-attachment`：背景是否固定，`scroll` 滚动，`fixed` 固定。


#### 多层背景

背景是可以设置多层的：`background: linear-gradient(yellow, orange), url(1.jpg), url(2.jpg), red`。

上面的示例就设置成了一个四层背景。越靠前的背景会覆盖后面的背景。单色背景的优先级是最低的（跟顺序无关），并且只能设置一个。


### 盒子阴影

`box-shadow`：`{x 偏移值} {y 偏移值} {模糊度} {扩散} {颜色} {内阴影}`，`box-shadow: 10px 0 0 red,10px 0 0 red;` 多组值，会有一个渐变的效果。可以配合动画实现闪光的效果。

## 字体属性

- 声明使用的字体：`font-family`，取决于系统是否安装有对应的字体，例如 微软雅黑，黑体等。
- 字体样式：`font-style`，`normal` 默认的样式。
  - `italic` 斜体
- 字体大小，`font-size`。
- 字体颜色，`color`。
- 字体的粗细，`font-weight`，值可以是 `100-900` 或者 `bold/bolder/lighter/normal`，取决于系统是否安装有对应的字体。
- 字体排布，`text-algin` 值可以是 `center/left/right`。
- 字体行高，`line-height`，设置一行文字的高度。
- 字体修饰：`text-decoration`
  - `underline` 下划
  - `overline` 上划线
  - `line-through` 删除线
- 字体阴影：`text-shadow`，`text-shadow: {x 偏移值} {y 偏移值} {模糊度} {颜色}`，`text-shadow: 10px 0 0 red,10px 0 0 red;` 多组值，会有一个渐变的效果。可以配合动画实现闪光的效果。

> 所有的字体属性都会继承父元素的字体属性，所以在 `html` 元素上设置字体属性，会使所有的元素都会默认继承 `html` 上的字体属性。

### 字体设置

`font-family` 设置的字体可以分为两类

- 系统已经安装的字体。
- 远程获取的字体。

`font-family` 可以设置多个值，用逗号隔开。例如：`font-family: "微软雅黑", "黑体", "宋体", "楷体", "Arial";`。这里会先去匹配第一个字体，如果没有，就会去匹配第二个字体，以此类推。全都没有就会使用默认的字体。一般情况下，会把比较常见的，大部分系统都有的字体放到后面，起到一个保底的作用。

对于不同的系统，可能默认的字体都不太一样，如果想要简单使用系统的默认字体，就可以使用关键字 `system-ui`，`font-family: system-ui`。前提是浏览器支持。

对于远程获取的字体，尽量避免使用，尤其时中文字体，体积较大，会导致网站加载较慢。

引入在线字体：

```html
<head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com.css2?family=Matemasie&display=swap" rel="stylesheet">
  <!-- 注意要放在自己的 css 文件前面 -->
  <link rel="stylesheet" href="./style.css">
</head>

<!-- 或者 -->
<head>
  <style>
    @import url('https://fonts.googleapis.com.css2?family=Matemasie&display=swap')
  </style>
  <!-- 注意要放在自己的 css 文件前面 -->
  <link rel="stylesheet" href="./style.css">
</head>
```

对于在线字体最好的方式就是先下载下来，放到自己的项目中再引用。参考下面的字体图标。

```css
@font-face {
  /* font-display */
  /* 常用的可选值
      block 字体文件加载时，显示空白
      swap  字体文件加载时，显示备用字体，加载完成后切换
      fallback  字体文件加载时，开始的很短的一段时间比如 100ms 会显示空白，如果短时间加载完成就切换，如果加载时间过长就不会再切换 */
}
```

### 字体图标

字体图标是用特殊的字体来显示图标，代替图片。

字体图标的优势：

1. 可以使用字体属性，随时调整大小和颜色。
2. 图标调整大小，不会因为过大而失真，因为字体是矢量图。
3. 字体文件 size 普遍小于图片，可以降低服务器的带宽压力。

使用字体图标的方式：

首先需要在 [iconfont](https://www.iconfont.cn/) 下载字体图标。


#### Unicode

这个是最原始的方式，兼容性最好，支持 IE6+，以及所有现代浏览器。支持字体属性，但是由于是字体，所以不支持多色。只能使用单色图标。

> 注意：新版 iconfont 支持两种方式引用多色图标：SVG symbol 引用方式和彩色字体图标模式。（使用彩色字体图标需要在「编辑项目」中开启「彩色」选项后并重新生成。）

使用步骤如下：

```html
<style type="text/css">
  /* 声明字体，src 是字体文件的路径，多个文件是针对不同的浏览器 */
  @font-face {
    font-family: 'iconfont';
    src: url('iconfont.woff2?t=1723520893571') format('woff2'),
      url('iconfont.woff?t=1723520893571') format('woff'),
      url('iconfont.ttf?t=1723520893571') format('truetype');
    /* font-display */
    /* 可选值
       block 字体文件加载时，显示空白
       swap  字体文件加载时，显示备用字体，加载完成后切换
       fallback  字体文件加载时，开始的很短的一段时间比如 100ms 会显示空白，如果短时间加载完成就切换，如果加载时间过长就不会再切换 */
  }
  /* 定义使用 iconfont 的样式 */
  .iconfont {
    font-family: "iconfont" !important; /* 使用 iconfont 字体 */
    font-size: 16px;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
</style>

<!-- 挑选相应图标并获取字体编码（例如 &#x33;），应用于页面 -->
<span class="iconfont">&#x33;</span>
```
#### Font Class

主流方式。Font Class 是 Unicode 使用方式的一种变种，兼容性良好，兼容 IE8+，和所有现代浏览器（IE8 以上才支持伪元素）。

Font Class 解决了 Unicode 书写不直观，语意不明确的问题。可以很容易分辨这个 icon 是什么。因为使用 class 来定义图标，所以当要替换图标时，只需要修改 class 里面的 Unicode 引用。

使用步骤如下：

```html
<!-- 引入项目下面生成的 fontclass 代码 -->
<link rel="stylesheet" href="./iconfont.css">

<!-- 挑选相应图标并获取类名，应用于页面 -->
<span class="iconfont icon-xxx"></span>
```

Font Class 就是使用了 `:before` 伪元素来实现的。

例如：

```css
.icon-mtiIcon-yingyongshebei-fangbaocha:before {
  content: "\e713";
}
```

#### Symbol

未来的主流方式。这种其实是做了一个 svg 的集合。支持多色图标，支持字体属性，但是兼容性较差。浏览器渲染 svg 的性能一般。


## 转换

### 2D 转换

2D 转换有 2 个轴, `x`，`y`。

- **平移**：`transform: translate(x, y)`，`x` 和 `y` 可以分开设置（`transform: translateX(200px)` `transform: translateY(100px)`）
- **旋转**：`transform: rotate(x)`，`transform: rotate(30deg)` 顺时针旋转 `30` 度，负数就是逆时针旋转。

### 3D 转换

3D 转换实现 3D 立体效果，有 3 个轴, `x`，`y`，`z`。

- **透视点**：眼睛与屏幕之间的距离。`perspective` （`perspective: 1000px`）意思是距离屏幕 1000 像素点的距离（一般在 `<body>` 上设置透视点）。透视点的位置默认是屏幕的正中央，`perspective-origin` 可以修改透视点的位置，例如 `perspective-origin: left buttom` 将透视点的位置改为左下。如果子元素需要保留 3D 效果，需要单独设置 `transform-style: preserve-3d`（一般在实现 3D 效果的子元素上设置 `transform-style: preserve-3d`）。
- **平移**：`transform: translate3d(x, y, z)`，也可以分开设置，3D 比 2D 多了一个  `translateZ(100px)`。
- **旋转**：`transform: rotate3d(x, y,z, 30deg)` 绕着 `x`，`y`，`z` 确定的轴旋转 30 度，`rotateX(45deg)` 绕着 X 轴旋转 45 度。`rotateY()` 绕着 Y 轴旋转。`rotateZ()` 绕着 Z 轴旋转。
- **放大和缩小**：
  - 放大：`transform: scale(3)` 放大 3 倍，`transform: scale(0.5, 2)` 表示水平缩小到 0.5 倍、垂直放大 2 倍。也可以分别设置 `transform: scaleX(3)` 水平放大 3 倍。`scaleY` 垂直缩放。
  - 倾斜：`transform: skew(15deg, 0deg)` 基于 X 轴倾斜 15 度，Y 轴 0 度。值可以为负数。

## 过渡和动画 

### 过渡效果

将状态从 A 变化到 B，中间的过程就可以用过渡的效果补齐。

过渡属性的格式：`transition: {过渡属性} {过渡时间} {过渡变化速度} {延迟时间}`。多个属性 `,` 分隔。

示例：

- `transition: background 2s`：背景颜色变化 2 秒。
- `transition: background 2s,width 5s`：背景颜色变化 2 秒，宽度变化 5 秒。
- `transition: background 2s 2s`：背景颜色变化 2 秒，2 秒之后才开始变化。
- `transition: all`：`all` 代表所有属性。
- `transition: all 5s linear`：`linear` 表示线性变化速度。

`transition` 也可以分开设置：
- `transition-property`：过渡属性。
- `transition-duration`：过渡时间。
- `transition-timing-function`：过渡变化的速度。默认是 `ease`。
  - `ease` 先慢后快再慢，
  - `linear` 线性。
  - `ease-in` 缓慢进。
  - `ease-out` 缓慢出。
  - `cubic-bezier` 自定义。可以在浏览器的 `cubic-bezier` 工具中修改。
- `transition-delay`：过渡延迟时间。


### 动画效果

动画效果的格式：

- `animation` 的默认值 `none 0 ease 0 1 normal none running`。
- 关键帧，`@keyframes {动画名称}`

`animation` 也可以分开设置：

- `animation-name`：定义动画名称。
- `animation-duration`：动画时间。`animation-duration` 属性是必须的，否则时长为 0，就不会播放动画了。
- `animation-delay`：延迟时间。
- `animation-timing-function`：动画速度，默认是 `ease`。
  - `ease` 先慢后快。
  - `linear` 线性。
  - `steps()` 步数。
  - `cubic-bezier()` 自定义。可以在浏览器的 `cubic-bezier` 工具中修改。
- `animation-iteration-count` 迭代次数，`infinite` 表示无限。
  - `infinite` 无限次。
  - `n` 表示 n 次。
- `animation-direction`：方向，默认是 `normal`，`alternate` 表示往返动画。
  - `normal` 默认值，正常播放。
  - `reverse` 反向播放。
  - `alternate` 往返动画。
  - `alternate-reverse` 反向往返动画。
- `animation-fill-mode`：最后填充模式，也就是动画结束时，要应用到元素的样式。默认值是 `none`。
  - `none` 不填充。
  - `forwards` 应用动画结束时最后一帧的样式。
  - `backwards` 应用动画结束时第一帧的样式。
  - `both` 遵循 `forwards` 和 `backwards` 的规则，从而在两个方向上扩展动画属性。
- `animation-play-state`：动画状态，默认值是 `running`。
  - `running` 正在播放。
  - `paused` 暂停。


示例：

```css
#div1 {
  /*3 次动画*/
  animation: demo1 2s 3; 
  /*animation: demo1 2s infinite alternate; 无限次的往返动画*/ 
}

@keyframes demo1 {
  from {
    transform: translateX(0px);
  }
  to {
    transform: translateX(500px);
  }
}

@keyframes demo2 {
    0% {
        transform: translateX(0px);
        background: red;
    }
    20% {
        transform: translateX(500px);
        background: blue;
    }
    70% {
        transform: translateX(500px);
        background: green;
    }
    100% {
        transform: translateX(500px);
        background: yellow;
    }
}
```

`@keyframes` 用来设置关键帧，动画的中间过程会被补全。`animation-timing-function` 就是设置补全动画的速度。

- `from` 和 `to` 是关键帧，`from` 是动画开始时的状态，`to` 是动画结束时的状态。
- `0%` 和 `100%` 是关键帧，`0%` 是动画开始时的状态，`100%` 是动画结束时的状态。还可以设置 `10%`，`20%` 等。

### 过渡和动画的区别

过渡的优点在于简单易用，但是它有几个很大的局限：

- 需要事件触发，所以没法在网页加载时自动发生。
- 是一次性的，不能重复发生，除非一再触发。
- 只能定义开始状态和结束状态，不能定义中间状态。
- 一条过渡规则，只能定义一个属性的变化，不能涉及多个属性。

动画通过控制关键帧来控制动画的每一步，实现更为复杂的动画效果，可以解决过渡的不足。

## 伪元素

伪元素用于创建一些不在 DOM 树中的元素，‌并为其添加样式。‌例如，‌`:before` 和 `:after` 伪元素可以在一个元素前或后增加一些文本，‌并为这些文本添加样式。‌虽然用户可以看到这些文本，但是这些文本实际上不在 DOM 树中。

[MDN Web Docs (Pseudo-elements)](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-elements)。

### `::before` `:before`

可以在元素的内容前面插入新内容。

```css
/* 在每个 h1 元素前面插入一幅图片 */
h1:before 
{
    content:url(smiley.gif);
}
```

### `::after` `:after`

可以在元素的内容之后插入新内容。

```css
/* 在每个 h1 元素后面插入一幅图片 */
h1:after 
{
    content:url(smiley.gif);
}
```

## 伪类

伪类用于当已有元素处于某个状态时，‌为其添加对应的样式。‌例如链接的四种状态：

- `a:link`：普通的、未被访问的链接。
- `a:visited`：用户已访问的链接。
- `a:hover`： 鼠标指针位于链接的上方。
- `a:active`：链接被点击的时刻。

[MDN Web Docs (Pseudo-classes)](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes)。

### 状态伪类

状态伪类是基于元素当前状态进行选择的。在与用户的交互过程中元素的状态是动态变化的。

**状态伪类的顺序很重要，顺序错误可能会导致没有效果**。

例如为链接的不同状态设置样式时，必须按照以下次序规则：

`a:hover` 必须位于 `a:link` 和 `a:visited` 之后，`a:active` 必须位于 `a:hover` 之后。

```css
<!-- 设置四种状态的背景颜色 -->
a:link { background-color:#B2FF99; }
a:visited { background-color:#FFFF85; }
a:hover { background-color:#FF704D; }
a:active { background-color:#FF704D; }
```

常用的状态伪类还有 `:focus`。


### 结构化伪类

结构化伪类是 CSS3 新增的选择器，利用 DOM 树进行元素过滤，通过文档结构的互相关系来匹配元素，可以减少 `class` 和 `id` 属性的定义，使文档结构更简洁。

例如 `:first-child` 用来选择父元素的第一个子元素。

```css
/* 第一个子元素是 p 元素 */
p:first-child
{
    color:blue;
}

/* 匹配的 p 元素中的第一个 i 元素 */
p > i:first-child
{
    color:blue;
}

/* 第一个子元素是 p 元素的任意元素中的所有 i 元素 */
p:first-child i
{
    color:blue;
}
```

## 常用单位

- `%`：百分比。
- `px`：像素单位。
- `em`：相对单位，相对于父元素的字体大小。不建议使用。`2em` 就是父元素 `font-size` 的两倍。`1em` 就是 1 倍。
- `rem`：相对单位，相对于根元素（`html` 标签）的字体大小。
- `vw`：`viewport width` 视窗宽度。`1vw` 就等于视窗宽度的 `1%`。 
- `vh`：`viewport height` 视窗宽度。`1vh` 就等于视窗高度的 `1%`。

## 颜色

### 关键字

常见的颜色关键字：`red`、`green`、`blue`、`yellow` 等等。

### 十六进制

十六进制颜色是由 6 个十六进制字符组成的。例如 `#FF0000` 表示红色。如果两个字符相同，那么可以简写为一个字符。例如 `#F00` 表示红色。

其实十六进制颜色后面还可以加两位表示透明度。例如 `#FF000080` 表示红色，透明度为 0.5。

### RGB/RGBA

RGB 是一种色彩标准，由红（Red）、绿（Green）、蓝（Blue）3 种颜色变化来得到各种颜色。而 RGBA，其实就是在 RGB 基础上增加了一个透明度 Alpha。

```css
rgb(R, G, B)
rgba(R, G, B, A)
```

R，指的是红色值（Red）；G，指的是绿色值（Green）；B，指的是蓝色值（Blue）；A，指的是透明度（Alpha）。

R、G、B 这三个可以为整数，取值范围是 `0~255` 或者 `0%~100%`。参数 A 为透明度，取值范围为 `0.0~1.0`。

### HSL/HSLA

HSL 是一种色彩标准，由色相（Hue）、饱和度（Saturation）、亮度（Lightness）3 种颜色变化来得到各种颜色。A 为透明度，取值范围为 `0.0~1.0`。

```css
hsl(H, S, L)
hsla(H, S, L, A)
```

### 颜色的透明度和 opacity 的区别

十六进制颜色，RGBA，HSLA，`opacity` 属性都可以设置透明度。颜色透明度和 `opacity` 的区别是：

- 在元素中使用了 `opacity`，那么其后代元素都会受其影响。
- RGBA 等颜色透明度可以为颜色单独设置透明度，不影响整个元素的透明度，也不会影响到元素的其他属性。


示例：

```css
/* 设置背景颜色的透明度，而不会影响整个元素 */
background-color:rgba(255,0,255,1.0);

/* bg 后代元素以及文本内容都会受到影响 */
.bg {
  background-color:rgb(255, 0, 255);
  opacity:0.3;
}
```

## CSS 值的类型

CSS 值的类型可以分为三类：

- 特定关键字：例如颜色关键字，例如 `red`、`green`、`blue` 等。
- 自定义值：例如 `100px`、`200px` 等。
- 全局值：例如 `inherit`、`initial`、`unset` 等。
  - `inherit`：继承父元素的属性。继承可以分为**默认继承**（指的是子元素没有设置对应属性，就会继承父元素的属性，大部分属性都不会默认继承，默认继承的主要是文字属性）和**主动继承**。
  - `initial`：将元素的属性重置为默认值。
  - `unset`：会根据属性是不是可继承的来决定应用 `inherit` 还是 `initial`。
