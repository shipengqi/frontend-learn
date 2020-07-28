# CSS 样式

## 目录
- [背景](#背景)
- [文本](#文本)
- [字体](#字体)
- [链接](#链接)
- [列表](#列表)
- [盒子模型](#盒子模型)
- [尺寸](#尺寸)
- [显示和隐藏](#显示和隐藏)
- [定位和浮动](#定位和浮动)
- [透明](#透明)
- [媒体类型](#媒体类型)


## 背景 ##
- `background`，背景缩写属性可以在一个声明中设置所有的背景属性。
语法`background:bg-color bg-image position/bg-size bg-repeat bg-origin bg-clip bg-attachment initial|inherit;`
```css
body
{
    background: #00ff00 url('smiley.gif') no-repeat fixed center;
}
```
- `background-color`，元素的背景颜色。
- `background-image`，元素的背景图像，默认情况下，背景图像会在页面的水平或者垂直方向平铺重复显示，覆盖整个元素实体。
```css
body {background-image:url('paper.gif');}
```
- `background-repeat`，定义背景图像是否重复，和重复的方式。
  - `repeat`，背景图像将向垂直和水平方向重复。默认。
  - `repeat-x`，只有水平位置重复
  - `repeat-y`，只有垂直位置重复
  - `no-repeat`，不重复
  - `inherit`，指定`background-repeat`属性设置从父元素继承
- `background-attachment`，背景图像是否固定或者随着页面的其余部分滚动。
  - `scroll`，背景图片随页面的其余部分滚动。默认。
  - `fixed`，背景图像是固定的
  - `inherit`，应该从父元素继承
- `background-position`，设置背景图像的起始位置。`left`，`right`，`center`都可以和`top`，`center`，`bottom`任意组合定义
背景图像的位置，比如`letf top`表示左上角的位置(`top left`是一样的效果)。如果只指定了一个关键词，如`left`，那么另一个就是默认的`center`。
也可以使用`x% y%`的方式指定位置，`x`水平方向，`y`是垂直方向。也可以是`xpx ypx`，`px`像素可以和`%`混合使用。

## 文本 ##
- `color`，如果定义了颜色属性，你还必须定义背景色属性。
- `text-align`，指定元素文本的水平对齐方式。
  - `left`，文本排列到左边。默认值：由浏览器决定。
  - `right`，文本排列到右边。
  - `center`，文本排列到中间。
  - `justify`，两端对齐文本，每一行被展开为宽度相等，左，右外边距是对齐。
  - `inherit`，从父元素继承。
- `vertical-align`，指定元素文本的垂直对齐方式。
  - `baseline`，默认。元素放置在父元素的基线上。
  - `sub`，垂直对齐文本的下标。
  - `super`，垂直对齐文本的上标。
  - `top`，把元素的顶端与行中最高元素的顶端对齐。
  - `text-top`，把元素的顶端与父元素字体的顶端对齐。
  - `middle`，把此元素放置在父元素的中部。
  - `bottom`，把元素的底端与行中最低的元素的顶端对齐。
  - `text-bottom`，把元素的底端与父元素字体的底端对齐。
  - `length`。
  - `%`，使用 "line-height" 属性的百分比值来排列此元素。允许使用负值。
  - `inherit`，从父元素继承。
- `text-decoration`，指定文本的修饰。
  - `none`，标准的文本。默认值。
  - `underline`，添加文本下划线。
  - `overline`，添加文本上的一条线。
  - `line-through`，穿过文本的线，删除线。
  - `blink`，闪烁的文本。
  - `inherit`，从父元素继承。
- `text-transform`，控制文本的大小写。
  - `none`，带有小写字母和大写字母的标准的文本。默认值。
  - `capitalize`，每个单词以大写字母开头。
  - `uppercase`，仅有大写字母。
  - `lowercase`，仅有小写字母。
  - `inherit`，从父元素继承。
- `text-indent`，控制文本块中首行文本的缩进。
  - `length`，定义固定的缩进。默认值：0，单位`px`。可以是负值，如果值是负数，将第一行左缩进。
  - `%`，基于父元素宽度的百分比的缩进。
  - `inherit`，从父元素继承。
- `direction`，文本方向。
  - `ltr`，从左到右。
  - `rtl`，从右到左。
  - `inherit`，从父元素继承。
- `letter-spacing`，文本字符间距。
  - `normal`，默认。字符间没有额外的空间。
  - `length`，定义间距，可以是负值。
  - `inherit`，从父元素继承。
- `word-spacing`，文本单词间距。
  - `normal`，默认。单词间的标准空间。
  - `length`，定义单词间的固定空间，可以是负值。
  - `inherit`，从父元素继承。
- `white-space`，指定元素内的空白处理方式。
  - `normal`，默认。空白会被浏览器忽略。
  - `pre`，空白会被浏览器保留。其行为方式类似 HTML 中的`<pre>`标签。
  - `nowrap`，文本不会换行，文本会在在同一行上继续，直到遇到`<br>`标签为止。
  - `pre-wrap`，保留空白符序列，但是正常地进行换行。
  - `pre-line`，合并空白符序列，但是保留换行符。
  - `inherit`，从父元素继承。
- `line-height`，行高。
  - `normal`，默认。设置合理的行间距。
  - `number`，设置数字，此数字会与当前的字体尺寸相乘来设置行间距。
  - `length`，定义行间距。
  - `%`，基于当前字体尺寸的百分比行间距。
  - `inherit`，从父元素继承。
- `text-shadow`，文本阴影。语法：`text-shadow: h-shadow v-shadow blur color;`。
  - `h-shadow`，必需。水平阴影的位置。允许负值。
  - `v-shadow`，必需。垂直阴影的位置。允许负值。
  - `blur`，可选。模糊的距离。
  - `color`，可选。阴影的颜色。
- `unicode-bidi`，与`direction`属性一起使用，来设置或返回文本是否被重写，以便在同一文档中支持多种语言。
  - `normal`，默认。不使用附加的嵌入层面。
  - `embed`，创建一个附加的嵌入层面。
  - `bidi-override`，创建一个附加的嵌入层面。重新排序取决于`direction`属性。
  - `initial`，设置该属性为它的默认值。
  - `inherit`，从父元素继承。

## 字体 ##
字体属性用来定义字体的加粗，大小，文字样式。CSS 中有两种类型字体，一种是通用字体，一种是特定字体。

- `font`，与`background`属性用法类似，可以在一个声明中设置所有的字体属性。
语法`font:font-style font-variant font-weight font-size/line-height font-family;` `font-size`和`font-family`是必需的，其他的会插入默认值。
- `font-family`，设置文本的字体系列。使用这个属性时，应该设置多种字体，防止如果浏览器不支持，可以尝试使用下一种字体。例如`p{font-family:"Times New Roman", Times, serif;}`。
建议使用一个通用字体系列名作为后路。
- `font-size`，设置字体大小。可以设置的额尺寸有`xx-small`，`x-small`，`small`，`medium`，`large`，`x-large`，`xx-large`，
`smaller`（把`font-size`设置为比父元素更小的尺寸），`larger`（设置为比父元素更大的尺寸），`length`（设置为固定的值），`%`（ 设置为基于父元素的一个百分比值），`inherit`。
- `font-style`，设置文本的字体样式。
  - `normal`，默认。标准的字体样式。
  - `italic`，斜体。
  - `oblique`，倾斜的字体。
  - `inherit`，从父元素继承。
- font-variant`，把小写字母也转换为大写，但是尺寸比正常的大写字母要小。
  - `normal`，默认。标准的字体。
  - `small-caps`，显示小型大写字母的字体。
  - `inherit`，从父元素继承。
- font-weight`，设置文本的粗细。可以是`100，200,300，..，900`十个值中的值，`400`相当于`normal`，`700`相当于`bold`。
  - `normal`，默认。标准的字体。
  - `bold`，粗体。
  - `bolder`，更粗的字体。
  - `lighter`，更细的字体。
  - `inherit`，从父元素继承。

## 链接 ##
链接可以设置任意的 CSS 属性，可以针对链接的状态设置不同的样式，查看[选择器](selector.md)，可以知道链接有一下状态：
- `:link`，如`a:link`选择所有未访问链接。
- `:visited`，如`a:visited`选择所有访问过的链接。
- `:active`，如`a:active`链接被点击时。
- `:hover`，如`a:hover`选择鼠标在链接上面时。

注意`a:hover`必须跟在`a:link`和`a:visited`后面，`a:active`必须跟在`a:hover`后面。常用的样式是`text-decoration`设置链接下划线，和`background-color`设置链接
的背景颜色。

## 列表 ##
- `list-style`，在一个声明中设置所有的列表属性。
语法`list-style: list-style-type list-style-position list-style-image;`未设置的属性会插入默认值。也可以是`inherit`，从父元素继承。
- `list-style-type`，列表项标记的类型。默认是`disc`，实心圆标记。`none`是无标记，`circle`是空心圆。查看[更多类型](http://www.runoob.com/cssref/pr-list-style-type.html)。
- `list-style-position`，指示如何相对于对象的内容绘制列表项标记。
  - `inside`，列表项目标记放置在文本以内，且环绕文本根据标记对齐。
  - `outside`，默认值。保持标记位于文本的左侧。列表项目标记放置在文本以外，且环绕文本不根据标记对齐。
  - `inherit`，从父元素继承。
语法`list-style: list-style-type list-style-position list-style-image;`未设置的属性会插入默认值。
- `list-style-image`，使用图像来替换列表项的标记。默认是`none`，无图形。或者是一个图像的路径，也可以是`inherit`，从父元素继承。

## 盒子模型 ##
CSS盒模型本质上是一个盒子，封装周围的 HTM L元素，它包括：外边距（Margin），边框（Border），内边距（Padding），和内容（Content）。
- Margin，清除边框外的区域，外边距是透明的。
- Border，围绕在内边距和内容外的边框。
- Padding，清除内容周围的区域，内边距是透明的。
- Content，盒子内容，显示文本和图像。

### 边框
- `border`，把对四个边的属性设置在一个声明。语法`border:border-width border-style border-color;`，也可以单独为一个边设置属性，语法是一样的：
  - `border-top`，把**上边框**的所有属性设置到一个声明中。
  - `border-left`，把**左边框**的所有属性设置到一个声明中。
  - `border-right`，把**右边框**的所有属性设置到一个声明中。
  - `border-bottom`，把**下边框**的所有属性设置到一个声明中。
- `border-style`，设置元素所有边框的样式，或者为 4 个边分别设置样式。
  - `none`，无边框。
  - `hidden`，与 "none" 相同。不过应用于表时除外，对于表，hidden 用于解决边框冲突。
  - `dotted`，点状边框。在大多数浏览器中呈现为实线。
  - `dashed`，虚线。在大多数浏览器中呈现为实线。
  - `solid`，实线。
  - `double`，双线。双线的宽度等于`border-width`的值。
  - `groove`，3D 凹槽边框。其效果取决于`border-color`的值。
  - `ridge`，3D 垄状边框。其效果取决于`border-color`的值。
  - `inset`，3D inset 边框。其效果取决于`border-color`的值。
  - `outset`，3D outset 边框。其效果取决于`border-color`的值。
  - `inherit`，从父元素继承。
- `border-width`，设置元素所有边框的样式宽度，或者为 4 个边分别设置宽度。
  - `thin`，细边框。
  - `medium`，默认。中等边框。
  - `thick`，粗边框。
  - `length`，指定宽度。
  - `inherit`，从父元素继承。
- `border-color`，设置元素所有边框的颜色，或者为 4 个边分别设置颜色。
  - `color`，颜色，查看颜色表。
  - `transparent`，默认。透明的。
  - `inherit`，从父元素继承。

`border-style`，`border-width`，`border-color`，语法相同，以`border-style`：
```css
/*顺时针，对应上右下左四边*/
border-style:dotted solid double dashed;

/*上边是 dotted，左右是 solid，下边是 double*/
border-style:dotted solid double;

/*上下边是 dotted，左右是 solid*/
border-style:dotted solid;

/*四边都是 dotted*/
border-style:dotted;
```

这三个属性还可以单独设置一边，语法相同个，以`border-style`：
```css
p
{
    border-top-style:dotted;
    border-right-style:solid;
    border-bottom-style:dotted;
    border-left-style:solid;
}
```

### 轮廓
轮廓（outline）是绘制于元素周围的一条线，位于边框边缘的外围，可起到突出元素的作用。
- `outline`，把对四个边的属性设置在一个声明。语法`outline:outline-color outline-style outline-width;`，也可以单独为一个边设置属性，语法是一样的：
- `outline-style`，设置轮廓的样式，与`boder-style`的可选值是一样的。
- `outline-width`，设置轮廓的宽度，与`boder-width`的可选值是一样的。
- `outline-color`，设置元素所有边框的颜色，或者为 4 个边分别设置颜色。
  - `color`，颜色，查看颜色表。
  - `invert`，默认。执行颜色反转（逆向的颜色）。可使轮廓在不同的背景颜色中都是可见。
  - `inherit`，从父元素继承。

### Margin和Padding
- `margin`，把对四个边的属性设置在一个声明。可以使用负值。可以单独为一边设置外边距，例如`margin-bottom`。
  - `auto`，浏览器边距，依赖浏览器。
  - `length`，一个固定的margin（使用像素，pt，em等）。
  - `%`，使用百分比的边距。

`margin`还可以分别为四边设置外边距，语法与`border-style`的语法一样。

- `padding`，把对四个边的属性设置在一个声明。可以单独为一边设置外边距，例如`padding-bottom`。
  - `length`，一个固定的margin（使用像素，pt，em等）。
  - `%`，使用百分比的边距。

语法与`margin`一样。

## 尺寸 ##
- `height`，设置元素的高度。
  - `auto`，默认。浏览器会计算出实际的高度。
  - `length`，一个固定的高度（使用像素，pt，em等）。
  - `%`，包含它的块级对象的百分比高度。
  - `inherit`，从父元素继承。
- `width`，设置元素的宽度，和`height`可选值一样。 width属性不包括填充，边框和页边距。
- `line-height`，设置行高。
- `max-height`，设置元素的最大高度。默认是`none`。没有限制。
- `max-width`，设置元素的最大宽度。默认是`none`。没有限制。
- `min-height`，设置元素的最小高度。默认是`none`。没有限制。
- `min-width`，设置元素的最小宽度。默认是`none`。没有限制。

## 显示和隐藏 ##
- `display`，元素的显示方式。
  - `none`，隐藏元素。
  - `block`，显示为块级元素。
  - `inline`，显示为内联元素。
  - `inline-block`，显示为内联块元素。
- `visibility`，。
  - `hidden`，隐藏元素。
  - `collapse`，设置`collapse`后，一般的元素的表现与` hidden`一样。但如果该元素是与`table`相关的元素，例如
  `table row、table column、table column group、table column group`等，其表现和`display: none`一样。

`visibility:hidden`可以隐藏某个元素，但隐藏的元素仍需占用与未隐藏之前一样的空间。也就是说，该元素虽然被隐藏了，但仍然会影响布局。`display:none`不会占用任何空间。

## 定位和浮动 ##
### 定位
- `position`，指定元素的定位类型。
  - `static`，默认值，没有定位。出现在正常的流中。
  - `relative`，相对于一个元素的正常位置的定位。
  - `fixed`，相对于浏览器窗口是固定位置，即窗口是滚动的它也不会移动。Fixed定位使元素的位置与文档流无关，因此不占据空间。Fixed定位的元素和其他元素重叠。
  - `absolute`，绝对定位的元素的位置相对于最近的已定位父元素，如果元素没有已定位的父元素，那么它的位置相对于`<html>`，与文档流无关，和其他元素重叠。
  - `sticky`，粘性定位，基于用户的滚动位置来定位。
- `top`
- `left`
- `right`
- `bottom`
- `overflow`，设置当元素的内容溢出其区域时发生的事情。
  - `visible`，默认值。内容不会被修剪，会呈现在元素框之外。
  - `hidden`，内容会被修剪，并且其余内容是不可见的。
  - `scroll`，内容会被修剪，但是浏览器会显示滚动条以便查看其余的内容。
  - `auto`，如果内容被修剪，则浏览器会显示滚动条以便查看其余的内容。
  - `inherit`，从父元素继承。
- `overflow-x`，上下溢出时，用法与`overflow`一样。
- `overflow-y`，左右溢出时，用法与`overflow`一样。
- `clip`剪裁，如果先有`overflow：visible`，`clip`属性不起作用。
- `cursor`，鼠标指针放在一个元素边界范围内时所用的光标形状，常用的`pointer`（小手），`default`（箭头），`auto`是默认值。`url`使用自定义光标的`URL`。
- `z-index`，指定了一个元素的堆叠顺序,具有更高堆叠顺序的元素总是在较低的堆叠顺序元素的前面。可以是负值。

### 浮动
Float（浮动），会使元素向左或向右移动，其周围的元素也会重新排列。Float（浮动），往往是用于图像，但它在布局时一样非常有用。
元素的水平方向浮动，意味着元素只能左右移动而不能上下移动。

一个浮动元素会尽量向左或向右移动，直到它的外边缘碰到包含框或另一个浮动框的边框为止。

浮动元素之后的元素将围绕它。

浮动元素之前的元素将不会受到影响。

- `float`，指定一个盒子（元素）是否应该浮动。
  - `left`，向左浮动。
  - `right`，向右浮动。
  - `none`，默认值。不浮动。
  - `inherit`，从父元素继承。
- `clear`，指定元素两侧不能出现浮动元素。
  - `left`，左侧不允许浮动元素。
  - `right`，右侧不允许浮动元素。
  - `both`，在左右两侧均不允许浮动元素。
  - `none`，默认值。允许浮动元素出现在两侧。
  - `inherit`，从父元素继承。
## 透明 ##
- `opacity`，透明度。

## 媒体类型 ##
媒体类型允许你指定文件将如何在不同媒体呈现。该文件可以以不同的方式显示在屏幕上，在纸张上，或听觉浏览器等等。
