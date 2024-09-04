---
title: Chrome 开发者工具
weight: 8
---

# Chrome 开发者工具

Chrome 的开发者工具查看元素的样式如下图：

![chrome-style](https://github.com/shipengqi/illustrations/blob/c0efa82375c756099df82a5c948cb093c3f2014b/frontend-learn/basic/chrome-style.png?raw=true)

右侧样式的排序，选择器的优先级高的会在上面。

- `use agent stylesheet` 是浏览器给元素的默认样式。
- `:hov` 给元素强制加上某种伪类，使元素显示对应的样式。
- `:cls` 给元素添加 `class`

切换页面的深色模式：

![chrome-scheme](https://github.com/shipengqi/illustrations/blob/c0efa82375c756099df82a5c948cb093c3f2014b/frontend-learn/basic/chrome-scheme.png?raw=true)

`Computed` 包含盒子模型和元素最终显示出来的样式的值。

![chrome-computed](https://github.com/shipengqi/illustrations/blob/c0efa82375c756099df82a5c948cb093c3f2014b/frontend-learn/basic/chrome-computed.png?raw=true)

如果在修改一些元素的样式，发现不生效时，就可以在列表中，点击对应属性。它会把这个属性相关的所有设置都列出来。列表中的第一个就是最终生效的那个，下面的就是被覆盖的。

上面的盒子模型的值都是可以修改的。


## Device ToolBar

![device-toolbar](https://github.com/shipengqi/illustrations/blob/96977c045d05bdc5cac7878bf23baa77f43558c3/frontend-learn/basic/device-toolbar.png?raw=true)

- `1`：切换移动端模式。
- `2`：添加更多的移动端设备，并且可以添加自定义尺寸的设备。
- `3`：选择自适应模式，设备尺寸可以任意调整。
- `4`：缩放。
- `5`：节流模式，可以模拟网速的快慢，无网络等状态。
- `6`：旋转，模拟屏幕旋转。


### 媒体查询

打开媒体查询工具：

![show-media-query](https://github.com/shipengqi/illustrations/blob/219420382199da4b0c0fc08158dc2fabcbb7cb36/frontend-learn/basic/show-media-query.png?raw=true)

打开之后，尺寸下面多了一栏，鼠标悬浮上去会显示，当前的宽度是什么设备的尺寸。

![media-query-tool](https://github.com/shipengqi/illustrations/blob/219420382199da4b0c0fc08158dc2fabcbb7cb36/frontend-learn/basic/media-query-tool.png?raw=true)

如果设置了媒体查询，会出现对应的一行，鼠标悬浮上去会显示匹配的规则。

![media-queries.png](https://github.com/shipengqi/illustrations/blob/219420382199da4b0c0fc08158dc2fabcbb7cb36/frontend-learn/basic/media-queries.png?raw=true)

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
