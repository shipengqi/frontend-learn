---
title: 响应式
weight: 4
---

# 响应式

## 移动端响应式

声明视窗的大小：`<meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no">`

- `viewport` 声明视窗。**只适用于移动端**。
- `width=device-width` 宽度等于设备宽度。
- `initial-scale=1` 初始化比例是 1。
- `minimum-scale=1` 最小的缩小比例是 1。
- `maximum-scale=1` 最大的放大比例是 1。
- `user-scalable=no` 用户不允许缩放。

对于移动端设备，以 iphone6 为例，视网膜分辨率为 `750*1334`，但是在 chrome 的 device toolbar 中选择 iphone6 显示的分辨率确实 `375*667`。这是因为视网膜分辨率指得时**物理分辨率**，像素点确实是有这么多，device toolbar 中的分辨率是系统分辨率，是可以自己调整的。

使用系统分辨率，是因为现在移动端设备的分辨率很高，但是尺寸较小，例如一个 16 寸的笔记本和一个 6 寸的手机，分辨率都是 `1920*1080`，当把笔记本上一个`16px` 大小的字体放到手机上，就太小了。所以说使用系统分辨率，是放大了。

### 对于不同的移动端设备如何统一设置

不同的移动端设备分辨率，尺寸都不同，可以先针对一种设备，以 iphone6 为例，设计好页面的样式之后，设置 `content="width=375,user-scalable=no"`，禁止用户缩放，指定宽度为 iphone6 的宽度，那么不同分辨率的设备（移动端）都会自适应这个宽度。

## 媒体查询 响应式的解决方案

响应式：**根据不同屏幕的大小，显示不同的样式，从而更好的适配屏幕去显示内容**。可以更好的去布局排版。

语法：

```css
@media not|only mediatype and (mediafeature and|or|not mediafeature) {
  CSS-Code;
}
```

`mediatype` 媒体类型：

- `all`：所有设备。
- `print`：用于打印机和打印预览。
- `screen`：用于电脑屏幕，平板电脑，智能手机等。。
- `speech`：应用于屏幕阅读器等发声设备。

示例：

```css
/* 屏幕小于 640px 时，改变 h1 的颜色*/
@media screen and (max-width: 640px) {
  h1 {
    color: #0055bb;
  }
}

/* 屏幕大于 1200px 时，改变 h1 的颜色*/
@media screen and (min-width: 1200px) {
  h1 {
    color: #264D73;
  }
}

/* 屏幕大于 640px 并且小于 1200px 时，改变 h1 的颜色*/
@media screen and (min-width: 640px) and (max-width: 1200px) {
  h1 {
    color: #66bbff;
  }
}
```
