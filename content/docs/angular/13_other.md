---
title: 其他
weight: 13
---

# Angular 操作 DOM

## ElementRef 

`ElementRef` 是一个包装器，提供了对原生 DOM 元素的引用，通常是通过 `@ViewChild` 或 `@ContentChild` 来访问模板中的元素，但也可以直接注入 `ElementRef` 来操作**宿主元素**。

当你直接注入 `ElementRef` 时，Angular 会自动将组件或指令的宿主元素传递给你。你可以通过 ElementRef 访问宿主元素，并执行一些 DOM 操作：

```typescript
import { Component, ElementRef, OnInit } from '@angular/core';

@Component({
    selector: 'app-example',
    template: `<p>This is an example component!</p>`
})
export class ExampleComponent implements OnInit {
    constructor(private elementRef: ElementRef) {}

    ngOnInit() {
        // 通过 ElementRef 访问宿主元素
        console.log(this.elementRef.nativeElement); // 打印宿主元素
        this.elementRef.nativeElement.style.backgroundColor = 'lightblue'; // 动态修改背景色
    }
}

```

直接注入 `ElementRef` 虽然可以直接通过 `nativeElement` 操作 DOM，但更推荐使用 `Renderer2` 来确保代码的跨平台兼容性、安全性和稳定性。

## ViewRef

`ViewRef` 是 Angular 视图 (View) 的抽象。在 Angular 中，`View` 是应用程序的基本构建块。它是在一起被创建或者销毁的最小元素组单位。Angular 哲学鼓励开发者将 UI 界面
看作 View 的聚合。而不要看作标准的 HTML 元素树。

Angular 支持两种 View:

- Embedded View，指 `Template`
- Host View，指 `Component`

## ViewContainerRef

用于动态地管理视图（View）的 Service。它允许你在运行时向应用程序中添加、移除或更改视图（模板），从而实现动态组件加载、条件渲染等功能。

### 动态创建组件

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-dynamic',
  template: `<p>This is a dynamically loaded component!</p>`
})
export class DynamicComponent {}

```

父组件：

```typescript
import { Component, ViewChild, ViewContainerRef, ComponentFactoryResolver, OnInit } from '@angular/core';
import { DynamicComponent } from './dynamic.component';

@Component({
    selector: 'app-parent',
    template: `<ng-container #container></ng-container>`
})
export class ParentComponent implements OnInit {
    @ViewChild('container', { read: ViewContainerRef }) container: ViewContainerRef;

    constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

    ngOnInit() {
        // 创建并插入动态组件
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(DynamicComponent);
        this.container.clear();  // 清除之前的视图（如果有的话）
        this.container.createComponent(componentFactory);  // 动态加载组件
    }
}

```

1. 使用 `@ViewChild('container', { read: ViewContainerRef })` 获取 `ViewContainerRef`。
2. 通过 `ComponentFactoryResolver` 创建 `DynamicComponent` 的工厂，并使用 `ViewContainerRef` 将组件插入视图。
3. `clear()` 方法用于清除容器中的所有现有视图（可选，防止插入多个相同组件）。


### 动态插入模板

`ViewContainerRef` 还可以与 `TemplateRef` 配合使用，用于动态插入模板。

```typescript
import { Component, ViewChild, ViewContainerRef, TemplateRef, OnInit } from '@angular/core';

@Component({
  selector: 'app-parent',
  template: `
    <ng-template #template>
      <p>This is a dynamically inserted template!</p>
    </ng-template>
    <ng-container #container></ng-container>
  `
})
export class ParentComponent implements OnInit {
  @ViewChild('container', { read: ViewContainerRef }) container: ViewContainerRef;
  @ViewChild('template') template: TemplateRef<any>;

  ngOnInit() {
    // 动态插入模板
    this.container.createEmbeddedView(this.template); 
  }
}

```

### 条件渲染

`ViewContainerRef` 可以通过动态加载组件和模板来实现条件渲染。

```typescript
import { Component, ViewChild, ViewContainerRef, ComponentFactoryResolver, OnInit } from '@angular/core';
import { DynamicComponent } from './dynamic.component';

@Component({
  selector: 'app-parent',
  template: `
    <button (click)="toggleComponent()">Toggle Component</button>
    <ng-container #container></ng-container>
  `
})
export class ParentComponent implements OnInit {
  @ViewChild('container', { read: ViewContainerRef }) container: ViewContainerRef;
  private componentCreated = false;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

  ngOnInit() {}

  toggleComponent() {
    if (this.componentCreated) {
      this.container.clear();  // 移除组件
      this.componentCreated = false;
    } else {
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(DynamicComponent);
      this.container.createComponent(componentFactory);  // 动态创建组件
      this.componentCreated = true;
    }
  }
}

```

在上面的代码中：

- 点击按钮会动态插入或删除 `DynamicComponent`。
- 通过 `ViewContainerRef.clear()` 方法移除组件或视图。

## Renderer2

`Renderer2` 是一个用于与 DOM 进行交互的服务，它提供了一些安全的、平台无关的 API 来操作 DOM 元素。

`Renderer2` 的主要目的是提供跨平台的兼容性，使得 Angular 应用可以在浏览器、服务器端渲染（Angular Universal）等环境下正常工作，同时也提高了代码的安全性（例如避免直接操作 DOM 引发 XSS 攻击）。

```typescript
import { Component, Renderer2, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html'
})
export class ExampleComponent implements OnInit {

  constructor(private renderer: Renderer2, private el: ElementRef) {}

  ngOnInit() {
    // 使用 Renderer2 操作 DOM
  }
}

```
- `setProperty`：用于设置指定元素的属性，第二个参数是要设置的值。

   ```typescript
   this.renderer.setProperty(this.el.nativeElement, 'textContent', 'Hello World!');
   ``` 
  
- `setStyle`：用于设置元素的样式，第一个参数是 DOM 元素，第二个参数是 CSS 属性名称，第三个参数是样式的值。
- `removeStyle`：移除元素的指定样式。

   ```typescript
   this.renderer.setStyle(this.el.nativeElement, 'color', 'red');
   this.renderer.removeStyle(this.el.nativeElement, 'color');
   ``` 
  
- `addClass`：给元素添加指定的 CSS 类。
- `removeClass`：从元素中移除指定的 CSS 类。

   ```typescript
   this.renderer.addClass(this.el.nativeElement, 'highlight');
   this.renderer.removeClass(this.el.nativeElement, 'highlight');
   ```

- `listen`：用于监听 DOM 事件

   ```typescript
   const unsubscribe = this.renderer.listen(this.el.nativeElement, 'click', (event) => {
     console.log('Element clicked');
   });
   ```
  
- `createElement`：用于创建一个 DOM 元素。
- `createText`：用于创建一个文本节点。
- `appendChild`：用于将子元素添加到父元素。
- `removeChild`：`方法，用于从父元素中移除子元素。

   ```typescript
   const div = this.renderer.createElement('div');
   const text = this.renderer.createText('Hello Renderer2!');
   this.renderer.appendChild(div, text);
   this.renderer.appendChild(this.el.nativeElement, div);
   this.renderer.removeChild(this.el.nativeElement, div);
   ```
  
# Title

Title 标签是一个 HTML 元素，用于指定网页标题。Title 标签作为给定结果的可点击标题，显示在搜索引擎结果页面（SERP）上。它们对于可用性、SEO 和社交共享而言至关重要。

Angular 在 `@angular/platform-browser` 中有一个 `Title` 服务。只需将 `Title` 服务注入到组件中，然后使用 `setTitle` 方法设置标题。

```typescript
import { Title } from "@angular/platform-browser"
@Component({
    ...
})
export class LoginComponent implements OnInit {
    constructor(private title: Title) {}
    ngOnInit() {
        title.setTitle("Login")
    }
}
```

# Meta

Angular 在 `@angular/platform-browser` 中有一个 `Meta` 服务，使我们能够从组件中设置 `meta` 标签。

Meta 元素提供有关网页的信息，搜索引擎可以在这些信息的帮助下正确地分类网页。

```typescript
import { Meta } from "@angular/platform-browser"
@Component({
    ...
})
export class BlogComponent implements OnInit {
    constructor(private meta: Meta) {}
    ngOnInit() {
        meta.updateTag({name: "title", content: ""})
        meta.updateTag({name: "description", content: "Lorem ipsum dolor"})
        meta.updateTag({name: "image", content: "./assets/blog-image.jpg"})
        meta.updateTag({name: "site", content: "My Site"})
    }
}
```

# DOCUMENT

`DOCUMENT` 是一个注入令牌（token），它是一个用于获取和操作浏览器 `document` 对象的服务。直接使用 `window.document` 只能在浏览器环境中工作，而 Angular 提供的 `DOCUMENT` 是通过依赖注入来提供的，可以在浏览器和其他环境（如服务器端渲染）之间自动适配。

```typescript
import { Component, Inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
    selector: 'app-document-example',
    template: `<h1>Check the document title in the console!</h1>`
})
export class DocumentExampleComponent implements OnInit {

    constructor(@Inject(DOCUMENT) private document: Document) {}

    ngOnInit() {
        // 访问和操作 document 对象
        console.log('Document title:', this.document.title);
        this.document.title = 'New Document Title'; // 修改文档标题
    }
}

```

# Location

`Location` 是一个提供访问和操作浏览器 URL 的服务。它允许在不重新加载页面的情况下操作浏览器的历史记录和 URL。这使得你能够在单页面应用（SPA）中实现 URL 路由和导航，同时避免浏览器刷新。

不要直接修改 `window.location`，使用 `Location` 或 `Router` 来保证跨平台兼容性。并且 `Location` 支持服务端渲染（SSR），可以在 Node.js 环境中模拟操作。

## 与 window.location 的区别

| 功能 | Angular `Location` | `window.location` |
| --- |--------------------| --- |
| 修改 URL | 可以修改 URL，不会刷新页面    | 修改 URL 时通常会导致页面刷新 |
| 支持单页面应用（SPA） | 是专为单页面应用设计的工具                   | 通常用于传统的页面导航和跳转 |
| 操作历史记录 | 提供 `back` 和 `forward` 方法 | 使用 `history.back()` 等实现 |
| 获取和解析 URL | 提供 `path()` 等方法获取路径部分 | 提供 `window.location.pathname` 等 |
| 不触发页面刷新 | 支持通过 `go()` 和 `replaceState()` 修改 URL 而不刷新页面 | 大部分操作都会导致页面刷新 |


适用场景：

| 场景 | Angular `Location` | `window.location` |
| --- |--------------------| --- |
| 单页面应用（SPA） | 推荐使用，用于导航和历史记录管理              | 不推荐，会导致页面刷新 |
| 传统页面跳转 | 不适用 | 推荐使用 |
| 操作浏览器历史记录 | 提供方便的方法，如 `back()`、`forward()` | 可以通过 `window.history` 操作 |
| URL 操作与刷新行为 | 不刷新页面，适合动态导航 | 大多数情况下刷新页面 |


# NgZone

`NgZone` 是 Angular 提供的一个服务，用于与 Angular 的变更检测机制进行交互，帮助你控制异步操作和变更检测的行为。

`NgZone` 允许你在执行异步操作时明确控制是否触发变更检测，避免不必要的性能开销。

`NgZone` 是 Angular 基于 zone.js 库的一个封装，zone.js 是一个 JavaScript 库，帮助开发者追踪异步任务的执行。通过 `NgZone`，Angular 可以追踪和管理异步任务（如定时器、HTTP 请求、用户输入事件等），并确保这些任务在执行后会触发 Angular 的变更检测机制。

## runOutsideAngular

函数 `runOutsideAngular` 内执行的代码不会触发变更检测。

```typescript
import { Component, NgZone } from '@angular/core';

@Component({
    selector: 'app-ngzone-example',
    template: `<h1>{{ message }}</h1>`
})
export class NgZoneExampleComponent {
    message: string = 'Hello';

    constructor(private ngZone: NgZone) {}

    startLongRunningTask() {
        // 在 Angular Zone 外部运行代码，不触发变更检测
        this.ngZone.runOutsideAngular(() => {
            setInterval(() => {
                // 假设这是一个非常频繁的操作
                console.log('Running outside Angular zone');
            }, 1000);
        });
    }
}

```

## run

`run` 方法的目的与 `runOutsideAngular` 正好相反。任何写在 `run` 里的方法，都会进入 Angular Zone 的管辖范围，确保变更检测被触发。

```typescript
import { Component, NgZone } from '@angular/core';

@Component({
    selector: 'app-ngzone-example',
    template: `<h1>{{ message }}</h1>`
})
export class NgZoneExampleComponent {
    message: string = 'Hello';

    constructor(private ngZone: NgZone) {}

    updateMessage() {
        // 在 Angular Zone 内运行，确保变更检测被触发
        this.ngZone.run(() => {
            this.message = 'Updated Message';
        });
    }
}

```

## onStable

`onStable`：是一个 Observable，它会在 Angular 完成所有异步任务并且变更检测稳定后触发。这在需要确保所有变更检测已经完成之后执行某些操作时非常有用。

```typescript
import { Component, NgZone, OnInit } from '@angular/core';

@Component({
    selector: 'app-ngzone-example',
    template: `<h1>{{ message }}</h1>`
})
export class NgZoneExampleComponent implements OnInit {
    message: string = 'Hello';

    constructor(private ngZone: NgZone) {}

    ngOnInit() {
        // 监听 Angular Zone 的稳定事件
        this.ngZone.onStable.subscribe(() => {
            console.log('All asynchronous tasks have completed.');
        });
    }
}

```

## hasPendingMacrotasks 和 hasPendingMicrotasks

`hasPendingMacrotasks` 和 `hasPendingMicrotasks` 用于检查 Angular Zone 内是否还有待处理的宏任务和微任务。这在调试时可以非常有用，帮助你确定是否还有异步任务在执行。

```typescript
import { Component, NgZone, OnInit } from '@angular/core';

@Component({
  selector: 'app-ngzone-example',
  template: `<h1>{{ message }}</h1>`
})
export class NgZoneExampleComponent implements OnInit {
  message: string = 'Hello';

  constructor(private ngZone: NgZone) {}

  ngOnInit() {
    console.log('Has pending macro tasks:', this.ngZone.hasPendingMacrotasks);
    console.log('Has pending micro tasks:', this.ngZone.hasPendingMicrotasks);
  }
}

```
# DomSanitizer

用于帮助开发者安全地处理动态 HTML、样式、URL、资源等。它的主要作用是防止 跨站脚本攻击（XSS），通过对可能不安全的内容进行清理和消毒，确保它们在渲染时不会带来安全风险。

```typescript
import { Component } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeStyle, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';

@Component({
    selector: 'app-example',
    template: `
    <div [innerHTML]="trustedHtml"></div>
    <img [src]="trustedUrl" />
  `,
})
export class ExampleComponent {
    trustedHtml: SafeHtml;
    trustedUrl: SafeUrl;

    constructor(private sanitizer: DomSanitizer) {
        // 使用 DomSanitizer 处理不安全的内容
        this.trustedHtml = this.sanitizer.bypassSecurityTrustHtml('<p>Unsafe HTML content</p>');
        this.trustedUrl = this.sanitizer.bypassSecurityTrustUrl('javascript:alert("XSS Attack")');
    }
}

```

`DomSanitizer` 常用方法：
- `bypassSecurityTrustHtml`：将不安全的 HTML 内容标记为“可信”，以便 Angular 渲染。这个方法通常用于插入动态 HTML 内容。
- `bypassSecurityTrustUrl`：将 URL 标记为可信的 URL，通常用于动态绑定 href、src 或其他需要 URL 的属性。
- `bypassSecurityTrustStyle`：将 CSS 样式标记为可信，允许动态添加不安全的样式到组件中。
   
   ```typescript
   import { DomSanitizer } from '@angular/platform-browser';

   export class ExampleComponent {
     constructor(private sanitizer: DomSanitizer) {}

     getTrustedStyle() {
       const unsafeStyle = 'background-color: red;';
       return this.sanitizer.bypassSecurityTrustStyle(unsafeStyle);
     }
   }
   ```
- `bypassSecurityTrustResourceUrl`：用于将不安全的资源 URL（如 `iframe` 的 src）标记为可信资源。可以用于动态加载嵌入式资源（如视频、音频等）。

# Attribute 装饰器

`@Attribute` 装饰器用于读取宿主元素的属性，而不是组件或指令的输入属性。 它主要用于访问那些静态的 HTML 属性（如 `id`, `class`, `aria-label` 等），并且这些属性是直接应用在宿主元素上的。

```html
<app-example data-id="12345"></app-example>
```

```typescript
import { Component, Attribute } from '@angular/core';

@Component({
    selector: 'app-example',
    template: `<p>{{ dataId }}</p>`
})
export class ExampleComponent {
    constructor(@Attribute('data-id') public dataId: string) {
        console.log('Data ID:', dataId); // 12345
    }
}

```

# APP_INITIALIZER

有时候我们需要在 Angular 应用启动时运行一段代码，这段代码可能会加载一些设置，比如加载缓存，加载配置。可以使用 `APP_INITIALIZER`。

`APP_INITIALIZER`：初始化应用时执行的函数。如果这些函数中的任何一个返回一个 `Promise` 或 `Observable`，初始化就不会完成，直到 `Promise` 被解析或 `Observable` 被完成。

只需要 `AppModule` 中添加 `APP_INITIALIZER` 即可：

```typescript

function runSettingsOnInit() {
    ...
}

@NgModule({
    providers: [
        { provide: APP_INITIALIZER, useFactory: runSettingsOnInit }
    ]
})
```

Angular 支持多个 `APP_INITIALIZER`，多个 `APP_INITIALIZER` 是**并行执行**的。如果某些初始化逻辑是异步的（例如返回 `Promise` 
或 `Observable`），Angular 会等待所有异步操作完成后，再继续引导（bootstrap）应用程序。

# ENVIRONMENT_INITIALIZER

`ENVIRONMENT_INITIALIZER` 是 Angular 14 引入的，用于在 Angular 应用启动期间运行长时间任务。它允许开发者在环境注入器中注入一个或多个初始化函数，这些函数在环境准备阶段执行。这个特性特别适用于那些需要在应用程序启动时完成的初始化工作，但又不适合放在 `APP_INITIALIZER` 中执行的场景。比如设置全局的服务或配置，这些工作通常需要在应用程序完全启动之前完成。

提高应用性能：通过在环境级别进行初始化，可以减少应用启动时的延迟，因为这些初始化任务可以在应用程序完全启动之前完成，从而提高应用的性能和响应速度。

# PLATFORM_INITIALIZER

`PLATFORM_INITIALIZER` 是用于初始化 Angular 平台的机制。这个机制允许开发者在 Angular 平台（例如在浏览器中）完全启动之前执行一些初始化逻辑。

`PLATFORM_INITIALIZER` 通常用于执行那些需要在 Angular 平台完全启动之前完成的初始化任务，比如设置全局的提供者和服务。这个初始化器与 `APP_INITIALIZER` 和 `ENVIRONMENT_INITIALIZER` 的主要区别在于它的执行时机和作用范围，它更侧重于平台级别的初始化。


# `:host` 、`:host-context`、`::ng-deep`

## `:host`

`:host` 是一个伪类选择器，用于选中当前组件的宿主元素（即 `<my-component></my-component>`）。它可以用于定义组件根元素的样式。该选择器允许你从组件的样式文件中访问组件外部的宿主元素，而不是组件内部的子元素。

```html
<!-- my-component.component.html -->
<div class="inner">
  <p>Content inside component</p>
</div>
```

在组件的样式中，使用 `:host` 来修改宿主元素的样式：

```css
/* my-component.component.css */
:host {
  display: block;
  border: 1px solid red;
  padding: 20px;
}

:host(.highlight) {
  background-color: yellow;
}

```

在这个例子中 `:host` 选择器作用于组件的宿主元素 `<my-component></my-component>`。

- `:host` 只能影响宿主元素（组件标签）。
- 适用于修改组件根元素的样式。

## `:host-context`

`:host-context` 是另一个伪类选择器，作用于宿主元素及其外部上下文。它允许你根据宿主元素的外部环境（即外部父组件或全局样式）来修改组件的样式。

`:host-context` 选择器类似于 `:host`，但它可以应用样式时依赖宿主元素的某些父元素的样式或类。

示例，一个父组件：

```css
<!-- parent.component.html -->
<app-my-component class="special"></app-my-component>

```

在 `MyComponent` 的样式中：

```css
/* my-component.component.css */
:host-context(.special) {
  background-color: lightblue;
}

:host-context(.another-class) {
  background-color: lightgreen;
}

```

在这个例子中：

- 当 `app-my-component` 的外部元素（父元素）有 `special` 类时，`MyComponent` 会获得 `background-color: lightblue` 的样式。
- 当父元素有 `another-class` 时，`background-color` 会变为 `lightgreen`。

## `::ng-deep`

`::ng-deep` 是一个 Angular 特有的伪类选择器，用于穿透组件的样式封装，允许你修改子组件或深层子元素的样式，即使这些子元素位于封装的视图中。

由于 Angular 使用的是 视图封装（View Encapsulation），通常，组件的样式只会影响该组件内部的元素，不会影响到其子组件或外部元素。`::ng-deep` 允许你突破这种封装，**影响子组件内部的样式**。

示例：一个子组件 `ChildComponent`，并且你想在父组件中修改 `ChildComponent` 的样式。可以使用 `::ng-deep`：

```html
<!-- parent.component.html -->
<app-child></app-child>
```

在父组件的样式中：

```css
/* parent.component.css */
::ng-deep app-child .child-element {
  color: red;
}
```

即使 `app-child` 有自己的封装样式，父组件仍然可以通过 `::ng-deep` 来修改 `app-child` 内部的 `.child-element` 元素的样式。
