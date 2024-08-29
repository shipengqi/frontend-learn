---
title: Chrome 使用
weight: 8
---

# Chrome 使用

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
