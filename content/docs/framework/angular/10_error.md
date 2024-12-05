# 错误处理

## ngModel cannot be used to register form controls with a parent formGroup directive

原因是，在最外层的 form 中使用了 `formGroup` 指令，但在下面的某个表单元素中，使用了 `ngModel` 指令，但没有加入 formControl 指令或 `formControlName` 属性。

解决方法：

1. 在表单元素中添加 `formControl` 指令或 `formControlName` 属性

```html
<database-group [(ngModel)]="netconfFlag" [formControl]="netconfFlagCtrl">
```

并在相应的 `component.ts` 中定义用于验证的 `FormControl`。

2. 添加 `ngModelOptions` 指令

```html
<database-group [(ngModel)]="netconfFlag" [ngModelOptions]="{standalone: true}">
```


## It looks like you're using the disabled attribute with a reactive form directive.

```bash
  It looks like you're using the disabled attribute with a reactive form directive. If you set disabled to true
  when you set up this control in your component class, the disabled attribute will actually be set in the DOM for
  you. We recommend using this approach to avoid 'changed after checked' errors.

  Example:
  form = new FormGroup({
    first: new FormControl({value: 'Nancy', disabled: true}, Validators.required),
    last: new FormControl('Drew', Validators.required)
  });
```

在 `input` 上使用了 angular 的数据绑定，即使计算之后的值是对的，也是无法生效的，但是直接使用 html 的 `input` 标签的属性就是可以的

直接给 `[disabled]='true'` -> 不生效
直接设置 `disabled` 属性 -> 生效，因为这就相当于操作了 input 标签本身的 html 属性，和 angular 就没啥关系

不生效的原因是：我的 `input` 是一个 formControl， angular 希望你通过给 fromControl 实例设置 `disabled` 来禁用它，
而不是在它上面绑定 `[disabled]` 属性

angular 推荐的方式：
```javascript
formControl.disable(); // 禁用
formControl.enable(); // 启用
```

或者，设置 `input` 原生的 `disabled` 属性：
```javascript
[attr.disabled]="!!readonly ? '' : null"
```


## crypto add a fallback 'resolve.fallback: { "crypto": require.resolve("crypto-browserify") }'

```
BREAKING CHANGE: webpack < 5 used to include polyfills for node.js core modules by default.
This is no longer the case. Verify if you need this module and configure a polyfill for it.

If you want to include a polyfill, you need to:
	- add a fallback 'resolve.fallback: { "crypto": require.resolve("crypto-browserify") }'
	- install 'crypto-browserify'
If you don't want to include a polyfill, you can use an empty module like this:
	resolve.fallback: { "crypto": false }
 @ ./config/amplify.ts 1:0-49 3:27-41
 @ ./src/App.tsx 6:0-42 21:18-27
 @ ./src/index.tsx 5:0-24 14:118-121
```

解决：

`npm install crypto-browserify`

配置 `package.json`：

```json
"browser": {
  "crypto": false
},
"dependencies": {
  "crypto-browserify": "^3.12.0"
  // ...
}
```

## Error: bundle initial exceeded maximum budget.


Open `angular.json` file and find `budgets` keyword.

```json
    "budgets": [
       {
          "type": "initial",
          "maximumWarning": "2mb",
          "maximumError": "5mb"
       }
    ]
```

## The injectable 'xxx' needs to be compiled using the JIT compiler, but '@angular/compiler' is not available.

See https://angular.io/guide/creating-libraries#consuming-partial-ivy-code-outside-the-angular-cli.


```typescript
// TODO: Upgrade Cypress and remove this workaround
// See more here: https://github.com/cypress-io/cypress/issues/19066

import * as path from 'path';

const tsConfigFile = path.resolve(__dirname, '../tsconfig.json');

export default {
  resolve: {
    fullySpecified: false,
    extensions: ['.ts', '.js', '.mjs']
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: [ /node_modules/ ],
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
            configFile: tsConfigFile
          }
        }
      },
      { // Angular linker needed to link partial-ivy code
        // See https://angular.io/guide/creating-libraries#consuming-partial-ivy-code-outside-the-angular-cli
        test: /[/\\]@angular[/\\].+\.m?js$/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: ['@angular/compiler-cli/linker/babel'],
            compact: false,
            cacheDirectory: true
          }
        }
      },
      {
        test: /ngx-logger.*\.m?js$/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: ['@angular/compiler-cli/linker/babel'],
            compact: false,
            cacheDirectory: true
          }
        }
      }
    ]
  }
};

```


ExpressionChangedAfterItHasBeenCheckedError 是 Angular 的一个常见错误，它通常出现在开发模式下。当 Angular 检测到某个值在检测周期之后发生了变化时，就会抛出此错误。

错误背景
Angular 采用 变更检测（Change Detection） 的机制，来确保视图（HTML）中的数据和组件中的数据保持同步。每当发生变化时，Angular 会进行变更检测。如果在变更检测过程中，某个数据发生了变化，Angular 会检测到不一致，并抛出 ExpressionChangedAfterItHasBeenCheckedError 错误。

这个错误通常发生在：

在组件的 ngOnInit 或构造函数中修改了绑定的属性（视图绑定）。
在生命周期钩子（如 ngAfterViewInit 或 ngAfterViewChecked）中修改了绑定值。
当你使用了异步数据（例如：setTimeout、Promise、Observable 等）来更新视图。


错误示例
typescript
Copy code
export class MyComponent implements OnInit {
title = 'Initial title';

ngOnInit() {
// 在 ngOnInit 中改变了 title
setTimeout(() => {
this.title = 'Updated title';
}, 0);
}
}
在这个例子中，setTimeout 会在 Angular 完成第一次变更检测后修改 title，导致 Angular 检测到数据不一致，从而抛出错误。

如何解决这个错误
1. 使用 ChangeDetectorRef.detectChanges()
   可以显式地触发变更检测，以告诉 Angular 更新视图。

typescript
Copy code
import { Component, ChangeDetectorRef, OnInit } from '@angular/core';

@Component({
selector: 'app-my-component',
templateUrl: './my-component.component.html',
})
export class MyComponent implements OnInit {
title = 'Initial title';

constructor(private cdRef: ChangeDetectorRef) {}

ngOnInit() {
setTimeout(() => {
this.title = 'Updated title';
this.cdRef.detectChanges();  // 手动触发变更检测
}, 0);
}
}
在上面的代码中，detectChanges() 会强制 Angular 重新运行变更检测，从而解决了错误。

2. 使用 ngAfterViewInit 或 ngAfterViewChecked
   你可以将属性的更新放在 ngAfterViewInit 或 ngAfterViewChecked 生命周期钩子中。ngAfterViewInit 在视图初始化之后调用，因此不会立即触发错误。

typescript
Copy code
import { Component, AfterViewInit } from '@angular/core';

@Component({
selector: 'app-my-component',
templateUrl: './my-component.component.html',
})
export class MyComponent implements AfterViewInit {
title = 'Initial title';

ngAfterViewInit() {
setTimeout(() => {
this.title = 'Updated title';
}, 0);
}
}
使用 ngAfterViewInit 或 ngAfterViewChecked 可以避免 Angular 在当前变更检测周期中检测到不一致的情况，因为这两个钩子会在视图初始化后调用。

3. 使用 ChangeDetectionStrategy.OnPush
   如果你的组件使用了 ChangeDetectionStrategy.OnPush，Angular 会只在输入属性变化时重新运行变更检测。在这种情况下，你需要显式地触发变更检测，通常使用 ChangeDetectorRef。

typescript
Copy code
import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit } from '@angular/core';

@Component({
selector: 'app-my-component',
templateUrl: './my-component.component.html',
changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyComponent implements OnInit {
title = 'Initial title';

constructor(private cdRef: ChangeDetectorRef) {}

ngOnInit() {
setTimeout(() => {
this.title = 'Updated title';
this.cdRef.markForCheck();  // 标记组件为需要检查
}, 0);
}
}
在这个例子中，markForCheck() 会告诉 Angular 检查该组件的变更，从而避免在生命周期钩子中直接更改数据。

4. 延迟更新
   在某些情况下，你可以通过将数据更新操作延迟到下一个 JavaScript 事件循环中，来避免在变更检测过程中更改值。

typescript
Copy code
export class MyComponent implements OnInit {
title = 'Initial title';

ngOnInit() {
setTimeout(() => {
this.title = 'Updated title';
}, 0);  // 延迟更新到下一个事件循环
}
}
这会将更新放入队列中，确保它在变更检测完成后执行，从而避免错误。

5. 使用 zone.js NgZone.run() (不推荐)
   NgZone 可以用来在 Angular 的 Zone 之外执行异步操作，并确保变更检测周期被正确处理。然而，这种方法通常不推荐，因为它可能会绕过 Angular 的正常变更检测机制，可能导致其他问题。

typescript
Copy code
import { Component, NgZone } from '@angular/core';

@Component({
selector: 'app-my-component',
templateUrl: './my-component.component.html',
})
export class MyComponent {
title = 'Initial title';

constructor(private ngZone: NgZone) {}

ngOnInit() {
this.ngZone.run(() => {
setTimeout(() => {
this.title = 'Updated title';
}, 0);
});
}
}
这种方法通常更适用于更复杂的场景，基本情况下推荐使用其他解决方案。

总结
ExpressionChangedAfterItHasBeenCheckedError 是因为在 Angular 的变更检测周期内，某个属性的值发生了变化。常见的解决方案有：

使用 ChangeDetectorRef.detectChanges() 来手动触发变更检测。
使用 ngAfterViewInit 或 ngAfterViewChecked 来延迟数据的更新。
延迟数据更新到下一个事件循环（例如，使用 setTimeout()）。
如果使用 OnPush 策略，确保显式触发变更检测。
通常情况下，推荐使用 ChangeDetectorRef.detectChanges() 或 markForCheck() 来解决此问题。
