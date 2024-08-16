---
title: 布局
weight: 3
---

# 布局

## 浮动布局

浮动布局的好处：

1. 可以让元素向左或者向右靠拢
2. 可以解决一些边距问题
3. 可以实现文字包围图片的样式


> `float: left/right;` 会让元素**脱离文档流**。

**元素之间的多个空白，会合并成一个空格**。如果不处理会出现一些莫名其妙的间距。用浮动就可以解决这个问题。元素脱离了文档流，空白也就默认被忽略了。
并且会紧紧靠近父元素的边缘，或者同样是浮动元素的边缘。

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

### 清除浮动

浮动会导致父元素的高度塌陷。

比如 `div` 块容器会占一整行，如果该元素里面包含有浮动元素，会导致该元素的高度没有了。

**因为浮动元素脱离了文档流，父元素会认为没有子元素，高度也就没有了**。

解决方式：

1. 设置父元素的高度（前提是父元素的高度是已知的）。
2. 父元素的高度未知的情况下，可以通过清除浮动的方式，原理就是让父元素重新计算元素的高度。
   - 在父元素最后添加一个子元素 `div`，并给子元素添加属性 `clear: both;`，缺点是会多一个空的 `div`。
3. 终极方案：原理与上个方法一样，通过伪元素来清除浮动。

伪元素来清除浮动：

```css
.parent {
    
}
.parent:after{
  content: "";
  display: block;
  clear: both;
}
```

上面的示例中给父元素的类 `parant` 添加了一个 `:after` 伪元素。

## 弹性布局

弹性布局可以更方便的布局，但是对浏览器要求较高。

概念：

1. **弹性容器**：设置了 `display: flex;` 的元素即为弹性容器。 
2. **弹性子元素**：弹性容器里的**直接子元素**。


`display: flex`：如果一个元素的设置了这个属性（弹性容器），那么他的**直接子元素**（孙子元素就不是弹性布局），就会按着弹性布局的方式来布局。

```html
<head>
  <style>
    .parent {
      display: flex;
      width: 600px;
      height: 600px;
    }
    .child {
      width: 200px;
      height: 200px;
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

如果 `parent` 不是弹性布局，那么三个 `child` 都是块元素，每个元素会占据一整行。但是 `parent` 添加了 `display: flex;` 属性以后，三个子元素会在一行并排显示，不会有间距。

> 直接子元素是弹性布局，但是`parent` 元素本身还是块级布局。

### 弹性主轴和侧轴

弹性布局有一个主轴和一个侧轴：

- **主轴**：默认是**水平向右**，可以修改为**水平向左**或**竖直向上**，**竖直向下**。
- **侧轴**：默认是**竖直向下**，可以修改为**竖直向上**或**水平向左**，**水平向右**，


**弹性布局的子元素默认是在主轴上一行或者一竖，不会换行**，默认情况下（`flex-wrap: nowrap`）如果一行子元素的**宽度或者高度超过了父元素，所有的子元素就会等比例缩小**。

设置主轴的方向：

- `flex-derection: row`：默认是 `row`。
  - `row` 水平向右。
  - `row-reverse` 水平向左。
  - `column` 竖直向下。
  - `column-reverse` 竖直向上。

设置主轴的排布：

- `justify-content: flex-start`：默认是 `flex-start`。
  - `flex-start` 靠近主轴的起点。
  - `flex-end` 靠近主轴的终点。
  - `center` 主轴居中。
  - `space-between` 平均分布，和主轴的起点和终点没有间距。
  - `space-around` 平均分布，和主轴的起点和终点有间距，两边的间距是中间的一半。
  - `space-evenly` 平均分布，间距一致。

弹性布局，设置水平居中只需要 `justify-content:center` 就可以实现，如果不是弹性布局，可以用下面的方式：

```css
display: block; /* 设置为块级元素 */
margin: 0 auto; /* auto 设置水平居中，必须是块元素 */
```

设置侧轴的排布：

- `align-items: stretch`：默认是 `stretch`。
  - `stretch` 拉伸，如果子元素没有设置高度或宽度，那么子元素会被拉伸到和父元素一样的高度或宽度。
  - `flex-start` 靠近侧轴的起点。
  - `flex-end` 靠近侧轴的终点。
  - `center` 侧轴居中。**单行的侧轴没有平均分布**。

换行：

- `flex-wrap: nowrap`：默认是 `nowrap`。
  - `nowrap` 不换行。
  - `wrap` 换行，如果侧轴排布是 `stretch`，换行以后是两行，那么两行会被拉伸，各占一半。

多行存在的时候，侧轴分布：

- `align-content: flex-start`：
  - `flex-start` 多行都向侧轴的起点靠拢。
  - `flex-end` 多行都向侧轴的终点靠拢。
  - `center` 多行居中。
  - `space-around` 平均分布，和侧轴的起点和终点有间距，两边的间距是中间的一半。
  - `space-between` 平均分布，和侧轴的起点和终点没有间距。
  - `space-evenly` 平均分布，间距一致。

弹性子元素会存在多个，如果要单独设置一个子元素侧轴的分布，可以给**弹性子元素添加属性**：

- `align-self: flex-start`：
  - `flex-start` 靠近侧轴的起点。
  - `flex-end` 靠近侧轴的终点。
  - `center` 侧轴居中。

**主轴是不能单独设置一个子元素的分布的**。

### 弹性子元素的排序

如果要设置弹性子元素的排序，可以给每个子元素添加属性：

- `order: {num}` 子元素会沿主轴方向从小到大排序。

示例：

```html
<head>
  <style>
    .parent {
      display: flex;
      width: 600px;
      height: 600px;
    }
    .child {
      width: 200px;
      height: 200px;
    }
    .c1 {
      order: 3;
      background: skyblue;
    }
    .c2 {
      order: 2;
      background: green;
    }
    .c3 {
      order: 1;
      background: yellow;
    }
  </style>
</head>
<body>
  <div class="parent">
    <div class="child c1"></div>
    <div class="child c2"></div>
    <div class="child c3"></div>
  </div>
</body>
```

### 弹性子元素剩余空间配置

给子元素添加属性 `flex: {num}`，占据剩余份额的份数。`flex: 1` 就表示占据剩余空间的 1 份。

示例：

```html
<head>
  <style>
    .parent {
      display: flex;
      width: 600px;
      height: 600px;
      background: gray;
    }
    .child {
      width: 100px;
      height: 100px;
    }
    /* 剩余空间被分为 3 份，c1 占 1/3，c2 占 2/3 */
    .c1 {
      flex: 1;
      background: skyblue;
    }
    .c2 {
      flex: 2;
      background: green;
    }
    .c3 {
      order: 1;
      background: yellow;
    }
  </style>
</head>
<body>
  <div class="parent">
    <div class="child c1"></div>
    <div class="child c2"></div>
    <div class="child c3"></div>
  </div>
</body>
```

上面的示例，每个子元素的宽度为 `100px`，那么剩余空间就是 `300px`。`c1` 会占据剩余空间的 `100px`，`c2` 占 `200px`。

## 网格布局

## 定位

定位：可以设置元素具体在某个位置上。元素默认就是 `static`，也就是没有定位。

`relative`、`absolute`、`fixed` 这三个属性值有一个共同点，都是相对于某个基点的定位，只是基点不同。

### 相对定位

`position: relative`：相对于默认位置（即 `static` 时的位置）的定位，虽然形状移动了，但是原来的位置依然占据着。必须配合 `left/right/top/bottom` 属性使用，用来指定偏移的方向和距离。

```css
div {
  position: relative;
  top: 20px;
}
```

上面的示例，`div` 元素从默认位置向下偏移 `20px`（即距离顶部 `20px`）。

### 绝对定位

`position: absolute`：相对于最接进自身并且已定位的父元素或者祖先元素（不是 `static` 的元素）。必须配合 `left/right/top/bottom` 属性使用。

**设置了绝对定位的元素，会脱离文档流**，不会占据空间。正常的元素会顶上去。


### 固定定位

`position: fixed`：固定在浏览器窗口中的某个位置，相对于浏览器窗口定位。这会导致元素的位置不随页面滚动而变化，好像固定在网页上一样。配合 `left/right/top/bottom` 属性使用。

### 粘性定位

`sticky` 会产生动态效果，很像 `relative` 和 `fixed` 的结合。比如，网页的搜索工具栏，初始加载时，在自己的默认位置（`relative` 定位），页面向下滚动时，工具栏可以在距离浏览器相对应的位置固定住，始终停留在页面头部（`fixed` 定位）。等到页面重新向上滚动回到原位，工具栏也会回到默认位置。必须配合 `left/right/top/bottom` 属性使用。

当页面滚动，父元素开始脱离视口时（即部分不可见），只要与 `sticky` 元素的距离达到生效门槛，`relative` 定位自动切换为 `fixed` 定位；等到父元素完全脱离视口时（即完全不可见），`fixed` 定位自动切换回 `relative` 定位。