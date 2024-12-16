---
title: 指令
weight: 5
---

## 概述

指令是 Angular 提供的操作 DOM 的途径。指令分为属性指令和结构指令。

属性指令：修改现有元素的外观或行为，`selector` 使用 `[]` 包裹。

结构指令：增加、删除 DOM 节点以修改布局，使用 `*` 作为指令前缀。

## 内置指令

### *ngIf

根据条件渲染 DOM 节点或移除 DOM 节点。

```html
<div *ngIf="data.length == 0">没有更多数据</div>
```

```html
<div *ngIf="data.length > 0; then dataList else noData"></div>
<ng-template #dataList>课程列表</ng-template>
<ng-template #noData>没有更多数据</ng-template>
```

### [hidden]

根据条件显示 DOM 节点或隐藏 DOM 节点。

```html
<div [hidden]="data.length == 0">课程列表</div>
<div [hidden]="data.length > 0">没有更多数据</div>
```

### *ngFor

遍历数据生成HTML结构

```javascript
interface List {
  id: number
  name: string
  age: number
}

list: List[] = [
  { id: 1, name: "张三", age: 20 },
  { id: 2, name: "李四", age: 30 }
]
```

```html
<li
    *ngFor="
      let item of list;
      let i = index; // 下标
      let isEven = even; // 是否是第偶数个元素
      let isOdd = odd; // 是否是第奇数个元素
      let isFirst = first; // 是否是第一个元素
      let isLast = last; // 是否是最后一个元素
    "
  >
  </li>
```

#### trackBy

在 Angular 中遍历数组时，会用到 `ngFor` 指令，如果数组中的数据改变了（新数组替换旧数组），Angular 会删除与数据关联的所有 DOM 元素，然后再次创建它们。这意味着将有很多 DOM 操作。

使用 `*ngFor` 的 `trackBy` 属性，Angular 可以仅更改和重新渲染那些已更改的条目，而不是重新加载整个条目列表。

```typescript
trackByItems(index: number, item: Item): number {
    return item.id; // 只需要返回一个唯一标识就好了
}
```

```html
<div *ngFor="let item of items; trackBy: trackByItems">
    ({{ item.id }}) {{ item.name }}
</div>
```

使用 `trackBy` 的好处是自定义返回跟踪结果，以比对上次的跟踪结果，如果不一样，那么就刷新变化的页面实例（减少不必要的 Dom 刷新而带来性能的提升）。

### 自定义指令

需求：为元素设置默认背景颜色，鼠标移入时的背景颜色以及移出时的背景颜色。

 ```html
<div [appHover]="{ bgColor: 'skyblue' }">Hello Angular</div>
 ```

```javascript
import { AfterViewInit, Directive, ElementRef, HostListener, Input } from "@angular/core"

// 接收参的数类型
interface Options {
  bgColor?: string
}

@Directive({
  selector: "[appHover]"
})
export class HoverDirective implements AfterViewInit {
  // 接收参数
  @Input("appHover") appHover: Options = {}
  // 要操作的 DOM 节点
  element: HTMLElement
	// 获取要操作的 DOM 节点
  constructor(private elementRef: ElementRef) {
    this.element = this.elementRef.nativeElement
  }
	// 组件模板初始完成后设置元素的背景颜色
  ngAfterViewInit() {
    this.element.style.backgroundColor = this.appHover.bgColor || "skyblue"
  }
	// 为元素添加鼠标移入事件
  @HostListener("mouseenter") enter() {
    this.element.style.backgroundColor = "pink"
  }
	// 为元素添加鼠标移出事件
  @HostListener("mouseleave") leave() {
    this.element.style.backgroundColor = "skyblue"
  }
}
```
