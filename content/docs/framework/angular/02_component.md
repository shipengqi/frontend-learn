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