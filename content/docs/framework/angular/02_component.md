# Angular 组件

Angular 的每个组件都包括几个部分：

- 一个 HTML 模板
- 一个 Typescript 类
- 一个 CSS 选择器
- (可选）要应用在模板上的 CSS 样式

## 创建组件

```bash
ng generate component <component-name>
```

生成一个 `<component-name>` 命名的文件夹，包含四个文件：

- `<component-name>.component.ts`
- `<component-name>.component.html`
- `<component-name>.component.css`
- `<component-name>.component.spec.ts` 测试文件


### 手动创建

1. 创建 `<component-name>.component.ts`
2. 文件顶部导入 `Component` 装饰器 `import { Component } from '@angular/core';`
3. 添加一个 `@Component` 装饰器
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
   })
   ```
4. 添加组件 class
   ```typescript
   @Component(...)
   export class ComponentOverviewComponent {}
   ```

## 生命周期

Angular 生命周期钩子执行顺序：

1. `ngOnChanges` Angular 设置或重新设置数据绑定的输入属性时调用。
2. `ngOnInit`  Angular 第一次显示数据绑定和设置指令/组件的输入属性之后调用
3. `ngDoCheck`
4. `ngAfterContentInit`
5. `ngAfterContentChecked`
6. `ngAfterViewInit` Angular 初始化完组件视图及其子视图或包含该指令的视图之后调用
7. `ngAfterViewChecked`
8. `ngOnDestroy` Angular 每次销毁指令/组件之前调用

## 组件之间的样式

Angular 每个组件都有自己的样式，但是每个组件的样式最终都会打包到一起，那么，组件之间的样式是否会相互影响？

Angular 给每个组件的元素动态的加上独有的属性，然后给这个组件的选择器后面也动态的加上这个独有属性选择器，而每个组件的动态属性都不一样，这样选择器
就只会选到自己组件的 Dom 元素，从而防止组件的样式污染，让它们互不影响。


### `:host`

`:host` 是让选择器只选择自己组件的 Dom

保证选择器只能作用于自己的组件

### `::ng-deep`

加了 `::ng-dee` p后，选择器后面的属性选择器没了，这样就是导致这个样式可以影响到别的组件


### `:host` 和 `::ng-deep`

在一些使用了第三方组件，又想修改第三方组件里元素的样式时, 或者是项目里的通用组件，想在某个使用它的组件里单独修改它的样式，而不影响别的组件

`:host` 和 `::ng-deep` 配合使用 

```css
:host ::ng-deep .modal-dialog {
  margin-top: 10%;
}
```

`:host` 在前面加了个本组件的动态属性的属性选择器，确保样式只生效于本组件和他的子组件，`::ng-deep` 把选择器后面的属性选择器去掉了，这样就能作用别的组件了。

组合在一起就是只有本组件和本组件的子组件里的div才能被选择到, 这样既能控制范围，又能影响到子组件


### `:host-context`

需要满足某条件才能应用样式。它在当前组件宿主元素的祖先节点中查找 CSS 类，直到文档的根节点为止。如果找到，才会应用后面的样式到本组件内部元素。

## 内容投影

在组件模板中，添加 `<ng-content>` 元素，让你希望投影的内容出现在其中。

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-zippy-basic',
  template: `
    <h2>Single-slot content projection</h2>
    <ng-content></ng-content>
  `
})
export class ZippyBasicComponent {}
```

有了 <ng-content> 元素，该组件的用户现在可以将自己的消息投影到该组件中。比如：

```html
<app-zippy-basic>
  <p>Is content projection cool?</p>
</app-zippy-basic>
```

### 多插槽内容投影
一个组件可以具有多个插槽。每个插槽可以指定一个 CSS 选择器，该选择器会决定将哪些内容放入该插槽。该模式称为多插槽内容投影。

通过使用 `<ng-content>` 的 `select` 属性来实现。

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-zippy-multislot',
  template: `
    <h2>Multi-slot content projection</h2>

    Default:
    <ng-content></ng-content>

    Question:
    <ng-content select="[question]"></ng-content>
  `
})
export class ZippyMultislotComponent {}
```

使用 `question` 属性的内容将投影到带有 `select=[question]` 属性的 `<ng-content>` 元素。

```html
<app-zippy-multislot>
  <p question>
    Is content projection cool?
  </p>
  <p>Let's learn about content projection!</p>
</app-zippy-multislot>
```


### 有条件的内容投影

在这种情况下，不建议使用 `<ng-content>` 元素，因为只要组件的使用者提供了内容，即使该组件从未定义 `<ng-content>` 元素或该 `<ng-content>` 元素位于 `ngIf` 语句的内部，该内容也总会被初始化。

使用 `<ng-template>` 元素，你可以让组件根据你想要的任何条件显式渲染内容，并可以进行多次渲染。在显式渲染 `<ng-template>` 元素之前，Angular 不会初始化该元素的内容。

在接受 `<ng-template>` 元素的组件中，使用 `<ng-container>` 元素渲染该模板，比如：

```html
<ng-container [ngTemplateOutlet]="content.templateRef"></ng-container>

<ng-template appExampleZippyContent>
   It depends on what you do with it.
</ng-template>
```

将 `<ng-container>` 元素包装在另一个元素（比如 div 元素）中，然后应用条件逻辑。

```html
<div *ngIf="expanded" [id]="contentId">
    <ng-container [ngTemplateOutlet]="content.templateRef"></ng-container>
</div>
```
