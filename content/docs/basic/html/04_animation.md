---
title: 过渡和动画
weight: 4
---

# 过渡和动画

页面中元素的变化，按照变化发起的逻辑可以分为**触发型**和**自动型**。

让元素发生变化，有三种方式：

- **CSS**：适合简单的变化效果，
- **CSS+JS**：稍微复杂的变化效果，需要配合一下交互的
- **JS**：类似在 canvas 元素上进行 2D 或者 3D 图像绘制的

元素变化的主要的属性：

- 位置
- 尺寸
- 缩放，和尺寸类似，但是会带动元素整体，包裹内部元素进行缩放。
- 旋转
- 透明度
- 投影
- 颜色
- 边框

## 过渡效果

将状态从 A 变化到 B，中间的过程就可以用过渡的效果补齐。

过渡属性的格式：`transition: {过渡属性} {过渡时间} {过渡变化速度} {延迟时间}`。多个属性 `,` 分隔。

示例：

- `transition: background 2s`：背景颜色变化 2 秒。
- `transition: background 2s,width 5s`：背景颜色变化 2 秒，宽度变化 5 秒。
- `transition: background 2s 2s`：背景颜色变化 2 秒，2 秒之后才开始变化。
- `transition: all`：`all` 代表所有属性。
- `transition: all 5s linear`：`linear` 表示线性变化速度。

`transition` 也可以分开设置：
- `transition-property`：过渡属性。
- `transition-duration`：过渡时间。
- `transition-timing-function`：过渡缓动曲线。默认是 `ease`。
    - `ease` 先慢后快再慢，
    - `linear` 线性。
    - `ease-in` 缓慢进。
    - `ease-out` 缓慢出。
    - `cubic-bezier` 自定义，贝塞尔曲线。可以使用一下工具来得到换动曲线：
      - 浏览器开发者工具的 `cubic-bezier` 工具。
      - [cubic-bezier](https://cubic-bezier.com/)
      - [easings](https://easings.co/)
    - `steps`，步数
- `transition-delay`：过渡延迟时间。

### steps

`steps(count, start|end)` 是一个特殊的时间函数，它和其他关键字 `linear` 等最大的区别就是，它不是一个连贯的变化，是一步一步的硬切换。

例如 `steps(3, start|end)`，设置了 3 步，也就是会有 4 个状态，如下图：

![](steps.png)

1. 第一步切换由`初始状态`到`过程状态1`。
2. 第二步由`过程状态1`到`过程状态2`。
3. 第二步由`过程状态2`到`目标状态`。

整个变化过程分为了三个时间段，`start` 和 `end` 表示的转台切换是在时间段的开始还是时间段的结束。

例如 `steps(3, start)`，就表示时间段一开始，就切换状态，以上图为例，第一个时间段一开始，直接从`初始状态`就切换到了`过程状态1`，然后等第一段时间走完，第二段时间开始，`过程状态1`直接切换到`过程状态2`，依次类推。

如果是 `steps(3, end)`，就表示时间段结束，才切换状态，以上图为例，第一个时间段走完，才从`初始状态`切换到`过程状态1`，然后等第二段时间走完，`过程状态1`切换到`过程状态2`，依次类推。

- `step-start` 等价于 `steps(1, start)`。
- `step-end` 等价于 `steps(1, end)`。

`steps` 在动画效果中用的更多一点。

## 动画效果

动画要先用 `@keyframes` 去定义好变化的过程，再去应用到某个元素。

`@keyframes {动画名称}` 用来设置关键帧，动画的中间过程会被补全。

- 只有两个状态时，使用 `from` 和 `to`，`from` 是动画开始时的状态，`to` 是动画结束时的状态。
- 多个状态时，使用百分比，`0%` 是动画开始时的状态，`100%` 是动画结束时的状态。更多中间状态用 `10%`，`20%`，`25%` 等。

定义好变化的过程，再用 `animation` 去应用到某个元素：`animation` 是一个复合属性，默认值 `none 0 ease 0 1 normal none running`。

`animation` 也可以分开设置：

- `animation-name`：定义动画名称，要和 `@keyframes` 定义的名称一致。
- `animation-duration`：动画时间。`animation-duration` 属性是必须的，否则时长为 0，就不会播放动画了。
- `animation-delay`：延迟时间。
- `animation-timing-function`：动画速度，默认是 `ease`。
    - `ease` 先慢后快。
    - `linear` 线性。
    - `steps()` 步数。
    - `cubic-bezier()` 自定义。可以在浏览器的 `cubic-bezier` 工具中修改。
- `animation-iteration-count` 迭代次数，`infinite` 表示无限。
    - `infinite` 无限次。
    - `n` 表示 n 次。
- `animation-direction`：方向，默认是 `normal`，`alternate` 表示往返动画。
    - `normal` 默认值，正常播放。
    - `reverse` 反向播放。
    - `alternate` 往返动画。
    - `alternate-reverse` 反向往返动画。
- `animation-fill-mode`：最后填充模式，也就是动画结束时，要应用到元素的样式。默认值是 `none`。
    - `none` 不填充。动画播放完以后回到原始的样式。
    - `forwards` 应用动画结束时最后一帧的样式。
    - `backwards` 应用动画结束时第一帧的样式。
    - `both` 遵循 `forwards` 和 `backwards` 的规则，从而在两个方向上扩展动画属性。
- `animation-play-state`：动画状态，默认值是 `running`。
    - `running` 正在播放。
    - `paused` 暂停。


示例：

```css
#div1 {
  /*3 次动画*/
  animation-name: demo1;
  animation-duration: 2s;
  animation-timing-function: ease-in-out;
  /*animation: demo1 2s infinite alternate; 无限次的往返动画*/
}

@keyframes demo1 {
  from {
    transform: translateX(0px);
  }
  to {
    transform: translateX(500px);
  }
}

@keyframes demo2 {
  0% {
    transform: translateX(0px);
    background: red;
  }
  20% {
    transform: translateX(500px);
    background: blue;
  }
  70% {
    transform: translateX(500px);
    background: green;
    /* 时间函数是可以设置在单独的一段中，只会影响这一段的变化 */
    animation-timing-function: linear;
  }
  100% {
    transform: translateX(500px);
    background: yellow;
  }
}
```

## 过渡和动画的区别

过渡的优点在于简单易用，但是它有几个很大的局限：

- 需要事件触发，所以没法在网页加载时自动发生。
- 是一次性的，不能重复发生，除非一再触发。
- 只能定义两个状态，开始状态和结束状态，不能定义中间状态。
- 一条过渡规则，只能定义一个属性的变化，不能涉及多个属性。

动画通过控制关键帧来控制动画的每一步，实现更为复杂的动画效果，可以解决过渡的不足。

## 转换

### 2D 转换

2D 转换有 2 个轴, `x`，`y`。

- **平移**：`transform: translate(x, y)`，`x` 和 `y` 可以分开设置（`transform: translateX(200px)` `transform: translateY(100px)`）
- **旋转**：`transform: rotate(x)`，`transform: rotate(30deg)` 顺时针旋转 `30` 度，负数就是逆时针旋转。

### 3D 转换

3D 转换实现 3D 立体效果，有 3 个轴, `x`，`y`，`z`。

- **透视点**：眼睛与屏幕之间的距离。`perspective` （`perspective: 1000px`）意思是距离屏幕 1000 像素点的距离（一般在 `<body>` 上设置透视点）。
透视点的位置默认是屏幕的正中央。
- **平移**：`transform: translate3d(x, y, z)`，也可以分开设置，3D 比 2D 多了一个  `translateZ(100px)`。
- **旋转**：`transform: rotate3d(x, y,z, 30deg)` 绕着 `x`，`y`，`z` 确定的轴旋转 30 度，`rotateX(45deg)` 绕着 X 轴旋转 45 度。`rotateY()` 绕着 Y 轴旋转。`rotateZ()` 绕着 Z 轴旋转。
- **放大和缩小**：
  - 放大：`transform: scale(3)` 放大 3 倍，`transform: scale(0.5, 2)` 表示水平缩小到 0.5 倍、垂直放大 2 倍。也可以分别设置 `transform: scaleX(3)` 水平放大 3 倍。`scaleY` 垂直缩放。
  - 倾斜：`transform: skew(15deg, 0deg)` 基于 X 轴倾斜 15 度，Y 轴 0 度。值可以为负数。
- `transform-style: preserve-3d`：可以渲染出一些在三维空间中的效果。
- `transform-origin`：设置元素变换的中心点。
- `transform-box`：变换中心点可设置的区域。
- `perspective-origin`：可以修改透视点的位置，例如 `perspective-origin: left buttom` 将透视点的位置改为左下。
