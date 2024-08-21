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



## 动画效果

动画效果的格式：

- `animation` 的默认值 `none 0 ease 0 1 normal none running`。
- 关键帧，`@keyframes {动画名称}`

`animation` 也可以分开设置：

- `animation-name`：定义动画名称。
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
    - `none` 不填充。
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
  animation: demo1 2s 3; 
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
    }
    100% {
        transform: translateX(500px);
        background: yellow;
    }
}
```

`@keyframes` 用来设置关键帧，动画的中间过程会被补全。`animation-timing-function` 就是设置补全动画的速度。

- `from` 和 `to` 是关键帧，`from` 是动画开始时的状态，`to` 是动画结束时的状态。
- `0%` 和 `100%` 是关键帧，`0%` 是动画开始时的状态，`100%` 是动画结束时的状态。还可以设置 `10%`，`20%` 等。

### steps



## 过渡和动画的区别

过渡的优点在于简单易用，但是它有几个很大的局限：

- 需要事件触发，所以没法在网页加载时自动发生。
- 是一次性的，不能重复发生，除非一再触发。
- 只能定义两个状态，开始状态和结束状态，不能定义中间状态。
- 一条过渡规则，只能定义一个属性的变化，不能涉及多个属性。

动画通过控制关键帧来控制动画的每一步，实现更为复杂的动画效果，可以解决过渡的不足。
