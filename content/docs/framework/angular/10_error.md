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
