---
title: 响应式
weight: 7
---

# 响应式

响应式的目的就是让页面在不同的设备，不同的尺寸上能够正常的合理的显示页面内容。

使用固定尺寸的方式开发页面，就会碰到尺寸不同导致页面显示不完整等问题：

- 电脑端浏览器的显示尺寸是可变的。
- 不同电脑的显示尺寸不同。
- 移动端设备屏幕小，尺寸多，浏览器的显示尺寸是固定的。
- 设备的交互方式不同，例如在电脑浏览器中的 `:hover` 在移动端是不存在的。

响应式的处理核心是基于浏览器的**显示区域的宽度**，然后来调整页面中元素的布局和尺寸。

响应式处理，变化的主要是三个方面：

1. 元素尺寸
   - 文字、图片
2. 布局结构
3. 交互方式

## 利用单位实现元素的逐步变化

实现元素尺寸的逐步变化，最常用的单位就是 `%` 和 `vh`、`vw` 等视窗单位。如果想要元素跟随父元素的尺寸逐步变化，那么可以使用 `%` 来实现。如果想要元素跟随视窗的尺寸逐步变化，那么可以使用 `vh`、`vw` 等视窗单位来实现。

`vh` 和 `vw` 相对于浏览器整个显示区域的尺寸，但是对于移动端设备，这个尺寸是包括地址栏和功能栏的。例如，一个元素设置了 `100vh` 的高度，在移动端浏览器中，元素的一部分是会被地址栏工具栏覆盖的。这个时候就可以使用移动端专用的视窗单位：

- `lvh`、`lvw`：`l` 表示 `large`。
- `svh`、`svw`：`s` 表示 `small`。
- `dvh`、`dvw`：`d` 表示 `dynamic`。


详细的使用方式：[CSS 新 Viewport 视口单位 svh、lvh 和 dvh](https://mybj123.com/18660.html)

### 文字大小的逐步变化

文字大小的尺寸设置一般是用 `px`，`em` 和 `rem`，这三种单位都可以算是固定单位。因为 `em` 是相对于父元素的字体大小。`rem` 是相对于根元素（`html` 标签）的字体大小。也就是说如果父元素或者根元素的字体大小不变，那么利用 `em` 或 `rem` 设置尺寸的元素的内部元素的文字大小肯定也不会变化。

如果想要文字的尺寸逐步变化，那么可以使用 `vh`、`vw` 等视窗单位来实现。

> 通常，文字是不需要根据页面尺寸变化而变化的。

## Flex 布局和 Grid 布局中元素的逐步变化

Flex 布局和 Grid 布局中的子元素都是可以缩放的。

Flex 布局子元素的逐步变化主要是利用两个属性：

- `flex-grow`：默认值 0。占据剩余空间的份数。`flex-grow: 1` 就表示占据剩余空间的 1 份。
- `flex-shrink`：默认值 1。当子元素的大小超过了主轴或者侧轴，那么设置了 `flex-shrink` 的子元素就会自动收缩。如果设置了换行，那么这个属性就没有用了。

Grid 布局子元素的逐步变化主要时在划分网格时，`grid-template-columns` 和 `grid-template-rows` 值的设定使用 `fr` `%` `auto` 等单位。


## 媒体查询

媒体查询是 CSS3 中新增的特性，用于根据不同的设备类型，设置不同的样式。

媒体查询最常用的媒体特征：

- `min-width`：大于等于指定宽度。
- `max-width`：小于等于指定宽度。

语法：

```css
@media not|only mediatype and (mediafeature and|or|not mediafeature) {
  CSS-Code;
}
```

`mediatype` 媒体类型：

- `all`：所有设备。
- `print`：用于打印机和打印预览。
- `screen`：用于电脑屏幕，平板电脑，智能手机等。。
- `speech`：应用于屏幕阅读器等发声设备。

`only` 是为了兼容旧版本的浏览器，如果不写，默认就是 `only`。

媒体查询 Level4 已经支持符号 `<=`，不支持 `=>`，这种语法更直观，但是由于比较新，老版本的浏览器可能不兼容：

```css
/* 等同于 @media (max-width: 480px) */
@media (width <= 480px) {

}

/* 等同于 @media (min-width: 640px) and (max-width: 1200px) */
@media (640px <= width <= 1200px) {
  h1 {
    color: #66bbff;
  }
}

```

> mediafeature 媒体特征，必须使用 `()` 包裹起来。

示例：

```css
/* 屏幕小于等于 640px 时，改变 h1 的颜色*/
@media screen and (max-width: 640px) {
  h1 {
    color: #0055bb;
  }
}

/* 屏幕大于等于 1200px 时，改变 h1 的颜色*/
@media screen and (min-width: 1200px) {
  h1 {
    color: #264D73;
  }
}

/* 屏幕大于等于 640px 并且小于等于 1200px 时，改变 h1 的颜色*/
/* 640px <= width <= 1200px */
@media screen and (min-width: 640px) and (max-width: 1200px) {
  h1 {
    color: #66bbff;
  }
}
```

当多个媒体查询同时匹配时，会按照从上到下的顺序进行匹配。也就是说最后的才会生效。

### 移动优先和桌面优先

媒体查询设置的 `max-width` 或者 `min-max` 这个宽度的分界点，称为**断点**。

常用的断点：

- 宽度 `480px` 一般是手机设备。
- 宽度 `768px` 主流平板设备的基本宽度。
- 宽度 `1024px` 主要是大尺寸平板设备，或者比较老的笔记本。
- 宽度 `1280px` 笔记本电脑。
- 宽度 `1440px` 台式机显示器。

一般选择三个断点就够了，通常是 `480px`、`1024px`、`1440px`。

常用的断点设置的模式有两种，一种是**移动优先**，一种是**桌面优先**。

#### 移动优先

移动优先，基础 CSS 样式是为移动端设备编写的，然后使用媒体查询 `min-width`，逐步的为更大的设备添加样式。

例如：

```css
.container {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 100px;
    grid-auto-rows: 100px;
    width: 100%;
    gap: 10px;
}

@media (min-width: 480px) {
    .container {
        grid-template-columns: 1fr 1fr;
    }
}
@media (min-width: 1024px) {
    .container {
        grid-template-columns: 1fr 1fr 1fr;
    }
}
@media (min-width: 1440px) {
    .container {
        grid-template-columns: 1fr 1fr 1fr 1fr;
    }
}
```

#### 桌面优先

桌面优先，基础 CSS 样式是为桌面电脑编写的，然后使用媒体查询 `max-width`，逐步的为更小的设备添加样式。

例如：

```css
.container {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-template-rows: 100px;
    grid-auto-rows: 100px;
    width: 100%;
    gap: 10px;
}

@media (max-width: 1440px) {
    .container {
        grid-template-columns: 1fr 1fr 1fr;
    }
}
@media (max-width: 1024px) {
    .container {
        grid-template-columns: 1fr 1fr;
    }
}
@media (max-width: 480px) {
    .container {
        grid-template-columns: 1fr;
    }
}
```

### 媒体查询的引入方式

通常会把媒体查询的样式 `@media` 放到单独的 CSS 文件中（`queries.css`），然后在需要使用媒体查询的地方，使用导入 CSS 文件。

还可以在 `style` 标签上使用 `media` 属性引入媒体查询的 CSS 文件，例如：

```html
<style media="(min-device-width: 300px) and (max-device-width: 500px)">
  .box {
    width: 100px;
    height: 100px;
    background-color: cadetblue;
  }
</style>
```

还有一种方式是在 `link` 标签上使用 `media` 属性引入媒体查询的 CSS 文件，例如：

```html
<head>
    <link
      rel="stylesheet" href="./style1.css"
      media="(min-device-width: 300px) and (max-device-width: 500px)"
    />
</head>
```

最后，使用 `@import` 属性引入媒体查询的 CSS 文件，例如：

```html
@import url="./queries.css" screen and (max-width: 500px);
```

## 容器查询

容器查询是一种 CSS 特性，主要根据元素所在的容器父元素的大小来设置样式，而不是整个视窗。

容器查询包含 `container-type`、`container-name` 和 `container` 三个属性。`container` 是 `container-type` 和 `container-name` 的简写属性。

例如，定义一个容器：

```css
.parent {
    background-color: blueviolet;
    height: 300px;
    width: 50vw;
    container-type: size;
}
.child {
    background-color: aqua;
    width: 100%;
    height: 100px;
}
@container (min-width: 320px) {
    .child {
        background-color: red;
    }
}

```

上面的示例，`@container` 是如何知道要查询哪个容器？

就是声明了 `container-type` 这个属性，就意味着告诉浏览器，在该元素上创建一个容器上下文，之后可能要查询此容器。

`container-type` 属性有三个可选值：

- `normal`：默认值。
- `size`：表示容器查询时，既可以查询高度，也可以查询宽度（`@container (max-height: 800px) and (max-width: 800px)`）
- `inline-size`：表示容器查询时，只能查询文字书向的尺寸，通常元素内部的文字都是水平方向书写的，也就是查询宽度。可以使用 `writing-mode` 修改文字的书写方向。


`container-name` 用来指定当前容器所对应的容器查询的名称。例如：

```css
.parent {
    background-color: blueviolet;
    height: 300px;
    width: 50vw;
    container-type: size;
    container-name: my-container;
}
/* 指定查询名称为 my-container 的容器 */
@container my-container (max-width: 800px) {} 
```

这两个属性组合起来，例如：

```css
.parent {
  container: size / my-container;
  /* 
  * 等价于
  * container-type: size;
  * container-name: my-container;
  */
}

```

### 容器查询的单位

`cqw`：容器查询宽度（Container Query Width）占比。`1cqw` 等于容器宽度的 `1%`。例如容器宽度是 `1000px`，则此时 `1cqw` 对应的计算值就是 `10px`。
`cqh`：容器查询高度（Container Query Height）占比。`1cqh` 等于容器高度的 `1%`。
`cqi`：表示容器查询文字书写方向的尺寸（Container Query Inline-Size）占比。这个是逻辑属性单位，默认情况下等同于 `cqw`。
`cqb`：容器查询垂直于文字书写方向尺寸（Container Query Block-Size）占比。同上，默认情况下等同于 `cqh`。
`cqmin`：容器查询较小尺寸的（Container Query Min）占比。取 `cqw` 和 `cqh` 中较小的一个。
`cqmax`：表示容器查询较大尺寸的（Container Query Min）占比。取 `cqw` 和 `cqh` 中较大的一个。


## 图片的处理

图片在做响应式处理时，是比较特殊的。图片一般分两类，**矢量图**（`svg`）和**位图**（`jpg`、`png`、`gif` 等）。矢量图不管放大还是缩小都不会影响显示的。但是位图随着放大超过自身的分辨率，是会变的模糊的。

所以对于位图，一般会使用 `@media` 媒体查询来处理。对于不同显示尺寸，准备不同分辨率的图片。

为什么不准备一个高分辨率的图片，而是准备多个分辨率的图片？

对于显示尺寸较小的设备，加载大分辨率的图片，图片可能几兆甚至十几兆，这会导致页面加载速度变慢，并且客户端访问时会去服务器下载，耗费大量的服务器带宽。

### 如何准备不同分辨率的图片

如果一个图片在页面上展示的尺寸是 `400px*300px`，那么根据屏幕的 DPR 来计算实际需要的图片的分辨率。

如果屏幕的 DPR 是 1，那么需要的图片分辨率就是 `400px*300px`。如果屏幕的 DPR 是 2，那么需要的图片分辨率就是 `800px*600px`。

```
需要展示的尺寸（逻辑像素）* 屏幕 DPR => 需要的图片原始分辨率
```

### 图片响应式处理

图片响应式处理主要有四种方式

#### img 标签

`<img>` 标签引入了 `srcset` 属性，`srcset` 属性用来指定多张图片，适应不同像素密度的屏幕。

示例：

```html
<img src="small-640.jpg"
    srcset="
    small-640.jpg 640w,
    medium-1280.jpg 1280w,
    large-1920.jpg 1920w"
    alt="">
```

上面的示例 `srcset` 属性给出了三个图片 URL，适应三种不同的像素密度。图片 URL 空格后面的是**像素密度描述符**或者**宽度描述符**（如 `640w`，`w` 表示 `width`。）。

像素密度描述符，格式是`像素密度倍数（DPR） + 字母x`。`1x` 表示单倍像素密度，可以省略。浏览器根据当前设备的像素密度（DPR），选择需要加载的图片。

> 如果 `srcset` 属性中的图片都不满足条件，那么就加载 `src` 属性指定的默认图片。

像素密度的适配，是根据整个屏幕的宽度来计算的，这样可能会导致实际使用的图片分辨率会比需要的分辨率大很多。例如：

```html
<img src="small-640.jpg"
    srcset="
    small-640.jpg 640w,
    medium-1280.jpg 1280w,
    large-1920.jpg 1920w"
    style="width: 50%"
    alt="">
```

图片设置了宽度为 `50%`，实际使用的图片分辨率会大很多。这时就需要使用 `sizes` 属性。

`sizes` 属性列出不同设备的图片显示宽度.

`sizes` 属性的值是一个逗号 `,` 分隔的字符串，除了最后一部分，前面每个部分都是一个放在括号里面的**媒体查询表达式**，后面是一个空格，再加上图片的显示宽度。

```html
<img srcset="foo-160.jpg 160w,
             foo-320.jpg 320w,
             foo-640.jpg 640w,
             foo-1280.jpg 1280w"
     sizes="(max-width: 440px) 100vw,
            (max-width: 900px) 33vw,
            254px"
     src="foo-1280.jpg">
```

`sizes` 属性给出了三种屏幕条件，以及对应的图片显示宽度。宽度不超过 `440px` 的设备，图片显示宽度为 `100%`；宽度 `441px` 到 `900px` 的设备，图片显示宽度为 `33%`；宽度 `900px` 以上的设备，图片显示宽度为 `254px`。

浏览器根据当前设备的宽度，从 `sizes` 属性获得图片的显示宽度，然后从 `srcset` 属性找出最接近该宽度的图片，进行加载。

例如当前设备的屏幕宽度是 `480px`，浏览器从 `sizes` 属性查询得到，图片的显示宽度是 `33vw`（即 `33%`），等于 `160px`。`srcset` 属性里面，正好有宽度等于 `160px` 的图片，于是加载 `foo-160.jpg`。

#### picture、source、img 标签组合

如果要同时考虑屏幕尺寸和像素密度的适配，就要用到 `<picture>` 标签。

```html
<picture>
  <source srcset="homepage-person@desktop.png,
                  homepage-person@desktop-2x.png 2x"       
          media="(min-width: 990px)">
  <source srcset="homepage-person@tablet.png,
                  homepage-person@tablet-2x.png 2x" 
          media="(min-width: 750px)">
  <img srcset="homepage-person@mobile.png,
               homepage-person@mobile-2x.png 2x" 
       alt="Shopify Merchant, Corrine Anestopoulos">
</picture>
```

浏览器按照 `<source>` 标签出现的顺序，依次判断当前设备是否满足 `media` 属性的媒体查询表达式，如果满足就加载 `srcset` 属性指定的图片文件，并且不再执行后面的 `<source>` 标签和 `<img>` 标签。

> `<img>` 标签是默认情况下加载的图片，用来满足上面所有 `<source>` 都不匹配的情况。

`<picture>` 标签还可以用来选择不同格式的图片。比如，如果当前浏览器支持 Webp 格式，就加载这种格式的图片，否则加载 PNG 图片。

```html
<picture>
  <source type="image/svg+xml" srcset="logo.xml">
  <source type="image/webp" srcset="logo.webp"> 
  <img src="logo.png" alt="ACME Corp">
</picture>
```

浏览器按照 `<source>` 标签出现的顺序，依次检查是否支持 `type` 属性指定的图片格式，如果支持就加载图片，并且不再检查后面的 `<source>` 标签了。

#### CSS

CSS 媒体查询，CSS 样式只针对背景图片。

## 移动端响应式

声明视窗的大小：`<meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no">`

- `viewport` 声明视窗。**只适用于移动端**。
- `width=device-width` 宽度等于设备宽度。
- `initial-scale=1` 初始化比例是 1。
- `minimum-scale=1` 最小的缩小比例是 1。
- `maximum-scale=1` 最大的放大比例是 1。
- `user-scalable=no` 用户不允许缩放。

### 物理分辨率和逻辑分辨率

屏幕的发展，最初是以像素为单位，像素越多，屏幕尺寸也越大，这是一种物理性的变大。但是物理的变大时有限制的，不能过大，所以后来出现了在同样尺寸下放入更多的像素的技术，例如苹果的 Retina 显示屏（高倍屏），5K 的显示屏分辨率是 `5120*2880`，而普通屏幕的在同样的尺寸下分辨率是 `2560*1440`。

如果我们用高倍屏去显示内容，那么就会出现一个问题，就是内容会变小。

例如下图，如果按照 `1:1` 的比例去显示，在普通屏幕上占 6 个像素的图片，放到高倍屏还是占据 6 个像素，按照这个逻辑，同样的内容，在高倍屏上显示差不多就是 `1/4`。

![physical-resolution](https://github.com/shipengqi/illustrations/blob/c0efa82375c756099df82a5c948cb093c3f2014b/frontend-learn/basic/physical-resolution.png?raw=true)

那么这显然是不合理的，所以操作系统层面就出现了**逻辑分辨率**，就是一个虚拟的分辨率。对应屏幕的**物理分辨率**。逻辑分辨率就是为了让高倍屏和普通屏在显示内容时能显示出一样的大小。

如下图，如果一张图片占 6 个像素，那么在高倍屏时，操作系统会根据高倍屏的逻辑分辨率，把这张图片放大到 24 个像素，这样就不会出现内容变小的情况。

![logical-resolution](https://github.com/shipengqi/illustrations/blob/c0efa82375c756099df82a5c948cb093c3f2014b/frontend-learn/basic/logical-resolution.png?raw=true)

**设备像素比**就是逻辑分辨率的宽度（高度）除以物理分辨率的宽度（高度）。对于移动端设备，设备像素比可能更高。设备像素比可以在浏览器的控制台查看，输入 `devicePixelRatio` 回车即可。

### 移动端适配

不同的移动端设备分辨率，尺寸都不同，可以先针对一种设备，以 iphone6 为例，设计好页面的样式之后，设置 `content="width=375,user-scalable=no"`，禁止用户缩放，指定宽度为 iphone6 的宽度，那么不同分辨率的设备（移动端）都会自适应这个宽度。

