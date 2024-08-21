---
title: 响应式
weight: 5
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

### 物理分辨率和逻辑分辨率

屏幕的发展，最初是以像素为单位，像素越多，屏幕尺寸也越大，这是一种物理性的变大。但是物理的变大时有限制的，不能过大，所以后来出现了在同样尺寸下放入更多的像素的技术，例如苹果的 Retina 显示屏（高倍屏），5K 的显示屏分辨率是 `5120*2880`，而普通屏幕的在同样的尺寸下分辨率是 `2560*1440`。

如果我们用高倍屏去显示内容，那么就会出现一个问题，就是内容会变小。

例如下图，如果按照 `1:1` 的比例去显示，在普通屏幕上占 6 个像素的图片，放到高倍屏还是占据 6 个像素，按照这个逻辑，同样的内容，在高倍屏上显示差不多就是 `1/4`。

![image-20230215191308962](URL_ADDRESS)

那么这显然是不合理的，所以操作系统层面就出现了**逻辑分辨率**，就是一个虚拟的分辨率。对应屏幕的**物理分辨率**。逻辑分辨率就是为了让高倍屏和普通屏在显示内容时能显示出一样的大小。

如下图，如果一张图片占 6 个像素，那么在高倍屏时，操作系统会根据高倍屏的逻辑分辨率，把这张图片放大到 24 个像素，这样就不会出现内容变小的情况。

![](URL_ADDRESS)

**设备像素比**就是逻辑分辨率的宽度（高度）除以物理分辨率的宽度（高度）。对于移动端设备，设备像素比可能更高。设备像素比可以在浏览器的控制台查看，输入 `devicePixelRatio` 回车即可。

### 移动端适配

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
