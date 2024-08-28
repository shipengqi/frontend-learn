---
title: CSS 选择器
weight: 6
---

# CSS 选择器

- 通用选择器，`*`
- 标签选择器
- 类名选择器
- ID 选择器
- 属性选择器
  - `[attr]`：存在某个属性，无论该属性有没有值
  - `[attr=value]`：属性等于特定值
  - `[attr~=value]`：属性具有多个空格分隔的值中的一个。例如一个元素具有属性 `class="btn btn-primary"`，那么可以被 `[class~="btn"]` 所匹配。
  - `[attr|=value]`：属性值是特定值或以 `{值}-` 开始。例如选择器 `[title|="hello"]`：
    - 一个元素具有属性 `title="hello"`，可以匹配
    - 一个元素具有属性 `title="hello-1"`，可以匹配
    - 一个元素具有属性 `title="hello1"`，不可以匹配
  - `[attr^=value]`：属性值以特定值开始。例如选择器 `[title^="hello"]`：
    - 一个元素具有属性 `title="hello"`，可以匹配
    - 一个元素具有属性 `title="hello-1"`，可以匹配
    - 一个元素具有属性 `title="hello1"`，可以匹配
  - `[attr$=value]`：属性值以特定值结束。例如选择器 `[title$="abc"]`：
    - 一个元素具有属性 `title="hello"`，不可以匹配
    - 一个元素具有属性 `title="hello-abc"`，可以匹配
    - 一个元素具有属性 `title="helloabc"`，可以匹配
  - `[attr*=value]`：属性值包含特定值。例如选择器 `[title*="abc"]`：
    - 一个元素具有属性 `title="heabcllo"`，可以匹配
    - 一个元素具有属性 `title="hello-abc"`，可以匹配
    - 一个元素具有属性 `title="helloabc"`，可以匹配
    - 一个元素具有属性 `title="abchello"`，可以匹配

## 组合选择器

例如 `h1.test[title*="abc"]`，这是一个组合选择器，表示含有 `class=test` 和符合 `[title*="abc"]` 的 `h1` 标签。

组合选择器的顺序是可以随意的，但是**标签选择器因为没有特定的前缀符号，所以只能放在第一个**，例如 `.testh1` 会被认为是 `class=testh1`。

## 关系选择器

### 后代选择器
### 直接元素选择器
### 相邻兄弟选择器
### 通用兄弟选择器

## 伪类选择器

伪类可以简单理解为是一种状态，大部分伪类选择器，都表示的元素处于某种状态。

常用的伪类选择器：

- 链接伪类
  - `link`：普通的、未被访问的链接。
  - `visited`：用户已访问的链接。
- 用户行为伪类
  - `:hover`：鼠标指针位于其上。
  - `:active`：用户正在点击的元素。
  - `:focus`：元素获得焦点。
- 输入表单伪类
  - `:enabled`：用户可以编辑的元素。
  - `:disabled`：用户无法编辑的元素。
  - `:checked`：复选框或单选框被选中。
- 位置/结构伪类
  - `:first-child`：选择其父元素的第一个子元素。
  - `:last-child`：选择其父元素的最后一个子元素。
  - `:only-child`：选择其父元素的唯一子元素。也就是说这个父元素中只有一个子元素。
  - `:only-of-type`：选择其父元素中唯一的某个特定类型的元素。
  - `:first-of-type`，`:last-of-type`，`:nth-child`，`:nth-last-child`，`:nth-of-type`，`:nth-last-of-type`
- 其他伪类
  - `:root`：根元素。
  - `:empty`：元素没有子元素。

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

## 伪元素选择器

伪元素用于创建一些不在 DOM 树中的元素，‌并为其添加样式。‌例如，‌`:before` 和 `:after` 伪元素可以在一个元素前或后增加一些文本，‌并为这些文本添加样式。‌虽然用户可以看到这些文本，但是这些文本实际上不在 DOM 树中。

[MDN Web Docs (Pseudo-elements)](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-elements)。

### `::before`、`:before`

可以在元素的内容前面插入新内容。

```css
/* 在每个 h1 元素前面插入一幅图片 */
h1:before 
{
    content:url(smiley.gif);
}
```

### `::after`、`:after`

可以在元素的内容之后插入新内容。

```css
/* 在每个 h1 元素后面插入一幅图片 */
h1:after 
{
    content:url(smiley.gif);
}
```

### 优先级

CSS 选择器优先级：`ID > Class > Tag > *`