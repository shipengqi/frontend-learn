# HTML 标签

## 目录
- [基础标签](#基础标签)
- [格式标签](#格式标签)
- [表单](#表单)
- [iframe](#iframe)
- [图像](#图像)
- [链接](#链接)
- [列表](#列表)
- [表格](#表格)
- [样式](#样式)
- [元信息](#元信息)
- [脚本](#脚本)

## 基础标签 ##
不包括 HTML5 中废弃的标签和属性。HTML5 废弃了那些可以被 CSS 代替的元素和属性，如`<big>`，`<center>`，`<font>`，`<strike>`等，属性有`align`，`size`等。
也不包括 HTML5 中新增的标签。

以下标签没有特别声明，都是默认支持支持[HTML全局属性](global_event_props.md#全局属性)和[HTML事件属性](global_event_props.md#事件属性)。

### DOCTYPE
`<!DOCTYPE>`用来告知浏览器页面使用了哪种 HTML 版本。位于文档中最前面的位置，在`<html>`标签之前

### html
`<html></html>`用来告知浏览器这是一个 HTML 文档。所有 HTML 元素的容器（除了`<!DOCTYPE>`）。

**H5新增属性**
- `manifest`，缓存 HTML 文档，用于离线浏览。

** 不 支持[HTML事件属性](global_event_props.md#事件属性)。**

### title
`<title></title>`网页标题，在`<head></head>`中使用，标题会显示在浏览器的标题栏。`<title></title>`一个文档只能有一个。

** 不 支持[HTML事件属性](global_event_props.md#事件属性)。**

### body

`<body></body>`网页主体，包含文档的所有内容。标题会显示在浏览器的标题栏。

在 HTML 5 中，删除了所有 body 元素的"呈现属性"，可以用 CSS 代替。不建议再使用。


### 标题
`<h1></h1>`到`<h6></h6>`分别是一级标题到六级标题。


### 段落
`<p></p>` 用来开始一个段落。


### 换行
`<br />` 段落内换行。



### 水平线
`<hr />` 显示一条水平分割线。


## 格式标签 ##

### abbr
`<abbr></abbr>` 标签用来表示一个缩写词或者首字母缩略词。

**属性：**
- `title`，用来展示缩写词的完整版本。



### address

`<address></address>` 定义文档作者的信息。一般在`<footer>`标签中。

**属性：**
- `title`，用来展示缩写词的完整版本。


### b
`<b></b>`粗体，建议使用`<strong>`代替，表示重要的文本。

### bdo

`<bdo></bdo>`文字的方向。

**属性：**
- `dir`，必需有，指定文本显示的方向。
  - `ltr`，`left to right`从左向右
  - `rtl`，`right to left`从右向左


### blockquote

`<blockquote></blockquote>`定义这段是引用自另一个源。`<blockquote>`会被浏览器自动缩进。

**属性：**
- `cite`，引用的来源的 URL。可以是绝对路径，也可以是相对路径。

### cite
`<cite></cite>`定义作品（书籍，画，音乐等）的标题。

### code
`<code></code>`表示这是一段代码。短语标签，短语标签如果只是为了达到某种视觉效果的话，都建议使用 CSS 代替。

下面的标签都是短语标签。
```html
<em>强调文本</em><br>
<strong>加粗文本</strong><br>
<dfn>定义项目</dfn><br>
<code>一段电脑代码</code><br>
<samp>计算机样本</samp><br>
<var>变量</var>
```

### del
`<del></del>`表示这是一段删除的文本，就是在文本上加一条横线。和`<ins>`（在文本下加一条下划线）一起使用，表示更新和修正。

**属性：**
- `cite`，文本被删除的原因的 URL。可以是绝对路径，也可以是相对路径。
- `datetime`，被删除的日期和时间。格式`YYYY-MM-DDThh:mm:ssTZD`。

### dfn

`<dfn></dfn>`表示一个项目，短语标签。

### em

`<em></em>`强调文本，短语标签。

### i
`<i></i>`斜体，短语标签。

### ins
`<ins></ins>`新插入部分的文本，文本下加下划线。

**属性：**
- `cite`，文本被插入的原因的 URL。
- `datetime`，被删除的日期和时间。格式`YYYY-MM-DDThh:mm:ssTZD`。


### pre
`<pre></pre>`预格式化的文本，`<pre>`标签中的文本通常会保留空格和换行符。而文本也会呈现为等宽字体。

### q
`<q></q>`定义一个短的引用，浏览器会自动在引用的周围插入引号。

**属性：**
- `cite`，引用源的 URL。

### s
`<s></s>`表示这是一段不正确的文本，就是在文本上加一条横线，如果文本要被替换使用`<del>`。

### samp

`<samp></samp>`来定义计算机程序的样本文本，短语标签。

### small

`<small></small>`小型文本。用来写注释什么的。

### strong

`<strong></strong>`重要的文本，短语标签。

### sub

`<sub></sub>`下标文本，在正常文本高度的一半的下方显示。

### sup

`<sup></sup>`下标文本，在正常文本高度的一半的上方显示。

### var

`<var></var>`定义变量，短语标签。


## 表单 ##

### form
`<form></form>`创建一个表单，表单元素的容器。

**属性：**
- `accept-charset`，规定服务器可处理的表单数据字符集。
- `action`，提交表单时发送的 URl。
- `enctype`，就是`content-type`，只有是`method=post`时适用。
- `method`，提交方法，`get`或`post`。
- `name	`，表单名。
- `target`，打开`action url`的方式，可选值`_blank`，`_self`，`_parent`，`_top`。

### input

`<input></input>`输入控件，用`<label>`标注这个元素。

**属性：**
- `accept`，提交的文件的类型(只针对`type="file"`)。
- `alt`，定义图像输入的替代文本。 (只针对`type="image"`)。
- `checked`，指定页面加载时应该被选定的默认的`<input>`元素(只针对`type="checkbox"`或者`type="radio"`)。
- `disabled`，禁用。
- `name`， `<input>`的元素名。
- `readonly`，只读。
- `size`，指定以字符数计的`<input>`元素的宽度。默认`20`。
- `src`， 使用图像作为提交按钮时，指定图像的 URL。 (只针对`type="image"`)。
- `value`，输入的值。
- `type`，指定`<input>`的类型。
  - button，普通按钮
  - checkbox，复选框
  - color
  - date
  - datetime
  - datetime-local
  - email
  - file，上传文件时使用，查找文件磁盘路径
  - hidden，传送一些对用户不可见的数据
  - image，使用图像作为提交按钮
  - month
  - number
  - password，密码，输入字符会议`*`显示
  - radio，单选按钮
  - range
  - reset，清除数据
  - search
  - submit，提交按钮
  - tel
  - text，文本字段
  - time
  - url
  - week

### textarea

`<textarea></textarea>`多行文本输入控件。

**属性：**
- `cols`，文本区域的宽度，建议使用 CSS 的 height 和 width 属性。
- `rows`，文本区域的行数。
- `name`， 元素名。
- `readonly`，只读。

### button

`<button></button>`按钮，在`<button>`元素内，可以放置内容（文本或图像）。这是该元素与使用`<input>`元素创建的按钮之间的不同之处。
注意要指定`<button>`元素`type`属性，因为不同浏览器的`type`的默认值是不同的。在表单中创建按钮使用`<input>`，因为如果在 HTML 表单中使用`<button>`元素，
不同的浏览器可能会提交不同的按钮值。

**属性：**
- `disabled`，禁用。
- `name`， 元素名。
- `value`，按钮的初始值。
- `type`，指定按钮的类型。
  - button
  - reset
  - submit

### select

`<select></select>`下拉列表，`<option>`标签定义列表中的可用选项。

**属性：**
- `disabled`，禁用。
- `name`， 元素名。
- `multiple`，多选。
- `size`，指定可见选项的数目。

### option

`<option></option>`下拉列表中的选项，配合`<select>`标签或者`<datalist>`使用。

**属性：**
- `disabled`，禁用。
- `label`， 描述。
- `selected`，选中状态。
- `value`， 选项的值。


### optgroup

`<optgroup></optgroup>`把相关的选项组合在一起，配合`<select>`标签使用。

**属性：**
- `disabled`，禁用。
- `label`， 描述。

```html
<select>
  <optgroup label="Swedish Cars">
    <option value="volvo">Volvo</option>
    <option value="saab">Saab</option>
  </optgroup>
  <optgroup label="German Cars">
    <option value="mercedes">Mercedes</option>
    <option value="audi">Audi</option>
  </optgroup>
</select>
```

### label

`<label></label>` `input`元素的标注。

**属性：**
- `for`，指定`label`绑定的表单元素。

```html
<form action="demo_form.asp">
  <label for="male">Male</label>
  <input type="radio" name="sex" id="male" value="male"><br>
  <label for="female">Female</label>
  <input type="radio" name="sex" id="female" value="female"><br>
  <input type="submit" value="提交">
</form>
```

### fieldset

`<fieldset></fieldset>`将表单内的相关元素分组，在相关表单元素周围绘制边框。`<legend>`标签为`<fieldset>`元素定义标题。


```html
<form>
  <fieldset>
    <legend>Personalia:</legend>
    Name: <input type="text"><br>
    Email: <input type="text"><br>
    Date of birth: <input type="text">
  </fieldset>
</form>
```

### legend
`<legend></legend>`为`<fieldset>`元素定义标题。

## iframe ##
`<iframe></iframe>`为`<fieldset>`定义一个内联框架。用来在当前 HTML 文档中嵌入另一个文档。

**属性：**
- `height`，指定高度。
- `width`， 指定宽度。
- `name`， 元素名。
- `src`，显示的文档的 URL。

## 图像 ##

### img
`<img />`图像。`src`和`alt`是必需的属性。
图像本质上并不会插入 HTML 页面中，而是链接到 HTML 页面上。`<img>`的作用是为被引用的图像创建占位符。

**属性：**
- `alt`，替代文本。
- `height`， 指定高度。
- `width`， 指定宽度。
- `usemap`， 将图像定义为客户器端图像映射，是带有可点击区域的图像。与`<map>`一起使用，只有当`<img>`元素不属于`<a>`或`<button>`元素的后代元素时，才允许使用`usemap`属性。
`usemap`属性与`<map>`元素中的`name`相关联。
- `src`，显示的图像的 URL。

```html
<img src="planets.gif" width="145" height="126" alt="Planets" usemap="#planetmap" />

<map name="planetmap">
  <area shape="rect" coords="0,0,82,126" href="sun.htm" alt="Sun">
  <area shape="circle" coords="90,58,3" href="mercur.htm" alt="Mercury">
  <area shape="circle" coords="124,58,8" href="venus.htm" alt="Venus">
</map>
```

在HTML 中可以把图片划分成多个热点区域，每个热点区域链接到不同的 url，如上面的例子，使用`usemap`指定了映射的图像，然后通过`<area>`定义热点区域的链接，形状，和坐标。
### map
`<map></map>`用于客户端图像映射。必需在`<map>`内使用。


**属性：**
- `name`，必需，命名，对应`<img>`中的`usemap`。

### area
`<area />`定义图像映射内部的区域。必需在`<map>`内使用。


**属性：**
- `alt`，替代文本。
- `coords`， 区域坐标。
- `href`，区域目标的 URL。
- `shape`， 区域的形状，可选值`default`，`rect`，`circle`，`poly`。
- `target`， 打开`url`的方式，可选值`_blank`，`_self`，`_parent`，`_top`，`framename`。


## 链接 ##

### a
`<a></a>`超链接，用于从一个页面链接到另一个页面，可以是相对路径，也可以是绝对路径。绝对路径可以精确定位资源的位置，但是不利于测试和站点移植，
而相对路径解决了绝对路径的缺点，但是只能定位同一站点的资源。
如果没有使用`href`属性，则不能使用`hreflang`、`media`、`rel`、`target`以及`type`属性。

**属性：**
- `href`，最重要的属性，链接的目标 URL。
- `hreflang`， 目标 URL 的基准语言。
- `target`， 打开`url`的方式，可选值`_blank`，`_self`，`_parent`，`_top`，`framename`。默认是`_self`
- `rel`，文档与目标 URL 之间的关系。
  - alternate
  - author
  - bookmark
  - help
  - license
  - next
  - nofollow
  - noreferrer
  - prefetch
  - prev
  - search
  - tag

`<a>`可以分为三种：

#### 内部链接，只同一站点的资源。
#### 锚点链接
先建立锚点，语法`<a name="锚点名"></a>`。这个锚点名最好区分大小写，并且每个锚点名不能相同。
链接当前页面锚点语法`<a href="#锚点名"></a>`：
```html
<a href="#test"></a>
<a name="test"></a>
```

链接其他页面锚点语法`<a href="url#锚点名"></a>`：
```html
<a href="doc#test"></a>
<a name="test"></a>
```
#### 外部链接
一般为`<a href="https://website/"></a>`

```html
<a href="https://www.google.com">Google</a>
<!-- 链接到邮箱 -->
<a href="mailto:pooky.shipengqi@gmail.com">发送邮件</a>
<!-- 链接到ftp -->
<a href="ftp://ftp.tsinghua.edu.com">FTP</a>
<!-- 链接到telnet -->
<a href="telnet://..">Telnet</a>
<!-- 下载文件 -->
<a href="...test.zip">下载文件</a>
```

### link
`<link />`链接外部资源。最常见的用途是链接样式表。只能在`<head>`标签内。

**属性：**
- `href`，链接的目标 URL。
- `hreflang`， 被链接文档中文本的语言。
- `media`， 被链接文档将显示在什么设备上。
- `rel`，文档与目标 URL 之间的关系。可选项：alternate，archives，author，bookmark，external，first，help，icon，
last，license，next，nofollow，noreferrer，pingback，prefetch，prev，search，sidebar，stylesheet，tag，up。
- `type`，被链接文档的 MIME 类型。


## 列表 ##

### ul
`<ul></ul>`无序列表。

### ol
`<ol></ol>`有序列表。

**属性：**
- `type`， 列表的类型。建议使用 CSS 代替。可选项：1，A，a，I，i

### li
`<li></li>`列表中的选项。可以用在`<ol>`，`<ul>`中。

### dl
`<dl></dl>`描述列表。与`<dt>`，`<dd>`一起使用。

```html
<dl>
  <dt>Coffee</dt>
    <dd>Black hot drink</dd>
  <dt>Milk</dt>
    <dd>White cold drink</dd>
</dl>
```

### dt
`<dt></dt>`描述列表的选项。


### dd
`<dd></dd>`对描述列表的选项进行描述。

## 表格 ##

### table
`<table></table>`表格。`<tr>`定义表格行，`<th>`定义表头，`<td>`定义表格单元。

**属性：**
- `border`，单元是否拥有边框。`1`或者空字符串。

```html
<table border="1">
<caption>Monthly savings</caption>
<tr>
<th>Month</th>
<th>Savings</th>
</tr>
<tr>
<td>January</td>
<td>$100</td>
</tr>
</table>
```

### caption
`<caption></caption>`表格的标题。必须放到`<table>`标签之后。

**属性：**
- `border`，单元是否拥有边框。`1`或者空字符串。

### th
`<th></th>`单元格表头。

**属性：**
- `border`，指定表头单元格可横跨的列数。
- `rowspan`，指定表头单元格可横跨的行数。
- `headers`，指定表头单元格相关联的一个或多个单元格表头。
- `scope`，指定表头单元格是否是行、列、行组或列组的头部。
  - `col`	单元格是列的表头。
  - `row`	单元格是行的表头。
  - `colgroup`	单元格是列组的表头。
  - `rowgroup`	单元格是行组的表头。

### tr
`<tr></tr>`表格中的行。

### td
`<td></td>`标准单元格。

**属性：**
- `border`，指定单元格可横跨的列数。
- `rowspan`，指定单元格可横跨的行数。
- `headers`，指定单元格相关联的一个或多个单元格表头。

### thead
`<thead></thead>`表格的表头内容。与`<tbody>`和`<tfoot>`元素一起使用，指定表格的各个部分（表头、主体、页脚）。
`<thead>`只能在`<table>`标签中，在`<caption>`和`<colgroup>`之后，`<tbody>`、`<tfoot>`和`<tr>`之前。
`<thead>`内至少有一个`<tr>`。

### tbody
`<tbody></tbody>`表格的主体。

### tfoot
`<tfoot></tfoot>`表格的页脚。

### colgroup
`<colgroup></colgroup>`对表格中的列进行组合。可以向整个列应用样式，而不需要重复为每个单元格或每一行设置样式。

**属性：**
- `span`，列组应该横跨的列数。

```html
<table border="1">
  <colgroup span="2" style="background:red"></colgroup>
  <tr>
    <th>ISBN</th>
    <th>Title</th>
    <th>Price</th>
  </tr>
  <tr>
    <td>3476896</td>
    <td>My first HTML</td>
    <td>$53</td>
  </tr>
  <tr>
    <td>5869207</td>
    <td>My first CSS</td>
    <td>$49</td>
  </tr>
</table>
```
### col
`<col />` `<colgroup>`标签内的每一列的列属性。

**属性：**
- `span`，指定`<col>`应该横跨的列数。

```html
<table border="1">
  <colgroup>
    <col span="2" style="background-color:red">
    <col style="background-color:yellow">
  </colgroup>
  <tr>
    <th>ISBN</th>
    <th>Title</th>
    <th>Price</th>
  </tr>
  <tr>
    <td>3476896</td>
    <td>My first HTML</td>
    <td>$53</td>
  </tr>
</table>
```

## 样式 ##

### style
`<style></style>`定义样式。

**属性：**
- `media`，指定样式表不同的媒体类型。
- `type`，样式表的 MIME 类型。

### div
`<div></div>`定义一个区块。

**属性：**
- `media`，指定样式表不同的媒体类型。
- `type`，样式表的 MIME 类型。

### span
`<span></span>`对文档中的行内元素进行组合。如果`<span>`没有样式，那么与其他文本一样。

**属性：**
- `media`，指定样式表不同的媒体类型。
- `type`，样式表的 MIME 类型。

## 元信息 ##

### head
`<head></head>`所有头部元素的容器。必须包含标题（`<title>`）
其他可以包含的元素`<style>`，`<base>`，`<link>`，`<meta>`，`<script>`，`<noscript>`。

** 不 支持[HTML事件属性](global_event_props.md#事件属性)。**

### meta
`<meta></meta>`元数据。

**属性：**
- `content`，定义与`http-equiv`或`name`属性相关的元信息。
- `http-equiv`，把 content 属性关联到 HTTP 头部。可选项:`refresh`，`default-style`（预定义的样式表），`content-type`。
- `name`，用于描述网页，SEO，可选项:`application-name`，`author`，`description`，`generator`，`keywords`。

设置网页的描述说明：
```html
<head>
  <!-- 设置关键字为 HTML, CSS -->
  <meta name="keywords" content="HTML, CSS">
  <!-- 设置网页描述为 HTML学习 -->
  <meta name="description" content="HTML学习">
  <!-- 设置作者为 Pooky -->
  <meta name="author" content="Pooky" />
</head>
```

设置网页的编码方式为`utf-8`：
```html
<meta http-equiv="content-type" content="text/html; charset="UTF-8" />
```
设置定时刷新：
```html
<!-- 设置为60秒刷新 -->
<meta http-equiv="refresh" content="60">

<!-- 设置为每隔60秒跳转到 www.website.com -->
<meta http-equiv="refresh" content="60;URL=www.website.com">
```

** 不 支持[HTML全局属性](global_event_props.md#全局属性)。**

### base
`<base />`设置文档中所有相对路径的`base_url`。

**属性：**
- `href`，指定样式表不同的媒体类型。
- `target`， 打开`url`的方式，可选值`_blank`，`_self`，`_parent`，`_top`，`framename`。该属性会被每个链接中的`target`属性覆盖。

** 不 支持[HTML事件属性](global_event_props.md#事件属性)。**

## 脚本 ##

### script
`<script></script>`包含`js`脚本。也可以链接外部脚本。如果使用了`src`属性，标签内必须为空。
如果既不使用`async`（H5新增）也不使用`defer`，浏览器会在解析页面之前，读取并执行脚本
**属性：**
- `charset`，字符编码（仅适用于外部脚本）。
- `defer`，当页面已完成解析后，执行脚本（仅适用于外部脚本）。
- `src`，外部脚本的 URL。
- `type`， MIME 类型。

### noscript
`<noscript></noscript>`在不支持脚本的浏览器中，可以显示`<noscrip>`中的内容。可以在`<head>`或者`<body>`中。

** 不 支持[HTML事件属性](global_event_props.md#事件属性)。**