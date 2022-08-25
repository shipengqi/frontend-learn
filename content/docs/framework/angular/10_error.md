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
