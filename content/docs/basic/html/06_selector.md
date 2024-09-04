---
title: CSS 选择器
weight: 6
---

# CSS 选择器

- 通用选择器，`*` 匹配任何元素。
- 标签选择器，匹配所有对应标签的元素。
- 类名选择器，匹配所有 `class` 属性中包含对应类名的元素。
- ID 选择器，匹配 id 属性等于指定值的元素。
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

| 选择器     | 含义                      | 示例                                                      |
|---------|-------------------------|---------------------------------------------------------|
| `A B`   | 后代选择器                   | `div p { color: #f00; }`、`#nav li { display: inline; }` |
| `A > B` | 直接子元素选择器                | `div > p { color: #f00; }`                              |
| `A + B` | 相邻兄弟选择器，两个挨着的同级元素       | `div + p { color: #f00; }`                              |
| `A ~ B` | 通用兄弟选择器，只要是同级的元素，不需要紧挨着 | `div ~ p { color: #f00; }`                              |

## 多元素选择器

`A,B` 多元素选择器，同时匹配所有 A 元素或 B 元素，`,` 分隔。

## 伪类选择器

伪类可以简单理解为是一种状态，条件，可以通过伪类选择器再配合一些其他选择器来选中页面当中已经存在的元素。

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
  - `:first-child`：选择其父元素的**第一个**子元素。
  - `:last-child`：选择其父元素的**最后一个**子元素。
  - `:only-child`：选择其父元素的**唯一**子元素。也就是说这个父元素中只有一个子元素。
  - `:only-of-type`：选择其父元素中**唯一**的某个**特定类型**的元素。
  - `:first-of-type`：选择其父元素中**第一个**的某个**特定类型**的元素。与 `:first-child` 不同，`:first-of-type` 不关心元素是否是第一个子元素，关注的是是否为第一个该类型的子元素。
  - `:last-of-type`：选择其父元素中**最后一个**的某个**特定类型**的元素。
  - `:nth-child`：选择其父元素中第 `n` 个子元素。`n` 可以是一个数字，也可以是一个公式（例如 `2n+1`）。
  - `:nth-last-child`：选择其父元素中**倒数**第 `n` 个子元素。
  - `:nth-of-type`：选择其父元素中第 `n` 个**特定类型**的子元素。
  - `:nth-last-of-type`：选择其父元素中**倒数**第 `n` 个**特定类型**的子元素。
- 其他伪类
  - `:root`：根元素。
  - `:empty`：没有子元素的元素。

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

伪元素用于创建一些不在 DOM 树中的元素，‌并为其添加样式。‌虽然用户可以看到这些元素，但是这些文本实际上不在 DOM 树中。

常用的伪元素选择器：

- `::before`，`::after`：在一个元素前或后插入一些内容，文字，图片等，‌并添加样式。
- `::first-line`，`::first-letter`：可以理解为把元素内的第一行文字或者第一个文字变成一个虚拟元素，‌并添加样式。
- `::selection`：为选中效果设置样式。
- `::placeholder`

最新的标准伪元素前面都是 `::`，`:` 不再推荐使用。

[MDN Web Docs (Pseudo-elements)](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-elements)。

> 伪元素不能被 JS 获取操控的。

### `::before`、`::after`

可以在元素的内容前面或者后面插入新内容。`content` 属性是必须设置的，否则不会显示在页面中。可以设置为空字符串。

```css
/* 在每个 h1 元素前面插入一幅图片 */
h1::before 
{
    content:url(smiley.gif);
}

/* 在每个 h1 元素后面插入一幅图片 */
h1::after
{
  content:url(smiley.gif);
}

/* 在每个 h1 元素后面插入字符 */
h1::after
{
  content: '222';
}

/* 可以为空，但是 content 必须在 */
h1::after
{
  content: '';
}
```

默认情况下，`::before`、`::after` 伪元素都是行内元素，这是宽高是无效的，如果需要设置宽高，可以把元素改为块元素：

```css
h1::after
{
  content: '222';
  display: block;
  /*display: inline-block;*/
  width: 100px;
  height: 100px;
}
```


## 优先级

### 特指性等级

| 选择器                               | 特指性等级 |
|-----------------------------------|-------|
| 通用选择器，关系选择器（`+`、`>`、`~`），否定伪类（`:not()`） | 0     |
| 标签选择器和伪元素                         | 1     |
| Class 选择器，属性选择器，伪类                | 2     |
| ID 选择器                            | 3     |
| 内联样式                              | 4     |
| `!important`                      | 5     |

特指性等级数值越大，优先级越高。`!important` 是最高优先级。内联样式仅次于 `!important`。

### 值计算

每一段 CSS 语句的选择器都可以对应一个具体的数值，数值越大优先级越高。

- 一个 0 级选择器优先级数值 `+0`。
- 一个 1 级选择器优先级数值 `+1`。
- 一个 2 级选择器优先级数值 `+10`。
- 一个 3 级选择器优先级数值 `+100`。

示例：

| 选择器 | 计算值   |
|----|-------|
| `*` | 0     |
| `button` | 1     |
| `ul > li` | 1+0+1 |
| `a:not([target="_blank"])` | 1+0+10 |
| `#list .item p` | 100+10+1 |

