---
title: CSS 技巧
weight: 5
draft: true
---

# CSS 技巧

## 横线

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

## 圆点

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

## 圆角

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

## border-image

对话框的背景边框的效果，用普通的 `border` 样式是很难实现的。这个时候可以考虑使用 `border-image`。


## 渐变边框

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

## 利用背景图片去展示图片，避免出现右键保存图片


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

## 隐藏元素

- `display: none`：隐藏元素，不占据空间。
- `visibility: hidden`：隐藏元素，但是占据空间。
- `opacity: 0`：隐藏元素，但是占据空间。