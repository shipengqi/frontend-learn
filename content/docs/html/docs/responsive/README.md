# 响应式web设计

## 设计规范

## 字体
设计规范从字体开始，选择一款合适的字体很重要。字体，要平衡**个性**和**可读性**，可以选择一种字体作为主要的字体，选择另一种作为体现个性的字体。

字体选择后，我们需要让版式兼顾不同的屏幕尺寸，还要确保不同的分辨率下都显示的很好。

决定字体的最大和最小的尺寸，不需要关心设备的型号，确切的尺寸，比例特征是最重要的。例如：
- 较小的手机 5s
- 中等的手机 6s
- 较小的平板 iPad mini
- 较大的平板 iPad Air
- 笔记本电脑 MacBook
- 台式电脑 iMac

CSS 媒体查询，能让我们快速的确定最合适的字号。

根据屏幕的尺寸和分辨率，调整行高，加粗字体。

## 颜色

颜色可以塑造氛围，用来传达某些信息，提高网站或者 APP 的易用性。

首先，要确定一组颜色，颜色可以分为四类：
- 主要色(Primary)，最常用的颜色，logo，主要背景，超链接，按钮。
- 次要色，超链接`hover`是的颜色，或者按钮点击是的颜色。
- 中性色，经常在边框或者水平线使用。
- 强调色(Error)，使用较少，警告，错误。

然后要确定色调

添加纹理，包括边界样式，阴影等