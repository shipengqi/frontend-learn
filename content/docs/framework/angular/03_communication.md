---
title: 组件通讯
weight: 3
---

## 向组件内部传递数据

### Input 装饰器

```html
<app-favorite [isFavorite]="true"></app-favorite>
```

```javascript
// favorite.component.ts
import { Input } from '@angular/core';
export class FavoriteComponent {
    @Input() isFavorite: boolean = false;
}
```


注意：在属性的外面加 `[]` 表示绑定动态值，对于布尔类型，不加 `[]` 表示绑定普通值，例如 `true` 在组件内接收后是字符串 `"true"`。

```html
<app-favorite [is-Favorite]="true"></app-favorite>
```

```javascript
import { Input } from '@angular/core';

export class FavoriteComponent {
  @Input("is-Favorite") isFavorite: boolean = false
}
```

#### 属性别名

通过给 `@Input()` 装饰器传递参数，可以重命名属性。

```typescript
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-child',
  template: `<p>{{ myValue }}</p>`,
})
export class ChildComponent {
  @Input('parentValue') myValue!: string; // 父组件使用 "parentValue" 绑定
}

```

父组件：

```html
<app-child [parentValue]="'Hello'"></app-child>
```

使用别名可以避免某些属性名可能与 DOM 属性或全局对象名称冲突。例如：

```typescript
@Component({
  selector: 'app-child',
  template: `<p>{{ id }}</p>`,
})
export class ChildComponent {
  @Input('customId') id!: string; // 避免与 DOM 的 id 属性冲突
}
```

#### booleanAttribute

`@Input` 装饰器可以传入参数 `{transform: booleanAttribute}`，用于将字符串类型的布尔属性（HTML 属性中传递的布尔值通常是字符串）转换为真正的 JavaScript 布尔值的机制。

用途：

在 HTML 中，布尔属性（如 `disabled`, `checked`, `readonly`）如果存在，则会被解析为字符串，即使没有显式赋值。例如：

```html
<input disabled />
```

`disabled` 属性的值在 JavaScript 中是 `"true"`，而不是一个真正的布尔值 `true`。`{transform: booleanAttribute}` 可以自动将这种字符串值转换为布尔值。

示例：

```typescript
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-boolean-example',
  template: `<p>The button is {{ disabled ? 'Disabled' : 'Enabled' }}</p>`,
})
export class BooleanExampleComponent {
  @Input({ transform: booleanAttribute }) disabled = false; // 默认为 false
}

```

父组件：

```html
<app-boolean-example disabled></app-boolean-example>
```

- 在父组件中传递 `disabled`，即使不显式赋值，它也会被识别为 `true`。
- 如果未传递 `disabled` 属性，子组件中的 `disabled` 属性值会保留默认值 `false`。

## 向组件外部传递数据

### Output 装饰器

```html
<!-- 子组件模板 -->
<button (click)="onClick()">click</button>
```

```javascript
// 子组件类
import { EventEmitter, Output } from "@angular/core"

export class FavoriteComponent {
  @Output() change = new EventEmitter()

  onClick() {
    this.change.emit({ name: "张三" })
  }
}
```

```html
<!-- 父组件模板 -->
<app-favorite (change)="onChange($event)"></app-favorite>
```

```javascript
// 父组件类
export class AppComponent {
    onChange(event: { name: string }) {
        console.log(event)
    }
}
```

## 父组件与子组件通过本地变量互动

父组件不能使用数据绑定来读取子组件的属性或调用子组件的方法。但可以在父组件模板里，新建一个本地变量来代表子组件，然后利用这个变量来读取子组件的属性和调用子组件的方法：

子组件 `CountdownTimerComponent`：
```typescript
@Component({
  selector: 'app-countdown-timer',
  template: '<p>{{message}}</p>'
})
export class CountdownTimerComponent implements OnDestroy {
  
  intervalId = 0;
  message = '';
  seconds = 11;

  ngOnDestroy() { this.clearTimer(); }

  start() { this.countDown(); }
  stop()  {
    this.clearTimer();
    this.message = `Holding at T-${this.seconds} seconds`;
  }

  private clearTimer() { clearInterval(this.intervalId); }
  private countDown() { 
    // ... 
  }
}
```

父组件 `CountdownLocalVarParentComponent`：

```typescript
@Component({
  selector: 'app-countdown-parent-lv',
  template: `
    <h3>Countdown to Liftoff (via local variable)</h3>
    <button type="button" (click)="timer.start()">Start</button>
    <button type="button" (click)="timer.stop()">Stop</button>
    <div class="seconds">{{timer.seconds}}</div>
    <app-countdown-timer #timer></app-countdown-timer>
  `,
  styleUrls: ['../assets/demo.css']
})
export class CountdownLocalVarParentComponent { }
```

父组件不能通过数据绑定使用子组件的 `start` 和 `stop` 方法，也不能访问子组件的 `seconds` 属性。把本地变量(`#timer`)放到(`<countdown-timer>`)标签中，用来代表子组件。这样父组件的模板就得到了子组件的引用，可以在父组件的模板中访问子组件的属性和方法。
