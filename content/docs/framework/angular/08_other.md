# Other
## `:host` 、`:host-context`、`::ng-deep`

Angular 中每个组件都有自己的样式，虽然每个组件都有自己的样式，但是最终都会打包到一起，那么，组件之间的样式会不会相互影响？

```typescript
import { Component } from '@angular/core';
 
@Component({
  selector: 'app-root',
  template: `
    <p>Parent Component</p>
    <app-a></app-a>
    <app-b></app-b>
  `,
  styles: ['p { color: red; }'] // 在父组件的 styles 里给 p 标签加上样式
})
export class AppComponent {}
```

```typescript
import { Component, OnInit } from '@angular/core';
 
@Component({
  selector: 'app-a',
  template: `
    <p>Sub Component A</p>
  `,
  styles: ['']
})
export class AComponent implements OnInit {}
```

```typescript
import { Component, OnInit } from '@angular/core';
 
@Component({
  selector: 'app-b',
  template: `
    <p>Sub Component B</p>
  `,
  styles: ['']
})
export class BComponent implements OnInit {}
```

在父组件的 styles 里给 p 标签加上样式：`styles: ['p { color: red; }']`：

![](/static/images/angular-parent-component-style.png)

组件之间的样式并没有相互影响。这是每个组件的元素都被动态的添加了一个属性，每个组件都不一样，每个组件的的样式被动态的加了个属性选择器，而这
个属性只有父组件里的元素有，这样就不会影响到别的组件了。

![](/static/images/angular-component-style-principle.png)

![](/static/images/angular-component-style-principle2.png)

每个组件的动态属性都不一样，这样选择器就只会选到自己组件的 dom 元素，从而防止组件的样式污染，让它们互不影响。

`:host` 是让选择器只选择自己组件的 dom。`styles: [':host p { color: red; }']`

![](/static/images/angular-component-style-principle3.png)

`:host` 会给选择器的前面加上一个自己组件的动态属性的属性选择器，这个动态属性只有当前这个组件有，从而保证选择器只能作用于自己的组件。

`::ng-deep` 可以忽略中间 className 的嵌套层级关系。直接找到你要修改的 className。
任何带有 `::ng-deep` 的样式都会变成全局样式。`styles: ['::ng-deep p { color: red; }']`

![](/static/images/angular-ng-deep.png)

子组件被影响了。

![](/static/images/angular-ng-deep2.png)

加了 `::ng-deep` 后，选择器后面的属性选择器没了，这样就是导致这个样式可以影响到别的组件。

实际情况下就是这两个基本是一起配合使用，在一些使用了第三方组件，又想修改第三方组件里元素的样式时, 或者是项目里的通用组件，想在某个使用它的组件里单
独修改它的样式，而不影响别的组件。

组合在一起就是只有本组件和本组件的子组件里的 div 才能被选择到, 这样既能控制范围，又能影响到子组件。

## Angular Component selector

Angular中，组件装饰器的 selector 一般这么写：

```typescript
@Component({    
    selector: 'greet', 
    template: 'Hello {{name}}!'
})
```

其他组件中使用这个组件：

```html
<greet></greet>
```

selector 还有其他的写法：

```typescript
@Component({    
   selector: '.greet', 
    template: 'Hello {{name}}!'
})
```

这个时候，要想使用这个组件，就需要这么用了：

```html
<div class='greet'></div>
```

还可以这么写:

```typescript
@Component({    
  selector: ['greet'],
  template: 'Hello {{name}}!'
})
```

使用这个组件的时候：

```html
<div greet></div>
```

## Angular Directive selector

在 Directive selector 里需要使用中括号，使用的时候去掉。

```typescript
@Directive({
  selector: '[greet]',
})
```

使用这个指令的时候：

```html
<div greet></div>
```


## ElementRef 

通过 `ElementRef` 可以轻松地访问到 native 元素。

```typescript
import {AfterViewInit, Component, ElementRef} from '@angular/core';

@Component({
    selector: 'demo-app',
    template: `
    <h1>Welcome to Angular World</h1>
    <div>Hello {{ name }}</div>
  `,
})
export class AppComponent implements AfterViewInit {
    name: string = 'Pooky';

    constructor(private elementRef: ElementRef) {}
    
    ngAfterVeiwInit() {
        let divEle = this.elementRef.nativeElement.querySelector('div');
        console.log(divEle);
    }
}
```

建议使用 `@ContentChild`、 `@ContentChildren`、`@ViewChild`、`@ViewChildren` 等装饰器。

```typescript
import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';

@Component({
  selector: 'demo-app',
  template: `
    <h1>Welcome to Angular World</h1>
    <div #greet>Hello {{ name }}</div>
  `,
})
export class AppComponent {
  name: string = 'Pooky';

  @ViewChild('greet')
  greetDiv: ElementRef;

  ngAfterViewInit() {
    this.greetDiv.nativeElement.style.backgroundColor = 'red';
  }
}
```

### Renderer2

上面的代码，设置 div 元素的背景，是默认的运行环境在是浏览器。我们要尽量减少应用层与渲染层之间强耦合关系，从而让我们应用能够灵活地运行在不同环境。

为了能够支持跨平台，Angular 通过抽象层封装了不同平台的差异。比如定义了抽象类 `Renderer2` 、抽象类 `RootRenderer` 等。此外还定义了以下引用
类型：`ElementRef`、`TemplateRef`、`ViewRef` 、`ComponentRef` 和 `ViewContainerRef` 等。通过 `模板变量`、`@ViewChild` 等方法获取 DOM 元素。

`Renderer2` 用来对元素进行设置样式、属性、插入子元素等操作。

```typescript
class Renderer2 {
    get data: {...}
    destroyNode: ((node: any) => void) | null
    destroy(): void
    createElement(name: string, namespace?: string | null): any // 创建元素
    createComment(value: string): any // 创建注释元素
    createText(value: string): any // 创建文本元素
    appendChild(parent: any, newChild: any): void // 添加子元素（在最后）
    insertBefore(parent: any, newChild: any, refChild: any): void // 添加子元素（在最前）
    removeChild(parent: any, oldChild: any): void // 移除子元素
    selectRootElement(selectorOrNode: string | any): any // 获取根元素
    parentNode(node: any): any // 获取父元素
    nextSibling(node: any): any // 获取下一个兄弟元素
    setAttribute(el: any, name: string, value: string, namespace?: string | null): void // 设置属性
    removeAttribute(el: any, name: string, namespace?: string | null): void // 移除属性
    addClass(el: any, name: string): void // 添加样式类
    removeClass(el: any, name: string): void // 移除样式类
    setStyle(el: any, style: string, value: any, flags?: RendererStyleFlags2): void // 设置样式
    removeStyle(el: any, style: string, flags?: RendererStyleFlags2): void // 移除样式
    setProperty(el: any, name: string, value: any): void // 设置DOM对象属性，不同于元素属性
    setValue(node: any, value: string): void // 设置元素值
    listen(target: 'window' | 'document' | 'body' | any, eventName: string, callback: (event: any) => boolean | void): () => void // 注册事件
}
```

```typescript
import { Component, ElementRef, ViewChild, AfterViewInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'demo-app',
  template: `
    <h1>Welcome to Angular World</h1>
    <div #greet>Hello {{ name }}</div>
  `,
})
export class AppComponent {
  name: string = 'Semlinker';

  @ViewChild('greet')
  greetDiv: ElementRef;

  constructor(private elementRef: ElementRef, private renderer: Renderer2) { }

  ngAfterViewInit() {
    // this.greetDiv.nativeElement.style.backgroundColor  = 'red';
    this.renderer.setStyle(this.greetDiv.nativeElement, 'backgroundColor', 'red');
  }
}
```

## Title

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

## Meta

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

## DOCUMENT

DOCUMENT 是表示渲染上下文的 DI 令牌。在浏览器中这就是 DOM 文档。它以与环境无关的方式提供 DOM 操作。

```typescript
@Component({
})
export class CanvasElement {
    constructor(@Inject(DOCUMENT) _doc: Document) {}
}


@Component({
})
export class CanvasElement {
    constructor(@Inject(DOCUMENT) _doc: Document) {}
    renderCanvas() {
        this._doc.getElementById("doc_id")
    }
}
```

## Location

可以使用 `Location` 服务获取当前浏览器窗口的 URL。

```typescript
import { Location } from "@angular/common"
@Component({
    ...
})
export class AppComponent {
    constructor(private location: Location) {}
    navigatTo(url) {
        this.location.go(url)
    }
    goBack() {
        location.back()
    }
    goForward() {
        location.forward()
    }
}
```

## NgZone

触发组件的变化检测的事件：

1. 组件的 `@Input` 引用发生变化。注意 `Object` 是通过引用传递的，每次对 `Object` 改动，引用不会改变。
2. 组件的 DOM 事件，包括它子组件的 DOM 事件，比如 `click`、`submit`、`mouse down`。
3. `Observable` 订阅事件，同时设置 `Async pipe`。
4. 利用以下方式手动触发变化检测：
    - `ChangeDetectorRef.detectChanges`
    - `ChangeDetectorRef.markForCheck()`
    - `ApplicationRef.tick()`

每次变更检测都意味着额外的计算和资源消耗，如何优化性能？

Angular 引入 Zone.js 以处理变更检测，具体来说，Zone.js 通过对所有常见的异步 API 打上了“补丁” 以追踪所有的异步操作，进而使 Angular 可以决定何时刷新 UI。

- `Zone` 是一种用于拦截和跟踪异步工作的机制。
- `NgZone` Zone.js 将会对每一个异步操作创建一个 task。一个 task 运行于一个 Zone 中。通常来说，在 Angular 应用中，每个 task 都会在 Angular Zone 中运行，
  这个 Zone 被称为 `NgZone`。一个 Angular 应用中只存在一个 Angular Zone，而变更检测只会由运行于这个 NgZone 中的异步操作触发。

NgZone 是一种用于在 Angular 区域内部或外部执行工作的可注入的 service。

### runOutsideAngular

函数 `runOutsideAngular` 内执行的代码不会触发变更检测。

```typescript
// setInterval 定时器便不会触发变更检测
constructor(private ngZone: NgZone) {
  this.ngZone.runOutsideAngular(() => {
    setInterval(() => doSomething(), 100)
  });
}
```

### run

`run` 方法的目的与 `runOutsideAngular` 正好相反。任何写在 `run` 里的方法，都会进入 Angular Zone 的管辖范围。

```typescript
import { Component, NgZone } from '@angular/core';
    
@Component({
  selector: 'demo-app',
  template: `
  <p>
    <label>Count: </label>
  </p>  
  `
})
export class AppComponent {
  num = 0;
  constructor(private zone: NgZone) {
    this.zone.runOutsideAngular(() => {
      let i = 0;
      const token = setInterval(() => {
        this.zone.run(() => {
          this.num = ++i;
        })

        if (i == 10) {
          clearInterval(token);
        }
      }, 1000);
    })
  }
}
```

### onUnstable 和 onStable

通过订阅 `onUnstable` 和 `onStable` 可以得知有异步行为需要变更检测，同时也能知道所有事件跑完最终稳定的时候。

```typescript
import { Component, NgZone } from '@angular/core';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private zone: NgZone) { }

  ngOnInit() {
    this.zone.onUnstable.subscribe(() => { console.log('有事件发生了') });
    this.zone.onStable.subscribe(() => { console.log('事件結束了') });
  }
}
```

## DomSanitizer
 
当使用 `iframe` 来加载一个外部网页时，Angular 的默认安全策略会禁止加载 `src` 的网页。Angular中有默认的安全规则会阻止链接的加载。
可以使用 `DomSanitizer` 来处理。

```typescript
import { DomSanitizer } from '@angular/platform-browser';
@Component({
    selector: 'my-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    link: string = 'https://www.baidu.com';
    
    constructor(private sanitizer: DomSanitizer) { }

    trust() {
        return this.sanitizer.bypassSecurityTrustResourceUrl(this.link);
    }
}
```

`DomSanitizer` 提供的方法
1. `sanitize()`
为在给定的 SecurityContext 中使用而对 value 进行转义。
如果这个值在这个上下文中是可信的，则该方法会解开所包含的安全值，并且直接使用它；否则，这个值就会根据给定的安全上下文净化成安全的，比如替换那些具有不安全协议（例如 `javascript:`）的 URL。 该实现负责确保在给定的上下文中可以绝对安全的使用该值。
2. `bypassSecurityTrustHtml()`
绕过安全检查，并信任给定的值是一个安全的 HTML。只有当要绑定的 HTML 是不安全内容（比如包含 `<script>`）而且你确实希望运行这些代码时，才需要使用它。 净化器会确保安全 HTML 的完整性，因此在大多数场景下都不需要使用该方法。
3. `bypassSecurityTrustStyle()`
绕过安全检查，并信任给定的值是一个安全的样式（CSS）。
4. `bypassSecurityTrustScript()`
绕过安全检查，并信任给定的值是一个安全的JavaScript。
5. `bypassSecurityTrustUrl()`
绕过安全检查，并信任给定的值是一个安全的样式 URL。也就是说该值可安全地用在链接或 `<img src>` 中。
6. `bypassSecurityTrustResourceUrl()`
绕过安全检查，并信任给定的值是一个安全的资源 URL。也就是说该地址可以安全的用于加载可执行代码，比如 `<script src>` 或 `<iframe src>`。


## innerHTML

使用 `innerHtml` 属性绑定，可以将 HTML 内容以字符串的形式绑定。

```html
<div [innerHTML]="content"></div>
```

组件：
```typescript
import { Component } from "@angular/core";

@Component({
  selector: "demo-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  content: string;
  constructor() {
    this.content = "Plain Text Example &amp; <strong>Bold Text Example</strong>";
  }
}
```

`content` 的内容，会当做 html 渲染。

渲染 html 通常有可能引入跨站脚本 (XSS)。html 可能包含存在安全问题的恶意脚本。解决 XSS 的一种方法是将 html 元素和属性的种类限制为一组已知的“安全”元素和属性。

使用 Angular 的 `DomSanitizer.bypassSecurityTrustHtml` 处理原始的 html，并返回可信的安全的 html 字符串内容。限制 `[innerHTML]` 值使用 `<script>` 和 `<style>` 
标签和 `style` 属性。

```typescript
import { Component } from "@angular/core";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";

@Component({
  selector: "demo-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  content: SafeHtml;
  constructor(private sanitizer: DomSanitizer) {
    this.content = this.sanitizer.bypassSecurityTrustHtml(
      "Plain Text Example &amp; <strong>Bold Text Example</strong>"
    );
  }
}
```
