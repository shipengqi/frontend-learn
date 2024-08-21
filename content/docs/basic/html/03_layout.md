---
title: 布局与定位
weight: 3
---

# 布局与定位

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
2. **弹性子元素**（项目）：弹性容器里的**直接子元素**。


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
- **侧轴**（交叉轴）：默认是**竖直向下**，可以修改为**竖直向上**或**水平向左**，**水平向右**，


**弹性布局的子元素默认是在主轴上一行或者一竖，不会换行**，默认情况下（`flex-wrap: nowrap`）如果一行子元素的**宽度或者高度超过了父元素，所有的子元素就会等比例缩小**。

设置主轴的方向：

- `flex-derection: row`：默认是 `row`。
  - `row`：水平向右。
  - `row-reverse`：水平向左。
  - `column`：竖直向下。
  - `column-reverse`：竖直向上。

设置主轴的排布：

- `justify-content: flex-start`：默认是 `flex-start`。
  - `flex-start`：靠近主轴的起点。
  - `flex-end`：靠近主轴的终点。
  - `center`：主轴居中。
  - `space-between`：平均分布，和主轴的起点和终点没有间距。
  - `space-around`：平均分布，和主轴的起点和终点有间距，两边的间距是中间的一半。
  - `space-evenly`：平均分布，间距一致。

弹性布局，设置水平居中只需要 `justify-content:center` 就可以实现，如果不是弹性布局，可以用下面的方式：

```css
display: block; /* 设置为块级元素 */
margin: 0 auto; /* auto 设置水平居中，必须是块元素 */
```

设置侧轴的排布：

- `align-items: stretch`：默认是 `stretch`。
  - `stretch`：拉伸，如果子元素没有设置高度或宽度，那么子元素会被拉伸到和父元素一样的高度或宽度。
  - `flex-start`：靠近侧轴的起点。
  - `flex-end`：靠近侧轴的终点。
  - `center`：侧轴居中。**单行的侧轴没有平均分布**。

换行：

- `flex-wrap: nowrap`：默认是 `nowrap`。
  - `nowrap`：不换行。
  - `wrap`：换行，如果侧轴排布是 `stretch`，换行以后是两行，那么两行会被拉伸，各占一半。

多行存在的时候，侧轴分布：

- `align-content: flex-start`：
  - `flex-start`：多行都向侧轴的起点靠拢。
  - `flex-end`：多行都向侧轴的终点靠拢。
  - `center`：多行居中。
  - `space-around`：平均分布，和侧轴的起点和终点有间距，两边的间距是中间的一半。
  - `space-between`：平均分布，和侧轴的起点和终点没有间距。
  - `space-evenly`：平均分布，间距一致。

弹性子元素会存在多个，如果要单独设置一个子元素侧轴的分布，可以给**弹性子元素添加属性**：

- `align-self: flex-start`：
  - `flex-start`：靠近侧轴的起点。
  - `flex-end`：靠近侧轴的终点。
  - `center`：侧轴居中。

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

#### flex-grow、flex-shrink、flex-basis

`flex` 是一个复合属性（`flex: {flex-grow} {flex-shrink} {flex-basiss}`），它有三个属性：`flex-grow`、`flex-shrink`、`flex-basis` ，分别是用来设置弹性子元素的拉伸、收缩和基准值。

- `flex-grow`：默认值 0。和 `flex: {num}` 的作用是一样的。
- `flex-shrink`：默认值 1。和 `flex: {num}` 的作用是相反的，当子元素的大小超过了主轴或者侧轴，那么设置了 `flex-shrink` 的子元素就会自动收缩。如果设置了换行，那么这个属性就没有用了。
- `flex-basis`：默认值 `auto`。设置主轴方向的元素的尺寸。如果主轴是横向的，那设置的就是宽度，如果是纵向的，那设置的就是高度。


### inline-flex

`display: inline-flex` 和 `display: flex` 的唯一区别就是会把元素本身变为行内元素，元素内部的子元素仍然是弹性子元素。

## 网格布局

弹性布局是基于轴线的布局，可以看作是**一维布局**，网格布局将容器划分成行和列，产生单元格，可以看作是**二维布局**。


概念：

1. **网格容器**：设置了 `display: grid;` 的元素即为网格容器。 
2. **项目**：网格容器里的**直接子元素**。

- `grid-template-columns`：设置网格容器的列宽和列的数量，例如 `grid-template-columns: 100px 200px 100px;` 表示网格容器有三列，列宽分别是 `100px`、`200px`、`100px`。
- `grid-template-rows`：设置网格容器的行高和行的数量，例如 `grid-template-rows: 100px 200px;` 表示网格容器有两行，行高分别是 `100px`、`200px`。

网格布局，是看不到网格线的，开发过程中，可以在浏览器中查看元素，选择 `grid` 标签，如下图：

![grid-debug](https://github.com/shipengqi/illustrations/blob/c0efa82375c756099df82a5c948cb093c3f2014b/frontend-learn/basic/grid-debug.png?raw=true)

### 划分网格

#### fr、auto、minmax

`fr`、`auto`、`minmax` 是网格布局的三个关键字，用来设置网格容器的列宽和行高。都是具有一定收缩性和扩展性的。

优先级：`minmax() > fr > auto`。

> `fr` 和 `auto` 最小值都是 0，过多内部存在子元素，那么最小值就是子元素的宽或者高。


##### fr

`fr`：单位（fraction），有点类似于弹性布局的 `flex-grow`，`fr` 的作用也是把整个容器内剩余的空间做均分，然后按照 `fr` 来分配。例如 `grid-template-columns: 60px 1fr;` 表示网格容器有两列，第一列的宽度是 `60px`，第二列的宽度是剩余的宽度。所有列都用 `fr` 来表示，例如 `grid-template-columns: 1fr 1fr;` 表示网格容器有两列，宽度各占一半。`fr` 可以快速的把整个网格空间利用起来，例如实现一个九宫格 `grid-template-columns: 1fr 1fr 1fr; grid-template-rows:  1fr 1fr 1fr;`


##### auto

`auto` 是用来设置宽高的默认值，但是在网格容器中，有一些特别的用处。

```html
<head>
    <style>
        .child3 {
            height: 30px;
            width: 100px;
            background-color: salmon;
        }
        .grid-container {
            height: 600px;
            width: 600px;
            background-color: black;
            display: grid;
            grid-template-columns: 60px 60px auto;
            grid-template-rows: 100px 200px;
        }
    </style>
</head>
<body>
    <div class="grid-container">
        <div>111</div>
        <div>222</div>
        <div class="child3">333</div>
    </div>
</body>
```

上面的示例，效果如下图：

![gird-auto](https://github.com/shipengqi/illustrations/blob/c0efa82375c756099df82a5c948cb093c3f2014b/frontend-learn/basic/gird-auto.png?raw=true)

`child3` 元素的宽度是 `100px`，但是这个元素所在的单元格的宽度是 `auto`，`auto` 忽略了子元素的宽度，占满了剩余空间。但是如果新增一例 `1fr`：

```css
.grid-container {
    /* ... */
    grid-template-columns: 60px 60px auto 1fr;
    grid-template-rows: 100px 200px;
}
```

`auto` 会自动收缩，正好等于子元素的宽度，如下图：

![grid-auto-fr](https://github.com/shipengqi/illustrations/blob/c0efa82375c756099df82a5c948cb093c3f2014b/frontend-learn/basic/grid-auto-fr.png?raw=true)

如果有多个 `auto`，例如 `grid-template-columns: 60px 60px auto auto;` 包含了两列 `auto`，这两列会把剩余空间平分，如下图：

![grid-multi-auto](https://github.com/shipengqi/illustrations/blob/c0efa82375c756099df82a5c948cb093c3f2014b/frontend-learn/basic/grid-multi-auto.png?raw=true)

但是一旦有了一列 `fr`，例如 `grid-template-columns: 60px 60px auto auto 1fr;`，所有的 `auto` 都会自动收缩。


##### minmax()

`minmax({min}, {max})`：用来设置一个范围，例如 `grid-template-columns: minmax(100px, 200px);` 表示网格容器的第一列的宽度在 `100px` 到 `200px` 之间。

注意 `min` 值不要设置的比 `max` 大，例如 `minmax(200px, 100px)` 或者 `minmax(1fr, 100px)`。

`minmax()` 的优先级是高于 `auto` 的，它会在最大的范围中去压缩 `auto` 的空间。

#### repeat

`repeat({重复次数}, {尺寸})`：用来设置重复的列或者行，例如 `grid-template-columns: repeat(3, 100px);` 表示网格容器有三列，列宽都是 `100px`。

##### auto-fill

`auto-fill`：会按照尺寸去尽可能的生成最多的列或者行，例如：

```css
.grid-container {
    height: 600px;
    width: 650px;
    background-color: black;
    display: grid;
    grid-template-columns: repeat(auto-fill, 100px);
    grid-template-rows: 100px 200px;
}
```

上面的示例，`repeat(auto-fill, 100px)` 根据当前容器的剩余空间 `650px` 最多就只能生成 6 列。

##### auto-fit

`auto-fit`：也是按照尺寸去尽可能的生成最多的列或者行，但是和 `auto-fill` 不同的是，它最终生成的列，如果没有元素，那么它会收缩为 0。

如果 `auto-fit` 的尺寸设置为 `minmax`，例如 `grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));`，那么会生成的列是会把剩余空间均分的。
但如果 `auto-fill` 的尺寸设置为 `minmax`，例如 `grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));`，那么会按照 `min` 也就是 `100px` 去生成列。

#### gap

`gap`：设置网格容器的行间距和列间距。

- 统一设置间距，例如 `grid-gap: 10px;` 表示网格容器的行间距和列间距都是 `10px`。
- 分别设置行和列的间距，例如 `grid-gap: 10px 20px;` 表示网格容器的行间距是 `10px`，列间距是 `20px`。也可以分开设置，例如 `row-gap: 10px; column-gap: 20px;`：
  - `row-gap`：行间距。
  - `column-gap`：列间距。

### 网格排布

网格布局的排列顺序默认是**先行后列**，例如下面的一个九宫格的示例：

```html
<style>
    .grid-container {
      height: 300px;
      width: 600px;
      background-color: black;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: repeat(3, 1fr);
      padding: 16px;
      font-size: 4rem;
      color: white;
    }
    .child {
      padding: 8px;
    }
    .child1 {
      background-color: #0055bb;
    }
    .child2 {
      background-color: #66bbff;
    }
    .child3 {
      background-color: #8440f1;
    }
    .child4 {
      background-color: #b88dff;
    }
    .child5 {
      background-color: #ff6666;
    }
    .child6 {
      background-color: #ffdd66;
    }
    .child7 {
      background-color: green;
    }
    .child8 {
      background-color: greenyellow;
    }
    .child9 {
      background-color: pink;
    }
</style>
<div class="grid-container">
  <div class="child child1">1</div>
  <div class="child child2">2</div>
  <div class="child child3">3</div>
  <div class="child child4">4</div>
  <div class="child child5">5</div>
  <div class="child child6">6</div>
  <div class="child child7">7</div>
  <div class="child child8">8</div>
  <div class="child child9">9</div>
</div>
```

显示效果：

![grid-sort-default](https://github.com/shipengqi/illustrations/blob/c0efa82375c756099df82a5c948cb093c3f2014b/frontend-learn/basic/grid-sort-default.png?raw=true)

元素先从第一行开始，从左到右排列。

使用 `grid-auto-flow: column` 设置为**先列后行**。

![grid-sort-column](https://github.com/shipengqi/illustrations/blob/c0efa82375c756099df82a5c948cb093c3f2014b/frontend-learn/basic/grid-sort-column.png?raw=true)

`grid-auto-flow` 属性除了设置成 `row` 和 `column`，还可以设成 `row dense` 和 `column dense`。这两个值主要用于，某些项目指定位置以后，剩下的项目怎么自动放置。

例如 `row dense`，表示"先行后列"，并且尽可能紧密填满，尽量不出现空格。

#### 网格元素的尺寸

网格中的子元素如果没有设置尺寸，那么默认会拉伸到所在网格的大小。

网格中子元素的大小和网格的大小是没有关系的：

- 如果网格的宽或者高是一个可变的值，例如 `1fr`，子元素的宽高大于 `1fr` 的时候会把网格撑开。
- 如果网格的宽或者高是一个固定的值，例如 `200px`，子元素的宽高大于 `200px` 的时候，子元素会忽略网格的大小。

#### order

网格子元素和弹性子元素一样也可以设置 `order` 属性来排序。网格子元素的 `order` 属性默认是 0.

#### 按网格线设置元素位置

网格边缘上的数字就是网格线的编号。列和行的网格线都是从 1 开始编号。下图中的负数，是反向编号，方便从后开始查找网格线。

![grid-lines](https://github.com/shipengqi/illustrations/blob/c0efa82375c756099df82a5c948cb093c3f2014b/frontend-learn/basic/grid-sort-default.png?raw=true)

每个网格都是由四根网格线包围的，例如上图中的元素 1，它是有行的 1 号、2 号，列的 1 号、2 号网格线包围的。可以通过指定元素上下左右的 4 根网格线来设置元素在网格中的位置。

例如上图，如果要把 7 号元素放到 2 号元素的位置：

```css
.child7 {
  background-color: green;
  grid-column-start: 2;
  grid-column-end: 3;
  grid-row-start: 1;
  grid-row-end: 2;
}
```

![grid-sort-lines](https://github.com/shipengqi/illustrations/blob/c0efa82375c756099df82a5c948cb093c3f2014b/frontend-learn/basic/grid-sort-lines.png?raw=true)

也可以占据多格，例如：

```css
.child7 {
  background-color: green;
  grid-column-start: 2;
  grid-column-end: 4;
  grid-row-start: 1;
  grid-row-end: 3;
}
```

![grid-sort-lines2](https://github.com/shipengqi/illustrations/blob/c0efa82375c756099df82a5c948cb093c3f2014b/frontend-learn/basic/grid-sort-lines2.png?raw=true)

- `grid-column-start: 2;` 和 `grid-column-end: 4;` 可以简写成 `grid-column: 2 / 4;`
- `grid-row-start: 1;` 和 `grid-row-end: 3;` 可以简写成 `grid-row: 1 / 3;`

##### 自定义网格线名称

网格线虽然后编号，但是不容易记住，可以在定义列和行时自定义网格的名称。

- `grid-template-columns: [line1 aaa] 100px [line2] 200px [line3] 300px [line4]`，
  - 第一列 `100px` 左边的网格线（编号 1）命名 `line1` 和 `aaa`。
  - 第二列 `200px` 左边的网格线（编号 2）命名为 `line2`。
  - 第三列 `300px` 左边的网格线（编号 3）命名为 `line3`，右边的网格线（编号 4）命名为 `line4`。
- `grid-template-rows: [line5] 100px [line6] 100px 100px`


1. 网格线可以定义多个名字，用空格分隔，如 `[line1 aaa]`。
2. 不需要定义所有的网格线名称，只定义需要用到的即可。如 `[line5] 100px [line6] 100px 100px`。
3. 定义了名称的网格线，编号仍然是可以使用的。

#### grid-template-areas

网格布局是可以预先将网格划分区域的，一个区域由一个或多个单元格组成。`grid-template-areas` 属性用于定义区域。

```css
.grid-container {
  display: grid;
  grid-template-columns: 100px 100px 100px;
  grid-template-rows: 100px 100px 100px;
  grid-template-areas: 'a a b'
                       'c c b'
                       'd e f';
}
```
面代码先划分出一个九宫格，然后定义了每个单元格所属的区域。

如果某些单元格不需要利用，则使用 `.` 表示：

```css
.grid-container {
  grid-template-areas: 'a a b'
                       'c c b'
                       '. . .';
}
.child1 {
  background-color: #0055bb;
  grid-area: a;
}
.child2 {
  background-color: #66bbff;
  grid-area: b;
}
.child3 {
  background-color: #8440f1;
  grid-area: c;
}
```

注意：

1. 划分区域的方式的缺点就是每一个单元格都要去设置区域，不用的单元格也要用 `.` 表示，如果单元格很多，就比较麻烦。
2. 网格线划分优先级要高于区域划分。
3. 区域的命名会影响到网格线。每个区域的起始网格线，会自动命名为 `区域名-start`，终止网格线自动命名为 `区域名-end`。

### 隐形网格

加入网格容器划分了九个单元格，但是我们在网格容器中放置了超过 10 个或者更多的子元素，这时，浏览器会自动生成多余的网格，以便放置子元素。这种自动生成的网格就叫做**隐形网格**。

`grid-auto-columns` 和 `grid-auto-rows` 属性就是用来设置，浏览器自动创建的多余网格的列宽和行高。如果不指定这两个属性，浏览器根据单元格内容的大小，决定新增网格的列宽和行高。

用法和 `grid-template-columns`、`grid-template-rows` 是一样的。

### 网格单元中子元素的位置

在单元格中的子元素，如果没有设置宽高，那么会自动撑满整个单元格，如果设置了宽高，那么可以使用 `justify-items` 和 `align-items` 来设置子元素在单元格中的位置。`justify-items` 和 `align-items` 都是容器属性。

- `justify-items`：水平方向，可选值 `start`，`end`，`center`，`strech`。默认值是 `strech`。
- `align-items`：垂直方向，可选值 `start`，`end`，`center`，`strech`。默认值是 `strech`。

容器设置了这两个属性后，所有单元格内的元素都会按照这个位置来排布。

如果想要单独设置某个单元格的子元素，可以使用 `justify-self` 和 `align-self`。使用方法和 `justify-items`、`align-items` 一样。

`place-self: {align-self} {justify-self}` 是 `justify-self` 和 `align-self` 的复合属性。

### 网格在容器中的位置

`justify-content`、`align-content` 用来设置整个网格在容器中的排布，分别表示水平方向和垂直方向的排布。当整个网格没有撑满容器时，就可以使用这两个属性，可选值：

- `start`：网格在起始边缘对齐。
- `end`：网格在结束边缘对齐。
- `center`：网格居中对齐。
- `strech`：网格单元大小保持不变，网格单元的间隔拉伸，填满容器。
- `space-around`：平均分布，每个网格单元的两侧的间隔相等。
- `space-between`：平均分布，网格单元的之间的间隔相等，第一个单元贴近起始边缘，最后一个贴近结束边缘。
- `space-evenly`：平均分布，间距一致。

### inline-grid

`display: inline-grid` 和 `display: grid` 的唯一区别就是会把元素本身变为行内元素，元素内部的子元素仍然是网格元素。

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


## 层

### 堆叠上下文

堆叠上下文就是一个独立的渲染层，里面的元素会按照自己的堆叠顺序进行渲染。

页面的 `<html>` 元素是一个默认就有堆叠上下文的，所以被叫做**根堆叠上下文**。在根堆叠上下文中，元素是可以产生自己的堆叠上下文的。

如何让一个元素产生堆叠上下文：

- 默认情况下，元素的 `position` 不是 `static`，`z-index` 不是 `auto`，那么该元素就会产生堆叠上下文。
- 弹性（Flex）元素或者网格（Grid）元素，只要设置了 `z-index` 不是 `auto`，那么该元素就会产生堆叠上下文。

### 堆叠顺序

1. 同一个堆叠上下文中，`z-index` 越大，元素的堆叠顺序越靠上。
2. 同一个堆叠上下文中，`z-index` 相同，那么元素的堆叠顺序就按照元素在 DOM 中的先后顺序。

设置 `z-index` 只在元素所在的堆叠上下文中有效。一个堆叠上下文中子元素，无论设置的 `z-index` 是多少，都不会影响其他堆叠上下文的堆叠顺序。如下图：

![z-index](https://github.com/shipengqi/illustrations/blob/c0efa82375c756099df82a5c948cb093c3f2014b/frontend-learn/basic/z-index.png?raw=true)

元素 `A` 产生了堆叠上下文，并且 `z-index` 为 1，元素 `B` 是 `A` 的子元素，`z-index` 为 20。但是元素 `B` 的是无法覆盖的元素 `C` 的。

也就是说，**任意元素的堆叠顺序是会被自己的祖先元素的堆叠上下文限制的**，只有那些**不存在祖先元素有堆叠上下文的元素，才能参与到根堆叠上下文的堆叠顺序中**。所以碰到 `z-index` 层级高却无法覆盖层级低的元素，就要先去检查一下祖先元素是否有堆叠上下文，然后再设置 `z-index`。


上图中，非 `static` 元素是介于 0 和 1 之间的，只要元素设置了 `position` 并且不是 `static`，那么元素就会跳到红色层级。



