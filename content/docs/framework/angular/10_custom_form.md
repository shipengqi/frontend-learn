---
title: 自定义表单控件
weight: 10
---

## 自定义表单控件

创建自定义表单控件时，通常需要三步：

- 实现 `ControlValueAccessor` 接口：使自定义控件能够与 Angular 表单框架配合使用。
- 实现 `Validator` 接口：提供自定义的验证逻辑。
- 注册自定义控件为 Angular 表单控件。

## 实现 ControlValueAccessor 接口

`ControlValueAccessor` 接口允许自定义控件与 Angular 的表单控件（`FormControl`, `ngModel`）进行交互。需要实现以下方法：

- `writeValue(value: any): void`：这个方法会将父组件的表单值写入自定义控件。
- `registerOnChange(fn: any): void`：当自定义控件的值发生变化时，调用该方法通知父组件。
- `registerOnTouched(fn: any): void`：当控件被触摸时（比如失去焦点），会调用这个方法通知父组件。通常来说，将 `onBlur()` 事件会绑定到控件的 `blur` 事件上，并在 onBlur() 方法中调用它。。
- `setDisabledState(isDisabled: boolean): void`：用于设置控件的禁用状态。可以根据 `isDisabled` 值来禁用或启用自定义控件。

`writeValue` 和 `setDisabledState` 通常在父组件中调用 `CustomFormControl.setValue()` 和 `CustomFormControl.disable()` 方法时会执行。父组件初始化控件时也会执行，例如：

```typescript
this.myCustomCtrl = new FormControl({value: '', disabled: true});
```

实现 `ControlValueAccessor` 接口示例：
```typescript
import { Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-custom-input',
  template: `<input [value]="value" (input)="onInput($event)" />`,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR, // 注册到 Angular 表单系统
      useExisting: forwardRef(() => CustomInputComponent), // 指向当前组件
      multi: true // 表示可以有多个实现
    }
  ]
})
export class CustomInputComponent implements ControlValueAccessor {
  value: string = '';
  onChange: any = () => {};
  onTouched: any = () => {};

  // 实现 ControlValueAccessor 接口
  registerOnChange(fn: any): void {
    this.onChange = fn;
    
    // 也可以直接监听 valueChanges，并通知父组件
    // this.control.valueChanges.subscribe(fn); // 当 FormControl 的值变化时，调用回调  
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  writeValue(value: any): void {
    if (value !== undefined) {
      this.value = value;
    }
  }

  setDisabledState(isDisabled: boolean): void {
    // 可以在这里设置控件的禁用状态
  }

  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.value = input.value;
    this.onChange(this.value); // 通知 Angular 表单模型控件值已经变化
  }
}
```

## 实现 Validator 接口

`Validator` 接口用于添加自定义的验证逻辑。它定义了一个 `validate()` 方法，这个方法返回一个 `ValidationErrors` 对象，或者是 `null`（表示没有验证错误）。

`ValidationErrors` 是一个键值对对象，其中每个键表示一个错误类型，值表示错误的详细信息。

```typescript
import { AbstractControl, ValidationErrors, Validator } from '@angular/forms';

@Component({
  selector: 'app-custom-input',
  template: `<input [value]="value" (input)="onInput($event)" />`,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputComponent),
      multi: true
    }, 
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => CustomInputComponent),
      multi: true // 表示可以有多个验证器
    }      
  ]
})
export class CustomInputComponent implements ControlValueAccessor, Validator {
  // ControlValueAccessor 接口实现 ...

  // 实现 Validator 接口
  validate(control: AbstractControl): ValidationErrors | null {
    // 例如，验证输入值是否为数字
    const value = control.value;
    if (value && isNaN(value)) {
      return { 'invalidNumber': 'The value must be a number.' };
    }
    return null; // 返回 null 表示验证通过
  }
}

```

使用自定义表单控件：

```html
<form [formGroup]="myForm">
  <app-custom-input formControlName="customInput"></app-custom-input>
  <div *ngIf="myForm.get('customInput').hasError('invalidNumber')">
    Value must be a number!
  </div>
</form>
```

## NG_VALUE_ACCESSOR 和 NG_VALIDATORS

- `NG_VALUE_ACCESSOR`：`NG_VALUE_ACCESSOR` 令牌指向一个实现了 `ControlValueAccessor` 接口的组件，允许 Angular 在处理表单时使用该组件。
  - 表单绑定：`NG_VALUE_ACCESSOR` 让自定义控件能够与 Angular 表单控件（`FormControl`, `ngModel` 等）进行数据绑定。
  - 双向数据绑定：它允许自定义控件接收表单模型的数据，并将用户的输入传递回表单模型。
  - 自定义控件集成：通过实现 `ControlValueAccessor` 接口并提供 `NG_VALUE_ACCESSOR`，可以将自定义控件集成到 Angular 的表单框架中，享受 Angular 表单系统提供的功能（如验证、状态管理等）。
- `NG_VALIDATORS` 主要用于在表单控件上添加自定义的验证逻辑。可以将自定义验证器与 Angular 表单控件（如 `FormControl`, `ngModel`）一起使用。
