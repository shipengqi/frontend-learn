---
title: CSS 技巧
weight: 5
draft: true
---


# CSS 常用库

- [Animate CSS](https://github.com/animate-css/animate.css)
- [Tailwind CSS](https://github.com/tailwindlabs/tailwindcss)

# 横线

```html
<style>
    .line {
        /* 先去掉 div 的边框 */
        border: none;
        /* 单独设置一条边框的样式 */
        border-top: 1px solid gray;
    }
</style>
<div class="line"></div>
```

# 圆点

```html
<style>
    .dot {
        background-color: gray;
        /* 宽高一致，才能使用 50% 来设置 */
        width: 6px;
        height: 6px;
        border-radius: 50%;
    }
</style>
<span class="dot"></span>
```

# 圆角

给一个矩形设置圆角，如果宽高是已知的，那么可以使用较小的值的一半来设置圆角：

```html
<style>
    .round {
        background-color: gray;
        width: 500px;
        height: 200px;
        /* height 的一半是 100px */
        border-radius: 100px;
    }
</style>
<div class="round"></div>
```

# border-image

对话框的背景边框的效果，用普通的 `border` 样式是很难实现的。这个时候可以考虑使用 `border-image`。


# 渐变边框

```html
<style>
    .parent {
        /* 利用 padding 使父元素和子元素有 1 个像素的一个距离，相当于实现了一个视觉上的边框 */
        /* 然后利用父元素的背景渐变，产生一个渐变的效果 */
        padding: 1px;
        background: linear-gradient(white, rgba(255, 255, 255, 0.3));
        border-radius: 10px;
    }
    .child {
        height: 200px;
        width: 160px;
        background-color: black;
        border-radius: 9px;
    }
</style>
<div class="parent">
  <div class="child"></div>
</div>
```

# 利用背景图片去展示图片，避免出现右键保存图片


```html
<style>
    .pic {
        
        /* 为了让背景图片刚好显示再整个元素中 */
        /* 通过设置宽高比，可以快速的设置元素的比例等于图片的比例 */
        /* 16/9 是视频资源常见的一种比例 */
        /* aspect-ratio: 16/9; */
        /* 如果不确定图片的比例，可以直接使用图片的分辨率 */
        aspect-ratio: 1364/892;
        /* 设置了宽高比以后，只需要设置宽度，高度就会按照宽高比自动计算 */
        width: 50%;
        background-image: url(URL_ADDRESS);
        background-size: contain;
        background-repeat: no-repeat;
    }
</style>
<div class="pic">
</div>
```

# 隐藏元素

- `display: none`：隐藏元素，不占据空间。
- `visibility: hidden`：隐藏元素，但是占据空间。
- `opacity: 0`：隐藏元素，但是占据空间。

# display: contents

设置了 `display: contents` 的元素，那么改元素的子元素可以参与该元素父元素的布局。


# will-change

`will-change: box-shadow`，相当于告知浏览器，`box-shadow` 属性将要变化，可以更高效的执行，可以解决一些页面渲染的性能问题。


# 主题

## 清明节全网灰色主题

可以简单的在 `<body>` 上加上滤镜属性：

```css
filter: grayscale(100%);    
-moz-filter: grayscale(100%);     // 兼容 Firefox
-ms-filter: grayscale(100%);     // 兼容 IE、Edge
-o-filter: grayscale(100%);       // 兼容 2013 年前的 Opera
```

对于较低版本的 IE 浏览器：

```css
filter: url(data:image/svg+xml;utf8,#grayscale);         // 兼容 IE10、IE11
filter: progid:DXImageTransform.Microsoft.BasicImage(grayscale=1); // 兼容 IE6～9
```

## Dark 模式

Dark 模式一种简单的实现方式，适合偏展示性的网站，页面元素简单，没有复杂动效的网站：

```css
filter: invert(1)    // 设置反相色，白底黑字变成黑底白字。

// 上面的设置会导致彩色也会跟着反向，也就是说红色类的元素会变色绿色。可以使用 hue-rotate 色相旋转，它的特点：只对彩色生效。
filter: invert(1) hue-rotate(180deg);     // 反向后，再进行 180 度的色相旋转
```

### 系统偏好

获取系统的模式有两种方式：

1. 通过 CSS 的 `prefers-color-scheme` 媒体查询，直接获取系统的模式并切换样式。

```css
@media (prefers-color-scheme: dark) {
  // Dark 模式
  :root {
    --background-color: black;
  }
}

@media (prefers-color-scheme: light) {
  // Light 模式
  :root {
    --background-color: white;
  }
}
```

2. 通过 JavaScript 获取系统的模式并切换样式。

```html
<script>
  // 检测系统的模式
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    // Dark 模式
    document.documentElement.classList.add('dark');
  } else {
    // Light 模式
    document.documentElement.classList.remove('dark');
  }
</script>
```

可以将用户选择的模式存储到 `localStorage` 中，再次访问可以通过 `localStorage` 来获取用户设置的主题。

### 用户偏好

```javascript
const toggleButton = document.querySelector('#toggle')
toggleButton.addEventListener('click', () => {
	const isDark = document.documentElement.classList.contains('dark')
	if (isDark) 
		document.documentElement.classList.remove('dark')
	
	else 
		document.documentElement.classList.add('dark')
})

```

### 闪烁问题

如果时通过 js 来获取系统的模式，那么在切换主题的时候，会有一个闪烁的问题。由于 js 是单线程，而通常为了不阻塞页面渲染一般是将 js 文件放置在 `body` 元素最下面，所以当 js 执行的时候，页面已经渲染完成，但是 dark 样式还没有添加上去，就会出现闪烁的问题。

解决这个问题，可以把 `dark` 样式初始化的 js 代码放在 `head` 元素中，这样就可以避免闪烁的问题。

```html
<head>
<script>
  // 检测系统的模式
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    // Dark 模式
    document.documentElement.classList.add('dark');
  } else {
    // Light 模式
    document.documentElement.classList.remove('dark');
  }
</script>
</head>
<body>
</body>

```

### 不支持深色模式的系统环境中

不支持深色模式的系统环境中，可以判断当前系统时间是否处于夜间，是则返回深色模式。

```javascript
finction getTheme(): boolean {
  const currentTime = new Date().getHours();
  const isNight = currentTime >= 19 || currentTime <= 6;
  return isNight ? Theme.Dark : Theme.Light;
}
```

## 利用 `setProperty` 切换主题色

这个方案适用于由用户根据颜色面板自行设定各种颜色主题。参考 [vue-element-plus-admin](https://gitee.com/kailong110120130/vue-element-plus-admin)。

实现思路，在全局中预设好 CSS 变量样式：

```css
:root {
  --theme-color: #13c2c2;
  --theme-background: #fff;
}
```

定义一个工具类方法，用于修改指定的 CSS 变量值，使用 [CSSStyleDeclaration.setProperty](https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleDeclaration/setProperty) 方法。

```typescript
export function setCssVar(prop: string, val: any, dom = document.documentElement): void {
  dom.style.setProperty(prop, val);
}
```

切换主题色：

```javascript
setCssVar('--theme-color', color);
```

# 透明图片的阴影

如果需要给某些带有透明部分的图片添加阴影，如过直接用 `box-shadow` 给图片添加阴影：

```css
img {
  box-shadow: 0 0 20px gray;
}
```

效果如下图：

<img src="https://github.com/shipengqi/illustrations/blob/7c807a8f6563c7dc56aaf3675bf37f21e393494a/frontend-learn/basic/chrome-shadow.png?raw=true" width="50%" alt="box-shadow">

如果只想给图片内容区域设置阴影，可以使用 `filter` 属性。

```css
img {
  filter: drop-shadow(0 0 20px crimson);
}
```

效果如下图：

<img src="https://github.com/shipengqi/illustrations/blob/7c807a8f6563c7dc56aaf3675bf37f21e393494a/frontend-learn/basic/chrome-filter-shadow.png?raw=true" width="50%" alt="filter-shadow">

还有另一种方式可以是阴影的效果更好，就是在加一个一摸一样的图片元素：

```html
<head>
    <style>
        img {
            /* 让两张图片的位置重合 */
            position: absolute;
        }
        .hidden {
            /* 作为背景图片 */
            z-index: -1;
            /* 设置背景图片模糊滤镜 */
            filter: blur(20px);
        }
    </style>
</head>
<body>
    <img class="show" src="./chrome.webp" alt="">
    <img class="hidden" src="./chrome.webp" alt="">
</body>
```

效果如下图：

<img src="https://github.com/shipengqi/illustrations/blob/7c807a8f6563c7dc56aaf3675bf37f21e393494a/frontend-learn/basic/chrome-bg-shadow.png?raw=true" width="50%" alt="bg-shadow">

# CSS 中 flex 布局最后一行左对齐

使用足够的空白标签进行填充占位，具体的占位数量是由最多列数的个数决定的，例如这个布局最多 7 列，那就可以使用 7 个空白标签进行填充占位，最多 10 列，那就需要使用 10 个空白标签。

```html
<div class="container">
    <div class="list"></div>
    <div class="list"></div>
    <div class="list"></div>
    <div class="list"></div>
    <div class="list"></div>
    <div class="list"></div>
    <div class="list"></div>
    <i></i><i></i><i></i><i></i><i></i>
</div>
```

占位标签元素（`span`, `i`, `div` 元素都可以）要和列表元素一样的宽度：

```css
.container {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    gap: 10p
}

.list {
    width: 100px;
    height:100px;
}

/* 和列表元素一样的宽度 */
.container > i {
    width: 100px;
}
```

最好的方式是使用 Grid 布局，但是要考虑 `auto-fill` 不兼容 IE 浏览器的问题：

```css
.container {
    width: 100vw;
    display: grid;
    justify-content: space-around;
    /* auto-fill 会按照尺寸去尽可能的生成最多的列或者行 */
    grid-template-columns: repeat(auto-fill, 100px);
    gap: 10px;
}
```
