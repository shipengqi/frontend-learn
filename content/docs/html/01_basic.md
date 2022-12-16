# 基础

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
`h1-h6` 标题，块级标签，占据一行
`div` 块级容器标签
`ul` 无序列表
`ol` 有序列表
`a` 链接，`<a href="#element-id">` 可以进行页面内位置的跳转。
`form` 表单标签，
  `action` 属性是提交的页面（例如 `https://www.baidu.com/s` ）
  `method` 提交的方法，`get` 提交的数据会在链接上显示，一般用来搜索，`post` 提交的数据在 body 里面

## css 常用属性
### 容器属性

1. 盒子模型属性
2. 元素类型 (块级/行级/行块/弹性元素)
3. 宽高/边框/内边距/外边距
4. 背景/背景颜色/背景图片
5. 定位/绝对定位/相对定位/固定定位
6. 浮动布局/清除浮动
7. 弹性布局
8. 盒子阴影



盒子模型：内容+内边距+外边距

`width` 和 `height` 定义的是内容的宽高。
`padding` 是内容和边框的间距。
`border` 定义边框
`margin` 定义边框和其他元素的间距。

`box-sizing`：盒子模型默认是 `box-sizing: content-box`
  `border-box`：不会因为 `border` `padding` 而改变元素的大小，会改变内容的大小。
  `content-box`：默认值，会因为 border 和 padding 而改变大小，但是不会改变内容的大小。


`div` 默认就是块级元素，浏览器会自动给 `div` 添加 `display: block` 的属性 （user agent stylesheet 就是浏览器添加的属性）。

块级元素（`div` `p`）：默认会占据一整行，可以定义宽高。包含 `display: block` 的属性。定义宽高以后仍然会占据一整行，元素的宽度不够一整行，那么剩下的会是外边距来占满一整行。
行级元素（`span`）：会根据内容自身的大小来占据大小，没有宽高。包含 `display: inline` 的属性就是行级元素。也可以通过添加 `display: block` 的属性来变成块级元素。
行块元素：不会占据一整行，但是可以有宽高，包含 `display: inline-block` 的属性就是行块元素。


浮动布局：

1. 可以解决文字包围图片的样式
2. 可以让元素向左或者向右靠拢
3. 可以解决一些边距问题

`float: left/right;` 会让元素脱离文档流。

**元素之间的多个空白，会合并成一个空格**。如果不处理会出现一些莫名其妙的间距。用浮动就可以解决这个问题。元素脱离了文档流，空白也就默认被忽略了。
并且会仅仅靠近父元素的边缘，或者同样是浮动元素的边缘。

浮动的弊端，会导致父元素的高度塌陷。
比如 `div` 块容器会占一整行，如果该元素里面包含有浮动元素，会导致该元素的高度没有了。
因为浮动元素脱离了文档流，父元素会认为没有子元素，高度也就没有了。

解决方式：
1. 设置父元素的高度（前提是父元素的高度是已知的）。
2. 父元素的高度位置的情况下，可以通过清除浮动的方式，原理就是让父元素重新计算元素的高度。
   1. 在父元素最后添加一个子元素 `div`，并给子元素添加属性 `clear: both;`
3. 终极方案：原理与上个方法一样，通过伪元素来清除浮动。

```css
  .parent {
    ...
  }
  .parent:after{
    content: "";
    display: block;
    clear: both;
  }
```

给父元素的类（例如 `parant`） 添加一个 `:after` 伪元素。



弹性布局:

`display: flex`：如果一个元素的设置了这个属性（弹性容器），那么他的**直接子元素**（孙子元素就不是弹性布局），就会按着弹性布局的方式来布局。

```html
<head>
  <style>
    .parent {
      display: flex;
      width: 800px;
    }
    .child {
      width: 200px;
    }
  </style>
</head>
<body>
  <div class="parent">
    <div class="child"></div>
    <div class="child"></div>
    <div class="child"></div>
  </div>
</body>
```

如果 `parent` 不是弹性布局，那么三个 `child` 都是块元素，每个元素会占据一整行。但是 `parent` 添加了 `display: flex;`
属性以后，三个子元素会在一行并排显示，不会有间距。`parent` 还是块级布局。



弹性主轴：默认是水平向右，可以修改为水平向左或竖直向上，竖直向下

弹性侧轴：默认是竖直向下，可以修改为竖直向上或水平向左，水平向右，


**弹性布局的子元素默认是在主轴上一行或者一竖，不会换行，如果一行子元素的宽度或者高度超过了父元素，所有的子元素就会等比例缩小**。

设置主轴方向：
`flex-derection: row`：默认是 `row`， 水平向右。`column` 竖直向下。`row-reverse` 水平向左。`column-reverse` 竖直向上。

设置主轴的排布
`justify-content:flex-start`：默认是 `flex-start` 靠近主轴的起点。`flex-end` 靠近主轴的终点。`center` 主轴居中。
`space-between` 平均分布，和主轴的起点和终点没有间距。`space-around` 平均分布，和主轴的起点和终点有间距，两边的间距是中间的一半。
`space-evenly` 平均分布，间距一致。

设置侧轴的排布：
`align-items: stretch`：默认是 `stretch` 拉伸，如果子元素没有设置高度或宽度，那么子元素会被拉伸到和父元素一样的高度或宽度。
`flex-start` 靠近侧轴的起点。`flex-end` 靠近侧轴的终点。`center` 侧轴居中。侧轴没有平均分布。

换行：
`flex-wrap: nowrap`：默认是 `nowrap`，不换行。`wrap` 换行，如果侧轴排布是 `stretch`，换行以后是两行，那么两行会被拉伸，各占一半。

多行的侧轴分布：
`align-cintent: flex-start`：`flex-start` 多行都向侧轴的起点靠拢。`flex-end` 多行都向侧轴的终点靠拢。`center` 多行居中。
`space-around` 平均分布，和侧轴的起点和终点有间距，两边的间距是中间的一半。`space-between` 平均分布，和侧轴的起点和终点没有间距。
`space-evenly` 平均分布，间距一致。

单独设置一个子元素侧轴的分布，主轴不能单独设置一个子元素的分布：
子元素添加属性 `align-self:flex-start`：`flex-start` 靠近侧轴的起点。`flex-end` 靠近侧轴的终点。`center` 侧轴居中。


设置子元素的排序：
给每个子元素添加 `order: {num}` 属性，子元素会沿主轴方向从小到大排序。

子元素剩余空间配置：
给子元素添加属性 `flex: {num}`。`flex: 1`：剩余空间分成 1 份，并占据，也就是占满剩余空间。

```html
<head>
  <style>
    .parent {
      display: flex;
      width: 800px;
    }
    .child {
      width: 100px;
    }
    /* 剩余空间被分为 3 份，c1 占 1/3，c2 占 2/3 */
    .c1 {
      flex: 1;
    }
    .c2 {
      flex: 2;
    }
  </style>
</head>
<body>
  <div class="parent">
    <div class="child"></div>
    <div class="child"></div>
    <div class="child"></div>
  </div>
</body>
```


定位：可以设置元素具体在某个位置上。

相对定位：相对于自身当前位置的定位，虽然形状移动了，但是原来的位置依然占据着。
`position: relative`，配合 `left/right/top/bottom` 属性使用。

绝对定位：相对于最激进自身并且设置了定位的父元素或者祖先元素，**设置了绝对定位的元素，会脱离文档流**，不会占据空间。正常的元素
会顶上去。
`position: absolute`，配合 `left/right/top/bottom` 属性使用。

固定定位：固定在浏览器中的某个位置，相对于浏览器定位。
`position: fixed`，配合 `left/right/top/bottom` 属性使用。

粘性定位：占据原来的位置
`position: sticky`，配合 `left/right/top/bottom` 属性，可以在距离浏览器相对应的位置固定住。在父元素之内，父元素以后定位就无效了。


层：
`z-index: {num}` 同一个父元素下，数值越大，越上层。不同的父元素下的子元素，就向上追溯到同一父元素下比较，谁的父元素的层级大，谁就在上层。
子元素的 `z-index` 就没用了。

### 字体属性

1. 字体大小
2. 字体颜色
3. 字体的粗细
4. 字体名称
5. 字体排布（居中）
6. 字体行高
7. 字体阴影
8. 字体图标

`font-family`：声明使用的字体，取决于系统是否安装有对应的字体
`font-size`：字体大小
`font-weight`：字体粗细，`100-900` 或者 `bold/bolder/lighter/normal`，取决于系统是否安装有对应的字体。
`font-style`：字体样式，`italic` 斜体，`normal` 默认的样式。
`color`：颜色
`line-height`：行高，行与行之间的距离
`text-algin`：文字排布，`center/left/right`
`text-shadow`：文字阴影。`text-shadow: {x 偏移值} {y 偏移值} {模糊度} {颜色}`，
  `text-shadow: 10px 0 0 red,10px 0 0 red;` 多组值，会有一个渐变的效果。可以配合动画实现闪光的效果。


> 所有的字体属性都会继承父元素的字体属性，所以在 `html` 元素上设置字体属性，会使所有的元素都会默认继承 `html` 上的字体属性。


字体图标：用特殊的字体来显示图标，代替图片。

1. 可以使用字体属性，随时调整大小和颜色。
2. 图标调整大小，不会失真，因为字体是矢量图。
3. 字体文件 size 普遍小于图片。

使用方式：
可以在 [iconfont](https://www.iconfont.cn/) 下载字体图标。

1. unicode。
2. font class，原理是使用了 `:before` 伪元素。主流。
3. symbol，这种其实是做了一个 svg 的集合。未来主流。

### 动画 过渡效果 转换

2D 转换：
平移：`transform: translate(x, y)`，x 和 y 可以分开设置（`transform: translateX(200px)` `transform: translateY(100px)`）
旋转：`transform: rotate(x)`，`transform: rotate(30deg)` 顺时针旋转 30 度，负数就是逆时针旋转。
3D 转换：3 个轴,x,y,z
透视点：`perspective` （`perspective: 1000px`）意思是距离屏幕 1000 像素点的距离。
透视点的位置默认是屏幕的正中央。`perspective-origin: left buttom` 透视点的位置改为左下。
子元素需要保留 3D 效果，需要单独设置 `transform-style: preserve-3d`
平移：`transform: translate3d(x, y, z)`，也可以分开设置 `translateZ(100px)`
旋转：`transform: rotate3d(x, y,z, 30deg)` 绕着 x,y,z 确定的点旋转 30 度，`rotateX(45deg)` 绕着 X 轴旋转 45 度。`rotateY()` `rotateZ()`

放大和缩小：
放大：`transform: scale(3)` 放大 3 倍，`transform: scale(0.5, 2)` 水平放大 0.5、垂直放大 2 倍。也可以分别设置 `transform: scaleX(3)` 水平放大 3 倍。
倾斜：
`transform: skew(15deg, 0deg)` x 轴倾斜 15 度，y 轴 0 度。


过渡效果：
`transition: {过渡属性} {过渡时间} {延迟时间}`：`transition: background 2s` 背景颜色变化 2 秒。多个属性 `,` 分隔。`transition: background 2s,width 5s` 背景颜色变化 2 秒，宽度变化 5 秒。
`transition: background 2s 2s` 背景颜色变化 2 秒，2 秒之后才开始变化。
`transition: all` all 代表所有属性。
`transition: all 5s linear`：linear 线性变化速度
`transition`：可以分开设置。
`transition-property` 过渡属性。
`transition-duration` 过渡时间。
`transition-timing-function` 过渡变化速度。默认是 `ease` 先慢后快，`linear` 线性。`ease-in` 缓慢进， `ease-out` 缓慢出，`cubic-bezier` 自定义
`transition-delay` 过渡延迟时间


动画：
`animation`：`animation: {动画名称} {动画时间} {次数}` `@keyframes {动画名称}`
`animation`：可以分开设置。
`animation-name` 名称
`animation-duration` 动画时间
`animation-delay` 延迟时间
`animation-timing-function` 动画速度，默认是 `ease` 先慢后快，`linear` 线性。`cubic-bezier` 自定义，`steps()` 步数
`animation-iteration-count` 迭代次数，`infinite` 表示无限
`animation-direction` 方向，默认是 `normal`，`alternate` 往返动画
`animation-fill-mode` 最后填充模式，`forwards`

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
    }
    20% {
        transform: translateX(500px);
    }
    70% {
        transform: translateX(500px);
    }
    100% {
        transform: translateX(500px);
    }
}
```    

### 移动端响应式

`<meta name="viewport" content="width=device-width, initial-scale=1">`

`viewport` 声明视窗。**只适用于移动端**。
`width=device-width` 宽度等于设备宽度。`width=375` 指定某种设备的宽度，不同分辨率的设备（移动端）都会自适应这个宽度。
`initial-scale=1` 初始化比例是 1
`minimum-scale=1` 最小的缩小比例是 1
`maximum-scale=1` 最大的放大比例是 1
`user-scalable=no` 用户不允许缩放

意思就是不允许缩放。

### 媒体查询 响应式的解决方案

响应式：根据不同屏幕的大小，显示不同的样式，从而更好的适配屏幕去显示内容。

语法：

```css
/* 屏幕小于 640px 时，改变 h1 的颜色*/
@media screen and (max-width: 640px) {
  h1 {
    color: #0055bb;
  }
}

/* 屏幕大于 1200px 时，改变 h1 的颜色*/
@media screen and (min-width: 1200px) {
  h1 {
    color: #264D73;
  }
}

/* 屏幕大于 640px 并且小于 1200px 时，改变 h1 的颜色*/
@media screen and (min-width: 640px) and (max-width: 1200px) {
  h1 {
    color: #66bbff;
  }
}
```



### css 过滤

`-webkit-filter`：滤镜属性。
- `blur()` 设置元素的模糊度，默认是 `0px`。 `-webkit-filter: blur(20px)`, `blur()` 中的值越大越模糊。
- `grayscale()` 灰度，正常是 `0%` 可以写数字。`-webkit-filter: grayscale(100%)`。
- `sepia()` 褐色，正常是 `0%` 可以写数字。`-webkit-filter: sepia(100%)` 。
- `brightness()` 亮度，正常亮度 `100%` 可以写数字，`-webkit-filter: brightness(100%)` 。如果需要过度曝光的效果可以 `brightness(500%)`
- `contrast()` 对比度，正常是 `100%` 可以写数字，`-webkit-filter: contrast(1000%)`。
- `saturate()` 饱和度，正常是 `100%` 可以写数字，`-webkit-filter: saturate(1000%)`。
- `hue-rotate()` 色相旋转，正常是 `0deg` 可以写数字，`-webkit-filter: hue-rotate(45deg)`。
- `invert()` 色相反转，底片效果，正常是 `0` 可以写数字，`-webkit-filter: invert(100%)`。

`-webkit-filter: blur(20px) brightness(100%)`

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