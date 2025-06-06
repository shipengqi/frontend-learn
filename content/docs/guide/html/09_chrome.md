---
title: Chrome 开发者工具
weight: 9
---

## Chrome 开发者工具

Chrome 的开发者工具查看元素的样式如下图：

![chrome-style](https://gitee.com/shipengqi/illustrations/raw/main/frontend-learn/basic/chrome-style.png)

右侧样式的排序，选择器的优先级高的会在上面。

- `use agent stylesheet` 是浏览器给元素的默认样式。
- `:hov` 给元素强制加上某种伪类，使元素显示对应的样式。
- `:cls` 给元素添加 `class`

切换页面的深色模式：

![chrome-scheme](https://gitee.com/shipengqi/illustrations/raw/main/frontend-learn/basic/chrome-scheme.png)

`Computed` 包含盒子模型和元素最终显示出来的样式的值。

![chrome-computed](https://gitee.com/shipengqi/illustrations/raw/main/frontend-learn/basic/chrome-computed.png)

如果在修改一些元素的样式，发现不生效时，就可以在列表中，点击对应属性。它会把这个属性相关的所有设置都列出来。列表中的第一个就是最终生效的那个，下面的就是被覆盖的。

上面的盒子模型的值都是可以修改的。


## Device ToolBar

![device-toolbar](https://gitee.com/shipengqi/illustrations/raw/main/frontend-learn/basic/device-toolbar.png)

- `1`：切换移动端模式。
- `2`：添加更多的移动端设备，并且可以添加自定义尺寸的设备。
- `3`：选择自适应模式，设备尺寸可以任意调整。
- `4`：缩放。
- `5`：节流模式，可以模拟网速的快慢，无网络等状态。
- `6`：旋转，模拟屏幕旋转。


### 媒体查询

打开媒体查询工具：

![show-media-query](https://gitee.com/shipengqi/illustrations/raw/main/frontend-learn/basic/show-media-query.png)

打开之后，尺寸下面多了一栏，鼠标悬浮上去会显示，当前的宽度是什么设备的尺寸。

![media-query-tool](https://gitee.com/shipengqi/illustrations/raw/main/frontend-learn/basic/media-query-tool.png)

如果设置了媒体查询，会出现对应的一行，鼠标悬浮上去会显示匹配的规则。

![media-queries.png](https://gitee.com/shipengqi/illustrations/raw/main/frontend-learn/basic/media-queries.png)

上图中有三条媒体查询的规则：

```css
.parent {
    width: 50vh;
    height: 50vh;
    background-color: aqua;
}
@media (min-width: 600px) {
    .parent {
        background-color: blueviolet;
    }
}
@media (max-width: 1000px) {
    .parent {
        background-color: blueviolet;
    }
}
@media (min-width: 600px) and (max-width: 1000px) {
    .parent {
        background-color:burlywood;
    }
}
```

当多个媒体查询同时匹配时，会按照从上到下的顺序进行匹配。也就是说最后的才会生效。


## Animations

Chrome 开发者工具的动画面板，可以查看元素动画效果的细节。

打开动画面板：

![chrome-animations](https://gitee.com/shipengqi/illustrations/raw/main/frontend-learn/basic/chrome-animations.png)

面板中有三个百分比，选择 `10%`，动画效果就会变得非常慢，面板中还记录了元素属性发生变化的过程，并且可以手动调节：

![chrome-animation-detail](https://gitee.com/shipengqi/illustrations/raw/main/frontend-learn/basic/chrome-animation-detail.png)


## 网页截图

Chrome 提供了网页截图的工具，可以将网页截图保存到本地。打开命令行面板，输入 `screenshot` 命令，然后回车，会出现四个 `screenshot` 相关的命令：

![chrome-screenshot](https://gitee.com/shipengqi/illustrations/raw/main/frontend-learn/basic/chrome-screenshot.png)

1. capture full size screenshot：截图整个页面。
2. capture node screenshot：截图元素。先使用选择页面元素工具在页面中选择某个需要截图的元素，再使用 `capture node screenshot` 命令，这个元素就会被截图。
3. capture screenshot：截图当前页面显示区域。
4. capture area screenshot：截图选中的区域。类似常见的截图工具，出现一个十字，选中区域截图。
