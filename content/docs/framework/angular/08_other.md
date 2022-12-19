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
