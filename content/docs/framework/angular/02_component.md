---
title: 组件模板
weight: 2
---

## 数据绑定

数据绑定就是将组件类中的数据显示在组件模板中，当组件类中的数据发生变化时会自动被同步到组件模板中（数据驱动 DOM ）。

在 Angular 中使用差值表达式进行数据绑定，即 `{{ }}`。

```html
<h2>{{message}}</h2>
<h2>{{getInfo()}}</h2>
<h2>{{a == b ? '相等': '不等'}}</h2>
<h2>{{'Hello Angular'}}</h2>
<p [innerHTML]="htmlSnippet"></p> <!-- 对数据中的代码进行转义 -->
```

## 属性绑定

### 普通属性

属性绑定分为两种情况，绑定 DOM 对象属性和绑定 HTML 标记属性。

1. 使用 `[属性名称]` 为元素绑定 DOM 对象属性。

   ```html
   <img [src]="imgUrl"/>
   ```

2. 使用 `[attr.属性名称]` 为元素绑定 HTML 标记属性

   ```html
   <td [attr.colspan]="colSpan"></td> 
   ```

在大多数情况下，DOM 对象属性和 HTML 标记属性是对应的关系，所以使用第一种情况。但是某些属性只有 HTML 标记存在，DOM
对象中不存在，此时需要使用第二种情况，比如 `colspan` 属性，在 DOM 对象中就没有，或者自定义 HTML 属性也需要使用第二种情况。

### class 属性

```html
<button class="btn btn-primary" [class.active]="isActive">按钮</button>
<div [ngClass]="{'active': true, 'error': true}"></div>
```

`ngClass` 可以绑定多个类名。

### style 属性

```html
<button [style.backgroundColor]="isActive ? 'blue': 'red'">按钮</button>
<button [ngStyle]="{'backgroundColor': 'red'}">按钮</button>
```

`ngClass` 可以绑定多个样式属性。

## 事件绑定

```html
<button (click)="onSave($event)">按钮</button>
<!-- 当按下回车键抬起的时候执行函数 -->
<input type="text" (keyup.enter)="onKeyUp()"/>
```

事件对象是一个固定的名字就是 `$event`。

## 获取原生 DOM 对象

### 在组件模板中获取

在模板中，可以用 `#` 来声明一个模板变量。模板变量，可以在组件模板中的任何地方引用。

```html
<input type="text" (keyup.enter)="onKeyUp(username.value)" #username/>
```

### 在组件类中获取

使用 `ViewChild` 装饰器获取一个元素

 ```html
<p #paragraph>home works!</p>
 ```

```javascript
import {AfterViewInit, ElementRef, ViewChild} from "@angular/core"

export class HomeComponent implements AfterViewInit {
    @ViewChild("paragraph") paragraph: ElementRef<HTMLParagraphElement> | undefined

    ngAfterViewInit() {
        console.log(this.paragraph?.nativeElement)
    }
}
```

使用 `ViewChildren` 获取一组元素

```html
<ul>
    <li #items>a</li>
    <li #items>b</li>
    <li #items>c</li>
</ul>
```

```javascript
import {AfterViewInit, QueryList, ViewChildren} from "@angular/core"

@Component({
    selector: "app-home",
    templateUrl: "./home.component.html",
    styles: []
})
export class HomeComponent implements AfterViewInit {
    @ViewChildren("items") items: QueryList<HTMLLIElement> | undefined

    ngAfterViewInit() {
        console.log(this.items?.toArray()) // items 中的元素无法直接使用，需要先使用 toArray 转换成一个数组
    }
}
```


### ContentChild, ContentChildren

- `ContentChildren` 属性装饰器用来从通过 Content Projection 方式设置的视图中获取 `ng-content` 里面匹配的多个元素。
- `ContentChild` 类似 `ContentChildren`，不过返回的是一个元素。

`ContentChild` 和 `ViewChild` 的区别：

- `ContentChild` 用来从通过 Content Projection 方式 (`ng-content`) 设置的视图中获取匹配的元素。
- `ViewChild` 匹配的元素在组件的模板中定义的内容，它是组件的一部分。


## 内容投影

```html
<!-- app.component.html -->
<bootstrap-panel>
    <div class="heading">
        Heading
    </div>
    <div class="body">
        Body
    </div>
</bootstrap-panel>
```

```html
<!-- panel.component.html -->
<div class="panel panel-default">
    <div class="panel-heading">
        <ng-content select=".heading"></ng-content>
    </div>
    <div class="panel-body">
        <ng-content select=".body"></ng-content>
    </div>
</div>
```

如果只有一个 `ng-content`，不需要 `select` 属性。直接 `<ng-content></ng-content>` 就可以。

`ng-content` 在浏览器中会被 `<div class="heading"></div>` 替代，如果不想要这个额外的 `div`，可以使用 `ng-container` 替代这个
`div`。

```html
<!-- app.component.html -->
<bootstrap-panel>
    <ng-container class="heading">
        Heading
    </ng-container>
    <ng-container class="body">
        Body
    </ng-container>
</bootstrap-panel>
```

## 双向数据绑定

数据在组件类和组件模板中双向同步。

Angular 将双向数据绑定功能放在了 `@angular/forms` 模块中，所以要实现双向数据绑定需要依赖该模块。

```javascript
import {FormsModule} from "@angular/forms"

@NgModule({
    imports: [FormsModule],
})
export class AppModule {
}
```

```html
<input type="text" [(ngModel)]="username"/>
<button (click)="change()">在组件类中更改 username</button>
<div>username: {{ username }}</div>
```

```javascript
export class AppComponent {
    username: string = ""

    change() {
        this.username = "hello Angular"
    }
}
```

### 双向绑定工作原理

为了使双向数据绑定生效，子组件必须包含：

- 一个 `@Input()` 属性。
- 一个对应的 `@Output()` 事件发射器，其**名称必须与输入属性相同**，并在结尾加上 **Change**。该发射器还必须发射与输入属性相同类型的值。
  例如，如果 `@Input()` 属性是 `size`，则 `@Output()` 属性必须是 `sizeChange`。
- 一个方法，该方法通过事件发射器发射更新后的 `@Input()` 值。

子组件：

```typescript
// './counter/counter.component.ts';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({ // Omitted for brevity })
export class CounterComponent {
  @Input() count: number;
  @Output() countChange = new EventEmitter<number>();
  
  updateCount(amount: number): void {
    this.count += amount;
    this.countChange.emit(this.count);
  }
}
```

父组件，使用双向绑定语法 `[()]` 包裹 `@Input()` 属性名称：

```typescript
// ./app.component.ts
import { Component } from '@angular/core';
import { CounterComponent } from './counter/counter.component';

@Component({
    selector: 'app-root',
    imports: [CounterComponent],
    template: `
    <main>
      <app-counter [(count)]="initialCount"></app-counter>
    </main>
  `,
})
export class AppComponent {
    initialCount = 18;
}
```

`ngModel` 指令也是类似的原理来实现双向绑定的，底层是结合了属性绑定和事件绑定的机制：

- 属性绑定 `[ngModel]`
- 事件绑定 `(ngModelChange)`

Angular 内置的表单控件（如 `<input>`、`<textarea>`）支持直接使用 `ngModel`。而自定义控件需要显式地实现与 `ngModel` 的交互机制。


## 数据绑定容错处理

当绑定的对象数据层级比较深，并且对象中的某些属性是可选的。如果不做容错处理，当访问的属性不存在时，就会报错。

```javascript
// app.component.ts
export class AppComponent {
    task = {
        person: {
            name: '张三'
        }
    }
}
```

```html
<!-- 方式一 -->
<span *ngIf="task.person">{{ task.person.name }}</span>
<!-- 方式二 -->
<span>{{ task.person?.name }}</span>
```

## 全局样式

```css
/* 第一种方式 在 styles.css 文件中 */
@import "~bootstrap/dist/css/bootstrap.css";
/* ~ 相对node_modules文件夹 */
```

```html
<!-- 第二种方式 在 index.html 文件中  -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@3.3.7/dist/css/bootstrap.min.css" rel="stylesheet"/>
```

```javascript
// 第三种方式 在 angular.json 文件中
"styles": [
    "./node_modules/bootstrap/dist/css/bootstrap.min.css",
    "src/styles.css"
]
```

## Component 装饰器

```typescript
@Component({
    // 指定组件的 CSS 选择器
    // 选择器会告诉 Angular：当在模板 HTML 中找到相应的标签时，就把该组件实例化在那里。
    selector: 'app-component-overview',

    // 定义 HTML 模板
    // 在单独的文件中定义 HTML 模板
    templateUrl: './component-overview.component.html',
    // HTML 模板也可以在组件中定义
    // template: '<h1>Hello World!</h1>',
    // 多行
    // template: `
    //  <h1>Hello World!</h1>
    //  <p>This template definition spans multiple lines.</p>
    // `

    // 声明组件的样式
    // 在单独的文件中定义组件模板的样式
    styleUrls: ['./component-overview.component.css']
    // 组件模板的样式也可以在组件中定义
    // styles 属性接受一个包含 CSS 规则的字符串数组
    // styles: ['h1 { font-weight: normal; }']
    // styles 属性接受一个包含 CSS 规则的字符串
    // styles: ``
})
```

### preserveWhitespaces

`preserveWhitespaces` 值为 `false` 时，从编译后的模板中移除可能多余的空白字符，为 `true` 时则保留，空白字符就是指那些能在 JavaScript 正则表达式中匹配 `\s` 的字符。默认为 `false`。

### interpolation

Angular 默认模板插值器 `{{}}`。`interpolation` 属性可以用来指定插值器的符号。

```typescript
@Component({
    template: `
        <div>
            ((data))
        </div>
    `,
    // "((", "))" 代替 "{{", "}}"
    interpolation: ["((","))"]
})
export class AppComponent {}
```

### encapsulation

主要作用是控制样式的作用域和隔离性。在 Angular 中，组件的样式默认情况下是局部的，只有在该组件的模板中生效，但也可以通过配置不同的封装策略来改变这一行为。

`encapsulation` 主要有三种取值：

- `ViewEncapsulation.Emulated`（默认值）模拟浏览器原生的 Shadow DOM 来封装组件样式。Angular 会将组件的样式加上一些属性选择器（通常是基于组件的 `ViewEncapsulation` 设置），使得样式只作用于当前组件的模板。
- `ViewEncapsulation.None`：使用此模式时，组件的样式将不受任何封装限制，样式会全局生效，任何在该组件中定义的样式都会作用于整个应用。
- `ViewEncapsulation.ShadowDom`：此模式使用浏览器的原生 Shadow DOM 实现样式封装。组件的样式仅会应用于该组件的 Shadow DOM 内部，而不会影响外部或其他组件。


### viewProviders

用于指定一个组件视图范围内的依赖注入（DI）提供者。它的作用是定义只在该组件的视图中可用的依赖，而不会影响到组件的父组件或其他地方。

#### 与 `providers` 的区别

`providers` 定义的是整个组件（包括视图和子视图）可以访问的服务，而 `viewProviders` 只在当前组件的视图中有效，作用范围较小。


### exportAs

`exportAs` 是组件或指令的一个元数据属性，用于指定一个别名，使组件或指令可以通过模板中的 `#templateReferenceVariable` （模板引用变量）进行访问。

```typescript
import { Directive } from '@angular/core';

@Directive({
    selector: '[appHighlight]',
    exportAs: 'highlight'
})
export class HighlightDirective {
    isHighlighted = false;

    toggleHighlight() {
        this.isHighlighted = !this.isHighlighted;
    }
}

```

在模板中使用：

```typescript
<div appHighlight #highlight="highlight">
    Hover me to toggle highlight
</div>
<button (click)="highlight.toggleHighlight()">Toggle Highlight</button>
<p>Highlight Status: {{ highlight.isHighlighted }}</p>
```

### host

`host` 是组件或指令的一个元数据属性，用于设置宿主元素的行为和样式。它允许你在组件或指令的宿主元素上添加事件监听器、属性、类名和样式等。

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-example',
  template: `<p>Host Element Example</p>`,
  host: {
    '[class.custom-class]': 'true',  // 添加自定义类
    '[attr.aria-label]': '"Custom Label"',  // 设置属性
    '(click)': 'onClick()',  // 绑定 click 事件
    '[style.background-color]': '"lightblue"',  // 设置背景颜色
    '[style.padding]': '"10px"'  // 设置内边距     
  }
})
export class ExampleComponent {
    onClick() {
        console.log('Host element clicked!');
    }
}

```

#### HostBinding 和 HostListener

`@HostBinding`、`@HostListener` 装饰器的功能和 `host` 属性类似，只不过使用方式不同。

- `@HostBinding` 用于将组件或指令的属性、样式、类等绑定到宿主元素。
- `@HostListener()` 可以监听宿主元素上的事件。

官网的说明：

- `HostBinding`：用于把一个 DOM 属性标记为绑定到宿主的属性，并提供配置元数据。 Angular
  在变更检测期间会自动检查宿主属性绑定，如果这个绑定变化了，它就会更新该指令所在的宿主元素。
- `HostListener`：用于声明要监听的 DOM 事件，并提供在该事件发生时要运行的处理器方法。

```typescript
import { Component, HostBinding } from '@angular/core';

@Component({
    selector: 'app-example',
    template: `<p>HostBinding Example</p>`
})
export class ExampleComponent {
    @HostBinding('class.active') isActive = true;  // 绑定宿主元素的类
    @HostBinding('style.backgroundColor') backgroundColor = 'lightblue';  // 绑定背景色
    @HostListener('click') onClick() {
        console.log('Host element clicked!');
    }

    @HostListener('window:resize', ['$event']) onResize(event: Event) {
        console.log('Window resized', event);
    }
}
```

- 使用 `@HostBinding` 和 `@HostListener` 可以提供更灵活的宿主元素交互，适用于需要动态响应事件或更改宿主元素样式和属性的场景。
- 使用 `host` 属性则更适合为宿主元素配置一些初始行为，如设置类、属性或事件监听器，但这些行为一旦定义就不会再变化。

## 变更检测机制

Angular 的**变更检测**（Change Detection）机制用于检测组件的状态变化，并更新视图，使数据与 UI 保持同步。Angular 通过 Zone.js 监听异步任务（如事件、XHR、setTimeout等）来触发变更检测，并通过 View Hierarchy（视图层次结构）遍历组件树来检查数据变更。变更检测是 Angular 中的核心功能之一，它决定了应用的响应性和性能。

### 变更检测的触发时机

变更检测是由 Angular 的**变更检测机制**触发的，主要触发时机包括：

- 用户事件：如按钮点击、输入框文本变化等，都会触发变更检测。
- 异步操作：如 HTTP 请求返回数据，或者 `setTimeout()`、`Promise` 解决等，都可能触发变更检测。
- 手动触发：通过 `ChangeDetectorRef.detectChanges()` 或 `ChangeDetectorRef.markForCheck()`，手动通知 Angular 检查某个组件或视图。

### 变更检测策略

`ChangeDetectionStrategy` 提供了两种变更检测策略：

- `ChangeDetectionStrategy.Default`：每次变更检测都会遍历组件树的所有组件（即使数据未变）。
- `ChangeDetectionStrategy.OnPush`：使用 `OnPush` 策略时，只会在以下几种情况之一时检查组件的变化：
    - 输入属性（`@Input()`）的值发生变化。
    - 组件或其子组件内部事件处理器被触发（如点击、输入等）。
    - 手动调用 `ChangeDetectorRef.detectChanges()` 或 `ChangeDetectorRef.markForCheck()`。
    - 如果在组件中订阅了 `Observable` 对象，并且使用了 Async Pipe 来处理异步数据，那么当 `Observable` 发出新的值时，也会触发变更检测。

#### ChangeDetectorRef 的使用

`ChangeDetectorRef` 提供了更精细的变更检测控制：

- `detectChanges()` 方法用于手动触发变更检测。它会**立即检查当前组件及其子组件的变更，并更新视图**。
- `markForCheck()` 方法用于标记当前组件或视图需要进行变更检测。它**不会立即触发变更检测，而是将标记添加到变更检测队列中**。在使用 `OnPush` 变更检测策略时，组件只会在特定条件下进行检测。如果希望在某些情况下让组件在下一次变更检测周期中被检查，可以使用 `markForCheck()` 。这样可以避免不必要的检测，提高应用性能。
- `detach()`：停止当前组件的变更检测，提升性能（适用于高频率变化的组件，如股票数据）。
- `reattach()`：恢复变更检测。

#### 变更检测的执行流程

1. 应用状态更新（事件、HTTP 响应等）。
2. 触发 Zone.js，通知 Angular 运行变更检测。
3. 遍历组件树，检查每个组件的 `@Input` 或本地状态。
4. 更新视图，若检测到变化，则渲染 UI。

### 变更检测的性能优化

- 减少不必要的变更检测：使用 `ChangeDetectionStrategy.OnPush` 策略。
- 不可变数据结构：推荐使用不可变数据结构。当数据发生变化时，创建一个新的数据对象，而不是修改现有对象。这样，Angular 可以**通过比较对象的引用，快速判断数据是否发生了变化**。
- 避免在模板中使用复杂的表达式：在模板中使用复杂的表达式可能会导致变更检测的性能下降。尽量将复杂的逻辑移到组件类中进行处理。
- 使用 `*ngIf` 或 `*ngFor` 时，确保正确设置 `trackBy` 函数：提供 `trackBy` 函数可以帮助 Angular 跟踪每个列表项的身份，避免不必要的 DOM 操作。
- 减少不必要的事件绑定：在模板中使用事件绑定时，确保只绑定必要的事件。避免在模板中绑定不必要的事件，以减少变更检测的次数。

{{< callout type="info" >}}
`@Input()` 修饰的**对象如果其某个属性发生变化，不会自动触发变更检测，除非该对象的引用发生变化**。这是因为 Angular 的变更检测机制在比较数据时，使用引用比较。这意味着当数据发生变化时，Angular 会检查对象的引用是否改变，而不是对象的内容。如果对象的引用没有改变，Angular 会认为数据没有发生变化，从而避免不必要的变更检测。
{{< /callout >}}