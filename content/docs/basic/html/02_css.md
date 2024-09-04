---
title: CSS 常用属性
weight: 2
---

# CSS 常用属性

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
- **行内元素**（`span`）：会**根据内容自身的大小来占据大小，没有宽高**。也就是说对行内元素设置宽高是无效的。另外包含 `display: inline` 的属性也是内级元素。也可以通过添加 `display: block` 的属性来变成块级元素。
- **行块元素**：**不会占据一整行，但是可以有宽高**，包含 `display: inline-block` 属性的元素就是行块元素。

一个元素一旦成为了弹性布局或者网格布局的直接子元素，那么该元素之前的模式会失效，例如：

```html
<div style="display: flex">
  <span style="height: 100px;width: 100px"></span>
</div>
```

上面的 `span` 尽管是一个行内元素，但是可以设置宽高。

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


## 常用单位

### 绝对单位

- `px`：像素单位。
- `pt`、`in`：打印单位。

### 相对单位

- `%`：百分比。占父元素宽度或高度的百分比。
- `em`：相对于父元素的字体大小。不建议使用。`2em` 就是父元素 `font-size` 的两倍。`1em` 就是 1 倍。
- `rem`：相对于根元素（`html` 标签）的字体大小。`2rem` 就是根元素 `font-size` 的两倍。不仅可以用来设置字体大小，也可以用设置宽高。最终都会换算成 `px`。
- `vw`：`viewport width` 视口单位，视口指的是浏览器的显示区域。视口宽度。`20vw` 就是视口宽度的 `20%`。
- `vh`：`viewport height` 视口单位，视口高度。`1vh` 就等于视口高度的 `1%`。
- `vmin`、`vmax`：`vmin` 是选择视口宽度或者高度中较小的那个。`vmax` 是选择视口宽度或者高度中较大的那个。例如 `30vmax` 当浏览器显示区域的高度大于宽度时，那就表示视口高度的 `30%`。不常用。
- `svh` `lvh` `dvh` `svw` `lvw` `dvw`：移动端单位。

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


## 变量

声明变量，变量名前加 `--`，变量名大小写敏感：

```css
body {
  --foo: #7F583F;
  --bar: #F7EFD2;
}
```

上面的示例声明了两个变量：`--foo` 和 `--bar`。

用 `--` 表示变量是因为 `$` 被 Sass 用掉了，`@` 被 Less 用掉了。为了不产生冲突，官方的 CSS 变量就改用 `--` 了。

### var 函数

`var()` 函数用于读取变量。

```css
a {
  color: var(--foo);
  text-decoration-color: var(--bar);
}
```

`var()` 函数使用第二个参数，表示变量的默认值（例如 `color: var(--foo, #7F583F);`）。如果该变量不存在，就会使用这个默认值。

数值与单位直接写在一起，是无效的：

```css
.foo {
  --gap: 20;
  /* 无效 */
  margin-top: var(--gap)px;
}
/* 必须使用calc()函数 */
.foo {
  --gap: 20;
  margin-top: calc(var(--gap) * 1px);
}
```

### 作用域

同一个 CSS 变量，可以在多个选择器内声明。读取的时候，优先级最高的声明生效。这与 CSS 的"层叠"（cascade）规则是一致的。

```css

<style>
  :root { --color: blue; }
  div { --color: green; }
  #alert { --color: red; }
  * { color: var(--color); }
</style>

<p>蓝色</p>
<div>绿色</div>
<div id="alert">红色</div>
```

**变量的作用域就是它所在的选择器的有效范围**。

```css
body {
  --foo: #7F583F;
}

.content {
  --bar: #F7EFD2;
}
```

变量 `--foo` 的作用域是 `body` 选择器的生效范围，`--bar` 的作用域是 `.content` 选择器的生效范围。

全局的变量通常放在根元素 `:root` 里面：

```css
:root {
  --main-color: #06c;
}
```
