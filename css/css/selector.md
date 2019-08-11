# CSS 选择器

- `.class`，类选择器，如`.title`是选择所有`class="title"`的元素。
- `#id`，id选择器，如`.myid`是选择所有`id="myid"`的元素。
- `*`，选择所有元素
- `element,element,...`，如`p`是选择所有`<p>`的元素。`div,p`选择所有`<div>`元素和`<p>`元素。
- `element.class`，如`p.marked`选择所有`class="marked"`的`p`元素。
- `.class element`，如`.marked p`选择所有`class="marked"`元素内部的的`p`元素。
- `element element`，后代选择器，如`div p`选择`<div>`元素内的所有`<p>`元素，注意与上面的选择器不同是少了逗号`,`。
- `element>element`，子元素选择器，如`div>p`选择所有父级是`<div>`元素的`<p>`元素。
- `element+element`，相邻兄弟选择器，如`div+p`选择所有紧接着`<div>`元素之后的`<p>`元素。
- `element1~element2`，后续兄弟选择器，选取所有指定元素之后的相邻兄弟元素，如`p~ul`选择`p`元素之后的每一个`ul`元素。

## 属性选择器

- `[attribute]`，如`[target]`选择所有带有`target`属性元素。
- `[attribute=value]`，如`[target=-blank]`选择所有使用`target="-blank"`的元素。
- `[attribute~=value]`，如`[title~=flower]`选择`title`属性包含单词`"flower"`的所有元素。
- `[attribute|=language]`，如`[lang|=en]`选择一个`lang`属性的起始值`="EN"`的所有元素。
- `[attribute^=value]`，如`a[src^="https"]`选择每一个`src`属性的值以`https`开头的元素。
- `[attribute$=value]`，如`a[src$=".pdf"]`选择每一个`src`属性的值以`.pdf`结尾的元素。
- `[attribute*=value]`，如`a[src*="runoob"]`选择每一个`src`属性的值包含子字符串`runoob`的元素。

## 伪类
比如`a:link`中`link`是一个伪类。语法：
```css
selector:pseudo-class {property:value;}

/*CSS类也可以使用伪类*/
selector.class:pseudo-class {property:value;}
```

- `:link`，如`a:link`选择所有未访问链接。
- `:visited`，如`a:visited`选择所有访问过的链接。
- `:active`，如`a:active`链接被点击时。
- `:hover`，如`a:hover`选择鼠标在链接上面时。

- `:focus`，如`input:focus`选择具有焦点的输入元素。
- `:enabled`，如`input:enabled`选择每一个已启用的输入元素。
- `:disabled`，如`input:disabled`选择每一个禁用的输入元素。
- `:checked`，如`input:checked`选择每个选中的输入元素。
- `:not(selector)`，如`:not(p)`选择每个并非`p`元素的元素。
- `::selection`，如`::selection`匹配元素中被用户选中或处于高亮状态的部分。
- `:out-of-range`，如`:out-of-range`匹配值在指定区间之外的`input`元素。
- `:in-range`，如`:in-range`匹配值在指定区间之内的`input`元素。
- `:read-write`，如`:read-write`用于匹配可读及可写的元素。
- `:read-only`，如`:read-only`用于匹配设置 "readonly"（只读） 属性的元素。
- `:optional`，如`:optional`用于匹配可选的输入元素。
- `:required`，如`:required`用于匹配设置了`required`属性的元素。
- `:valid`，如`:valid`用于匹配输入值为合法的元素。
- `:invalid`，如`:invalid`用于匹配输入值为非法的元素。

## 伪元素
比如`p:first-line`中`first-line`是一个伪元素。语法：
```css
selector:pseudo-element {property:value;}

/*CSS类也可以使用伪元素*/
selector.class:pseudo-element {property:value;}
```

- `:first-letter`，如`p:first-letter`选择每一个`<P>`元素的第一个字母。
- `:first-line`，如`p:first-line`选择每一个`<P>`元素的第一行。
- `:first-child`，如`p:first-child`选择当`<p>`元素是第一个子元素。
- `:before`，如`p:before`在每个`<p>`元素之前插入内容。
- `:after`，如`p:after`在每个`<p>`元素之后插入内容。
- `:lang(language)`，如`p:lang(it)`选择一个lang属性的起始值="it"的所有`<p>`元素。
- `:first-of-type`，如`p:first-of-type`选择其父级是`p`元素的第一个`p`元素。
- `:last-of-type`，如`p:last-of-type`选择其父级是`p`元素的最后一个`p`元素。
- `:only-of-type`，如`p:only-of-type`选择每个`p`元素是其父级的唯一`p`元素。
- `:only-child`，如`p:only-child`选择每个`p`元素是其父级的唯一子元素。
- `:nth-child(n)`，如`p:nth-child(2)`选择每个`p`元素是其父级的第二个子元素。
- `:nth-last-child(n)`，如`p:nth-last-child(2)`选择每个`p`元素的是其父级的第二个子元素，从最后一个子项计数。
- `:nth-of-type(n)`，如`p:nth-of-type(2)`选择每个`p`元素是其父级的第二个`p`元素。
- `:nth-last-of-type(n)`，如`p:nth-last-of-type(2)`选择每个`p`元素的是其父级的第二个`p`元素，从最后一个子项计数。
- `:last-child`，如`p:last-child`选择每个`p`元素是其父级的最后一个子级。
- `:root`，如`:root`选择文档的根元素。
- `:empty`，如`p:empty`选择每个没有任何子级的`p`元素（包括文本节点）。
- `:target`，如`#news:target`选择当前活动的`#news`元素（包含该锚名称的点击的`URL`）。