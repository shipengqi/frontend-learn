---
title: 其他属性
weight: 5
---

# 其他属性

## 渐变

### 线性渐变

线性渐变创建了一条沿直线前进的颜色带。[MDN Web Docs (CSS gradients)](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_images/Using_CSS_gradients)


示例：

```css
/* 基础线性渐变，只需指定两种颜色，这些被称为色标（color stop）*/
/* 从上到下，蓝色渐变到红色  */
linear-gradient(blue, red);
/* 至少指定两个色标，也可以指定多个色标 */
linear-gradient(red, yellow, blue, orange);
 
/* 默认情况下，线性渐变的方向是从上到下，可以指定一个值来改变渐变的方向 */
/* 从左到右、从蓝色渐变到红色 */
linear-gradient(to right, blue, pink);
/* 从一个对角到另一个对角 */
linear-gradient(to left top, blue, red);
linear-gradient(to bottom right, blue, pink);
 
/* 设置渐变角度 */
/* 渐变轴为 45 度，从蓝色渐变到红色 */
linear-gradient(45deg, blue, red); 
/* 0deg 代表渐变方向为从下到上，90deg 代表渐变方向为从左到右，正角度都属于顺时针方向。负角度意味着逆时针方向。 */
linear-gradient(0deg, blue, green 40%, red);

/* 透明度 */
linear-gradient(to right, rgba(255,0,0,0), rgba(255,0,0,1));

/* 色标位置 */
/* 默认情况下，设置的颜色会均匀分布在渐变路径中 */
/* 可以设置百分比或者绝对长度来调整它们的位置 */
/* 如果没有明确设置，将会自动计算 */
/* 第一个色标在 0% 处，最后一个色标在 100% */
linear-gradient(to left, lime 28px, red 77%, cyan);
linear-gradient(90deg, #19224A 0, #222E61 25%, #23346A 65%, #146693 90%, #088CB2);

/* 重复线性渐变 */
repeating-linear-gradient(red, yellow 10%, green 20%);
```

### 径向渐变

径向渐变类似于线性渐变，除了是从一个中心点向外辐射的。你可以指定中心点的位置。你还可以使其为圆形或者是椭圆形。

```css
/* 基本的径向渐变 */
/* 默认情况下，渐变的中心点是 50% 50% 的位置 */
/* 椭圆 */
radial-gradient(red, blue);
```

## 滤镜属性

滤镜属性有两个，可以用来实现毛玻璃的效果：

- `filter`：为元素本身设置滤镜效果，包括元素背后的区域。
- `backdrop-filter`：只为元素背后的区域设置滤镜效果。

滤镜属性支持的值：

- `blur()` 设置元素的模糊度，默认是 `0px`。 例如：`filter: blur(20px)`, `blur()` 中的值越大越模糊。
- `contrast()` 对比度，正常是 `100%` 可以写数字，例如：`filter: contrast(1000%)` 和 `filter: contrast(10)` 是一个意思。
- `grayscale()` 灰度，正常是 `0%`，也可以写数字。例如：`filter: grayscale(100%)`。
- `hue-rotate()` 色相旋转，正常是 `0deg` 可以写数字，例如：`filter: hue-rotate(45deg)`。
- `drop-shadow` 投影效果，例如：`filter: drop-shadow(16px 16px 20px blue)`。
- `sepia()` 褐色，正常是 `0%` 可以写数字。例如：`filter: sepia(100%)` 。
- `brightness()` 亮度，正常亮度 `100%` 可以写数字，例如：`filter: brightness(100%)` 。如果需要过度曝光的效果可以 `brightness(500%)`。
- `saturate()` 饱和度，正常是 `100%` 可以写数字，例如：`filter: saturate(1000%)`。
- `invert()` 色相反转，底片效果，正常是 `0` 可以写数字，`filter: invert(100%)`。

多个属性组合：`filter: blur(20px) brightness(100%)`。

> 滤镜属性是比较耗费性能的。


## 滚动属性

`overflow` 属性用于在内容超出容器时，如何处理内容的显示。

**容器必须有一个确定的高度或者宽度，`overflow` 才会生效**。

`overflow` 也可以分别设置 X 轴 `overflow-x` 和 Y 轴 `overflow-y`。

```css
div {
    overflow: hidden;
    /*
    overflow-x: hidden;
    overflow-y: hidden;
    */
}

div {
    overflow: auto hidden;
    /*
    overflow-x: auto;
    overflow-y: hidden;
    */
}
```

常用的值：

- `visible`：默认值，不会出现滚动条，溢出内容会直接显示在容器外部。
- `hidden`：不会出现滚动条，溢出内容会被裁剪，超出容器的部分不可见。
- `scroll`：显示滚动条，超出容器的内容，可以滚动滚动条来显示。
- `auto`：和 `scroll` 基本一样。在内容有溢出时才显示滚动条，没有溢出则不显示滚动条。
- `overlay`：和 `auto` 差不多，不同的是 `auto` 显示的滚动条会在容器内占据一个位置，会导致内容发生位移。`overlay` 则是会覆盖在容器右侧，不会占据位置

### background-attachment



### 滚动条的样式

主要涉及以下几个伪元素属性，`-webkit` 表示只对 webkit 内核浏览器有效。

- `::-webkit-scrollbar`：设置滚动条的整体样式，可以设置尺寸等。**必须要设置宽高，否则不生效**。
- `::-webkit-scrollbar-button`：滚动条两端的按钮（上下箭头）。不设置则不出现。
- `::-webkit-scrollbar-thumb`：滚动条上的滚动滑块。**必须要设置，否则不会出现滑块**。
- `::-webkit-scrollbar-track`：滚动条轨道。不设置则不出现轨道。
- `::-webkit-scrollbar-track-piece`：滚动条没有滑块的轨道部分。
- `::-webkit-scrollbar-corner`：当同时有垂直滚动条和水平滚动条时交汇的部分。通常是浏览器窗口的右下角。


示例：

```css
/* 滚动条所在容器 */
.scroll-container {
    margin: 10px;
    width: 200px;
    height: 250px;
    overflow: overlay;
    background-color: #fff;
}

/*定义滚动条高宽及背景
 高宽分别对应横竖滚动条的尺寸*/
.scroll-container::-webkit-scrollbar
{
    width:16px;
    height:16px;
    background-color:#F5F5F5;
}
/*定义滚动条轨道
 内阴影+圆角*/
.scroll-container::-webkit-scrollbar-track
{
    -webkit-box-shadow:inset 0 0 6px rgba(0,0,0,0.3);
    border-radius:10px;
    background-color:#F5F5F5;
}
/*定义滑块
 内阴影+圆角*/
.scroll-container::-webkit-scrollbar-thumb
{
    border-radius:10px;
    -webkit-box-shadow:inset 0 0 6px rgba(0,0,0,.3);
    background-color:#555;
}
```

#### 伪类属性

滚动条的样式还可以搭配一些伪类属性来进行优化：

`:horizontal`：适用于任何水平方向上的滚动条。
`:vertical`：适用于任何垂直方向的滚动条。

```css
/*定义滚动条轨道
 内阴影+圆角*/
.scroll-container::-webkit-scrollbar-track
{
    -webkit-box-shadow:inset 0 0 6px rgba(0,0,0,0.3);
    border-radius:10px;
    background-color:#F5F5F5;

    &:horizontal {
        background-color: blue;
    }
}
/*定义滑块
 内阴影+圆角*/
.scroll-container::-webkit-scrollbar-thumb
{
    border-radius:10px;
    -webkit-box-shadow:inset 0 0 6px rgba(0,0,0,.3);
    background-color:#555;

    &:vertical {
        background-color: red;
    }
}
```

## 换行与溢出

相关属性：

- `white-space`：文本是否换行，空白符（换行符、空格、制表符等）的处理。
- `word-break`，`overflow-wrap`：断句/断单词的换行处理，主要针对 non-CJK (CJK 指中文/日文/韩文) 的文本。
- `text-overflow`：文字溢出的处理。

### white-space

- `normal`：默认值，文本中的连续空白符会被合并。根据填充的盒子宽度来决定换行。
- `nowrap`：不换行，文本中的连续空白符会被合并。
- `pre`：文本之间的空白符会被保留。**只有遇到换行符或者 `<br>` 时才会换行**。其行为方式类似 HTML 中的 `<pre>` 标签。
- `pre-wrap`：换行，并且文本之间的空白符会被保留。遇到换行符或者 `<br>` 时换行，或者根据填充的盒子宽度来决定换行。

### word-break

- `normal`：默认值。
- `break-all`：最常用的值，可在任意字符间断行，效果就是换行位置都会被填满，如果需要单词保持完整性，那就不要使用。

### overflow-wrap

和 `word-break` 一样也是用来截断单词的，不一样的是 `overflow-wrap` 侧重于处理超出元素宽度的单词。

- `normal`：默认值。换行符将出现在空格和连字符处。
- `break-word`：最常用的值。如果行内没有多余的地方容纳该单词到结尾，则那些正常的不能被分割的单词会被强制分割换行。

### text-overflow

指定当文本溢出时，应该如何显示。可以设置溢出后，文本被剪切、显示省略号 (`...`) 或显示自定义字符串（不是所有浏览器都支持）。

- `clip`：剪切文本。
- `ellipsis`：显示省略符号 `...` 来代表被修剪的文本。
- `string`：使用给定的字符串来代表被修剪的文本。

`text-overflow` 需要配合以下两个属性使用：

- `white-space: nowrap;` 不换行
- `overflow: hidden` 不显示滚动条。

## 文本的水平对齐和垂直对齐

### 水平对齐

- `text-align`：默认值 `left`。
  - `left`：左对齐。
  - `right`：右对齐。
  - `center`：居中对齐。
  - `justify`：两端对齐。
  - `start`：如果内容方向是从左到右的话，左对齐。反之则右对齐。
  - `end`：如果内容方向是从左到右的话，右对齐，反之则左对齐。

> 只有**块级元素内的文字**或者**行内元素**才生效。


### 垂直对齐

垂直对齐，是设置文字在一行内的空间中的垂直对齐。

- `vertical-align`：默认值 `baseline`。
  - `baseline`：默认值，基线对齐。
  - `top`：整行的顶部对齐。
  - `middle`：垂直居中。
  - `bottom`：整行的底部对齐。
  - `text-top`：与父元素的字体的顶部对齐。
  - `text-bottom`：与父元素的字体的底部对齐。

> 只有**表格元素**或者**行内元素**才生效。

## clientHeight、offsetHeight、scrollHeight

每个元素都具有以和元素高度、滚动、位置相关的属性。这些属性通常用于计算元素的实际高度，尤其在涉及到滚动的情况下。

### clientWidth、clientHeight、clientLeft、clientTop

`clientWidth`：只读属性，表示元素的内部宽度，单位 `px`，包括 `padding` 但不包括 `border` `margin` 和垂直滚动条的宽度。对于 `inline` 的元素这个属性一直是 0。
`clientHeight`：只读属性，表示元素内容的高度，单位 `px`，包括 `padding` 但不包括 `border` `margin` 和水平滚动条的高度。对于 `inline` 的元素这个属性一直是 0。
`clientLeft`：只读属性，表示元素左边框的宽度，单位 `px`，不包括左外边距和左内边距。
`clientTop`：只读属性，表示元素顶部边框的宽度，单位 `px`，不包括顶部外边距或内边距。

### offsetWidth、offsetHeight、offsetLeft、offsetTop

`offsetWidth`：只读属性，表示元素的布局宽度，单位 `px`，包括 `padding` `border` `margin` 和垂直滚动条的宽度。
`offsetHeight`：只读属性，表示元素内容的高度，单位 `px`，包括 `padding` `border` `margin` 和水平滚动条的高度。
`offsetLeft`：只读属性，表示元素左上角相对于 `offsetParent` 左边界的偏移，单位 `px`，如果元素被隐藏则是 0。
`offsetTop`：只读属性，表示元素相对于 `offsetParent` 元素的顶部内边距的距离，单位 `px`，如果元素被隐藏则是 0。

### scrollWidth、scrollHeight、scrollLeft、scrollTop

`scrollWidth`：只读属性，表示元素内容的总宽度，包括由于溢出而被隐藏的部分。没有水平滚动条的情况下，`scrollWidth` 值与元素视图填充所有内容所需要的最小值 `clientWidth` 相同。
`scrollHeight`：只读属性，表示元素内容的总高度，包括由于溢出而被隐藏的部分。没有垂直滚动条的情况下，`scrollHeight` 的值与元素视图填充所有内容所需要的最小值 `clientHeight` 相同。
`scrollLeft`：可读可写，代表在有滚动条时，滚动条向右（向左）滚动的距离也就是元素左边（右边）被遮住部分的宽度。在没有滚动条时 `scrollLeft = 0`。
`scrollTop`：可读可写，代表在有滚动条时，滚动条向下滚动的距离也就是元素顶部被遮住部分的高度。在没有滚动条时 `scrollTop = 0`。


### 应用

#### 判断是否有垂直滚动条

如果 `scrollHeight = clientHeight` 则表示没有垂直滚动条。

#### 判断是否有水平滚动条

如果 `scrollWidth = clientWidth` 则表示没有水平滚动条。

#### 判断滚动区域是否滚动到底

`scrollTop + clientHeight >= scrollHeigh`，`scrollTop` 是一个非整数，而 `scrollHeight` 和 `clientHeight` 是四舍五入的，因此确定滚动区域是否滚动到底的唯一方法是查看滚动量是否足够接近某个阈值：

```javascript
Math.abs(element.scrollHeight - element.clientHeight - element.scrollTop) < 1
```

## tabindex 

tabindex 全局属性，表示元素是否可以被聚焦，以及是否能用 Tab 键选中。[MDN Web Docs (tabindex)](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex)。

### 支持聚焦的元素

- `<button>`
- 有 `herf` 属性的 `<a>`
- 有 `herf` 属性的 `<link>`
- `type` 不是 `hidden` 的 `<input>`
- `<select>`
- `<textarea>`

默认情况下，在使用 Tab 键聚焦元素时，聚焦顺序等于元素在源当前 DOM 中的先后顺序。


### tabindex 的值

- `tabindex=负值` (例如 `tabindex="-1"`)，表示元素是可聚焦的，但是不能通过键盘导航来访问到该元素，用 JS 做页面小组件内部键盘导航的时候非常有用。
- `tabindex="0"`，表示元素是可聚焦的，并且可以通过键盘导航来聚焦到该元素，它的相对顺序是当前处于的 DOM 结构来决定的。
- `tabindex=正值`，表示元素是可聚焦的，并且可以通过键盘导航来访问到该元素；它的相对顺序是 `tabindex` 的数值越大顺序越靠后。如果多个元素拥有相同的 `tabindex`，它们的相对顺序按照他们在当前 DOM 中的先后顺序决定。`tabindex=0` 的顺序会被放到最后。 例如：`1,1,2,2,2,2,3,4,5,0,0,0 ...`。`tabindex` 是非法值、或者没有 `tabindex` 值的元素，也是放到最后。


`div` 默认情况下是不会被聚焦的，就可以添加属性 `tabindex`，让 `div` 元素可以被聚焦。如果在 `div` 上设置了 `tabindex` 属性，它的子元素内容不能使用箭头键来滚动，除非在内容上也设置 `tabindex`。

## user-select

- `user-select`：设置文本是否可以被选中。默认值 `auto`。
  - `auto`：可以被选中。
  - `none`：不能被选中。
