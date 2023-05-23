# Form

## ControlValueAccessor 定义表单控件

在 Angular 中，不管你使用模板驱动表单还是响应式表单，总是会创建FormControl。如果你使用响应式表单，你需要显式创建 FormControl 对象，并
使用 formControl 或 formControlName 指令来绑定原生控件；如果你使用模板驱动表单，FormControl 对象会被 NgModel 指令隐式创建。

一个直观但不优雅的做法是在调用自定义控件时通过 `@Input` 传入一个表单数据 ，而控件内部写相应的逻辑对 Angular 表单进行操作。具体调用可能长成这样：

```html
<form [formGroup]="anyForm">                                
  <some-component [form]="anyForm"></some-component>      
  <another-component [form]="anyForm"></another-component>
</form>
```

但是为了让控件拥有 Angular 表单般的使用体验，希望直接通过 formControlName 来绑定数据：

```html
<form [formGroup]="anyForm">
  <some-component formControlName="cool" /></some-component>
  <another-component type="text" formControlName="coool"></another-component> 
</form>
```

ControlValueAccessor：这个对象桥接原生表单控件和 formControl 指令，并同步两者的值。

任何一个组件或指令都可以通过实现 `ControlValueAccessor` 接口并注册为 `NG_VALUE_ACCESSOR`，从而转变成 ControlValueAccessor 类型的对象，
这个接口还定义两个重要方法—— `writeValue` 和 `registerOnChange`。

```typescript
interface ControlValueAccessor {
  // 设置原生表单控件的值。数据流向 Angular form => Native form  
  writeValue(obj: any): void 
  // 注册 onChange 事件，在初始化时被调用，参数为事件触发函数。在 registerOnChange 中将该事件触
  // 函数保存起来，等到合适的时候（比如控件收到用户输入，需要作出响应时）调用该函数以触发事件。  
  // 数据流向 Native form => Angular form  
  registerOnChange(fn: any): void
  // 注册 onTouched 事件，即用户和控件交互时触发的回调函数。  
  // 数据流向 Native form => Angular form    
  registerOnTouched(fn: any): void
  // 当表单状态变为 DISABLED 或从 DISABLED 变更时，表单 API 会调用 setDisabledState() 方法，以启用或禁用对应的 DOM 元素。
  // 数据流向 Angular form => Native form
  setDisabledState(isDisabled: boolean)?: void
}
```

### 自定义表单控件实现

```typescript
import { Component, Input } from '@angular/core';
    
@Component({
    selector: 'app-counter',
    templateUrl: './counter.component.html',
    styleUrls: ['./counter.component.css'],
})
export class Counter {

    @Input() _count: number = 0;

    get count() {
        return this._count;
    }

    set count(value: number) {
        this._count = value;
        this.propagateOnChange(this._count);
    }
    
    ngOnInit() {}

    increment() {
        this.count++;
    }

    decrement() {
        this.count--;
    }

    writeValue(value: any) {
        if (value) {
            this.count = value;
        }
    }

    propagateOnChange: (value: any) => void = (_: any) => {};
    propagateOnTouched: (value: any) => void = (_: any) => {};

    registerOnChange(fn: any) {
        this.propagateOnChange = fn;
    }

    registerOnTouched(fn: any) {
        this.propagateOnTouched = fn;
    }
}
```

注册 `NG_VALUE_ACCESSOR` 提供者：

实现 ControlValueAccessor 接口之后，还需要执行注册操作。

`NG_VALUE_ACCESSOR` 提供者用来指定实现了 ControlValueAccessor 接口的类，并且被 Angular 用来和 formControl 同步，通常是使用控件类或指令来注册。
所有表单指令都是使用 `NG_VALUE_ACCESSOR` 标识来注入控件值访问器，然后选择合适的访问器。
`NG_VALIDATORS`：将控件注册成为一个可以让表单得到其验证状态的控件，`NG_VALIDATORS` 的 token 类型为 function 或 Validator，配合 `useExisting`，
可以让控件只暴露对应的 function 或 Validator 的 validate 方法。针对 token 为 Validator 类型来说，控件实现了validate 方法就可以实现表单控件验证
`forwardRef`：向前引用，允许我们引用一个尚未定义的对象
`multi`：设为 true，表示这个 token 对应多个依赖项，使用相同的 token 去获取依赖项的时候，获取的是已注册的依赖对象列表。如果不设置 multi 为 true，
那么对于相同 token 的提供商来说，后定义的提供商会覆盖前面已定义的提供商

```typescript
export const EXE_COUNTER_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => Counter),
    multi: true
};

// optional
export const validateCounterRange: ValidatorFn = (control: AbstractControl):
    ValidationErrors => {
    return (control.value > 10 || control.value < 0) ?
        { 'rangeError': { current: control.value, max: 10, min: 0 } } : null;
};
// optional
export const EXE_COUNTER_VALIDATOR = {
    provide: NG_VALIDATORS,
    useValue: validateCounterRange,
    multi: true
};
```

配置控件 providers 信息：

```typescript
@Component({
  ...
  providers: [EXE_COUNTER_VALUE_ACCESSOR, EXE_COUNTER_VALIDATOR],
  ...
})
export class Counter implements ControlValueAccessor {
  ...
}
```

响应式表单中使用：

```html
<ng-container>
    <p>counter 控件测试</p>
    <form [formGroup]="helloForm">
        <app-counter formControlName="counter"></app-counter>
    </form>
</ng-container>
```

```typescript
import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-hello-page',
  templateUrl: './hello.component.html',
  styleUrls: ['./hello.component.css'],
})
export class HelloPageComponent implements OnInit {
    helloForm: FormGroup;

    constructor(private fb: FormBuilder) { }
    
    ngOnInit() {
        this.helloForm = this.fb.group({
            counter: 5 // 设置初始值
        });
    }
}
```

## valueChanges 和 statusChanges

### valueChanges

`valueChanges` 是 `AbstractControl` 的一个属性，**当控件的值发生变化时，它就会发出一个事件**（例如 `setValue`）。`valueChanges` 属性在 `FormControl`、
`FormArray` 和 `FormGroup` 类中可用，因为它们继承了 `AbstractControl` 类。

`valueChanges` 返回一个 `Observable`，我们可以订阅它。

1. 如果我们订阅一个 `FormControl` 实例的 `valueChanges`，只要有任何变化，我们就会得到该控件的最新值。
2. 如果我们订阅一个 `FormArray` 实例的 `valueChanges`，只要有任何变化，我们就会得到这些数组控件的最新值。
3. 如果我们订阅 `FormGroup` 实例的 `valueChanges`，每当表单中的任何控件发生变化时，我们就会得到表单控件的最新值。

### statusChanges

`statusChanges` 是 `AbstractControl` 的一个属性，在每次重新计算控件的验证状态时都会发出一个事件（例如 `setErrors`）。 `statusChanges` 属性在 `FormControl`、
`FormArray` 和 `FormGroup` 类中可用，因为它们继承了 `AbstractControl` 类。

`statusChanges` 返回一个 `Observable`，我们可以订阅它。

1. 如果我们订阅 `FormControl` 实例的 `statusChanges`，每当该控件的验证状态被重新计算时，我们就会得到该控件的最新验证状态。
2. 如果我们订阅 `FormArray` 实例的 `statusChanges`，每当这些数组控件的验证状态被重新计算时，我们会得到这些数组控件的最新验证状态。
3. 如果我们订阅 `FormGroup` 实例的 `statusChanges`，每当表单的任何控件的验证状态被重新计算时，我们就会得到表单控件的最新验证状态。

### updateValueAndValidity

`FormControl.setValue()` 函数，内部会调用 `updateValueAndValidity`，重新计算表单控件的值和验证状态等。
