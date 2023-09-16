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

1. 可以实现文字包围图片的样式
2. 可以让元素向左或者向右靠拢
3. 可以解决一些边距问题

`float: left/right;` 会让元素脱离文档流。

**元素之间的多个空白，会合并成一个空格**。如果不处理会出现一些莫名其妙的间距。用浮动就可以解决这个问题。元素脱离了文档流，空白也就默认被忽略了。
并且会仅仅靠近父元素的边缘，或者同样是浮动元素的边缘。

例如下面的 html，三个 `<div class="child"></div>` 之间都有换行和空格，html 会将多个空白空格合并为一个空格。就会造成页面的元素之间看起来有间距，
其实就是一个空格。

```html
  <div class="parent">
    <div class="child"></div> 
    <div class="child"></div>
    <div class="child"></div>
  </div>
```

如果不想有空格，可以像下面这样，把换行和空格去掉：

```html
  <div class="parent">
    <div class="child"></div><div class="child"></div><div class="child"></div>
  </div>
```

上面的方式，不好看，可以使用浮动解决：

```css
.child {
  float: left
}
```

第一个子元素 `<div class="child"></div>` 就会去找父元素的左边边缘，第二个第三个也一样，但是第二个第三个由于中间有浮动元素，就会选择靠近浮动元素的边缘。

浮动的弊端：

会导致父元素的高度塌陷。

比如 `div` 块容器会占一整行，如果该元素里面包含有浮动元素，会导致该元素的高度没有了。
**因为浮动元素脱离了文档流，父元素会认为没有子元素，高度也就没有了**。

解决方式：
1. 设置父元素的高度（前提是父元素的高度是已知的）。
2. 父元素的高度位置的情况下，可以通过清除浮动的方式，原理就是让父元素重新计算元素的高度。
   1. 在父元素最后添加一个子元素 `div`，并给子元素添加属性 `clear: both;`，缺点是会多一个空的 div。
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
`align-content: flex-start`：`flex-start` 多行都向侧轴的起点靠拢。`flex-end` 多行都向侧轴的终点靠拢。`center` 多行居中。
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

绝对定位：相对于最接进自身并且设置了定位的父元素或者祖先元素，**设置了绝对定位的元素，会脱离文档流**，不会占据空间。正常的元素
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
@media not|only mediatype and (mediafeature and|or|not mediafeature) {
  CSS-Code;
}
```

媒体类型：

`all`：所有设备。
`print`：用于打印机和打印预览。
`screen`：用于电脑屏幕，平板电脑，智能手机等。。
`speech`：应用于屏幕阅读器等发声设备。

示例：
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
