---
title: 表单
weight: 9
---

## 概述

在 Angular 中，表单有两种类型，分别为**模板驱动表单**和**响应式表单**。

## 模板驱动表单

### 概述

表单的控制逻辑写在组件模板中，适合简单的表单类型。

### 快速上手

1. 引入依赖模块 FormsModule

   ```typescript
   import { FormsModule } from "@angular/forms"
   
   @NgModule({
     imports: [FormsModule],
   })
   export class AppModule {}
   ```

2. 将 DOM 表单转换为 `ngForm`

   ```html
   <form #f="ngForm" (submit)="onSubmit(f)"></form>
   ```

3. 声明表单字段为 `ngModel`

   ```html
   <form #f="ngForm" (submit)="onSubmit(f)">
     <input type="text" name="username" ngModel />
     <button>提交</button>
   </form>
   ```

4. 获取表单字段值

   ```typescript
   import { NgForm } from "@angular/forms"
   
   export class AppComponent {
     onSubmit(form: NgForm) {
       console.log(form.value)
     }
   }
   ```

5. 表单分组

   当你的表单的表单项比较多，可以把相关的表单项分组。
   
   ```html
   <form #f="ngForm" (submit)="onSubmit(f)">
     <div ngModelGroup="user">
       <input type="text" name="username" ngModel />
     </div>
     <div ngModelGroup="contact">
       <input type="text" name="phone" ngModel />
     </div>
     <button>提交</button>
   </form>
   ```
   分组后，访问表单数据，例如 `username`，就是 `form.user.username`。

### 表单验证

- `required` 必填字段
- `minlength` 字段最小长度
- `maxlength` 字段最大长度
- `pattern` 验证正则 例如：`pattern="\d"` 匹配一个数值

```html
<form #f="ngForm" (submit)="onSubmit(f)">
  <input type="text" name="username" ngModel required pattern="\d" />
  <button>提交</button>
</form>
```

```typescript
export class AppComponent {
  onSubmit(form: NgForm) {
    // 查看表单整体是否验证通过
    console.log(form.valid)
  }
}
```

```html
<!-- 表单整体未通过验证时禁用提交表单 -->
<button type="submit" [disabled]="f.invalid">提交</button>
```

在组件模板中显示表单项未通过时的错误信息。

```html
<form #f="ngForm" (submit)="onSubmit(f)">
  <input #username="ngModel" />
  <!-- touched 为 true 表示用户操作过该表单项  -->
  <div *ngIf="username.touched && !username.valid && username.errors">
    <div *ngIf="username.errors.required">请填写用户名</div>
    <div *ngIf="username.errors.pattern">不符合正则规则</div>
  </div>
</form>
```

`dirty` 和 `touched` 都可以用来判断表单控件是否被用户操作过：

- `dirty`：如果用户修改了表单控件的值，则该控件的 `dirty` 状态会被设置为 `true`。如果控件的值没有被修改，`dirty` 状态为 `false`。
- `touched`：如果控件失去焦点（即用户点击过该控件并离开），则控件的 `touched` 状态会被设置为 `true`。

指定表单项未通过验证时的样式。

```css
input.ng-touched.ng-invalid {
  border: 2px solid red;
}
```

## 响应式表单

### 概述

表单的控制逻辑写在组件类中，对验证逻辑拥有更多的控制权，适合复杂的表单的类型。

在响应式表单中，表单字段需要是 `FormControl` 类的实例，实例对象可以验证表单字段中的值，值是否被修改过等等。

![form-control](https://github.com/shipengqi/illustrations/blob/e8def83ca9a8a06a545b68d99f871e1b32f15a34/frontend-learn/angular/form-control.jpg?raw=true)

一组表单字段构成整个表单，整个表单需要是 `FormGroup` 类的实例，它可以对表单进行整体验证。

![form-group](https://github.com/shipengqi/illustrations/blob/e8def83ca9a8a06a545b68d99f871e1b32f15a34/frontend-learn/angular/form-group.jpg?raw=true)

1. `FormControl`：表单组中的一个表单项
2. `FormGroup`：表单组，表单至少是一个 `FormGroup`
3. `FormArray`：用于复杂表单，可以动态添加表单项或表单组，在表单验证时，`FormArray` 中有一项没通过，那么整体就不会通过。

### 快速上手

1. 引入 `ReactiveFormsModule`

   ```typescript
   import { ReactiveFormsModule } from "@angular/forms"
   
   @NgModule({
     imports: [ReactiveFormsModule]
   })
   export class AppModule {}
   ```

2. 在组件类中创建 `FormGroup` 表单控制对象

   ```typescript
   import { FormControl, FormGroup } from "@angular/forms"
   
   export class AppComponent {
     contactForm: FormGroup = new FormGroup({
       name: new FormControl(),
       phone: new FormControl()
     })
   }
   ```

3. 使用 `formGroup` 来绑定一组表单控件，使用 `formControlName` 来绑定每个表单控件。

   ```html
   <form [formGroup]="contactForm" (submit)="onSubmit()">
     <input type="text" formControlName="name" />
     <input type="text" formControlName="phone" />
     <button>提交</button>
   </form>
   ```

4. 获取表单值

   ```typescript
   export class AppComponent {
     onSubmit() {
       console.log(this.contactForm.value)
     }
   }
   ```

5. 设置表单默认值

   ```typescript
   contactForm: FormGroup = new FormGroup({
     name: new FormControl("默认值"),
     phone: new FormControl(15888888888)
   })
   ```

6. 表单分组

   ```typescript
   contactForm: FormGroup = new FormGroup({
     fullName: new FormGroup({
       firstName: new FormControl(),
       lastName: new FormControl()
     }),
     phone: new FormControl()
   })
   ```

   ```html
   <form [formGroup]="contactForm" (submit)="onSubmit()">
     <div formGroupName="fullName">
       <input type="text" formControlName="firstName" />
       <input type="text" formControlName="lastName" />
     </div>
     <input type="text" formControlName="phone" />
     <button>提交</button>
   </form>
   ```

   ```typescript
   onSubmit() {
     // 下面两种方式都可以获取到表单项的值
     console.log(this.contactForm.value.name.username)
     console.log(this.contactForm.get(["name", "username"])?.value)
   }
   ```

- `formControl` 指令用于将一个**单独的** `FormControl` 实例绑定到模板中的表单控件。通常在没有 FormGroup 的情况下使用，适合单独处理一个控件，而不需要嵌套在表单组中。
   
   ```html
   <input [formControl]="nameControl" />
   ```
   ```typescript
   import { Component } from '@angular/core';
   import { FormControl } from '@angular/forms';
   
   @Component({
     selector: 'app-my-form',
     templateUrl: './my-form.component.html',
   })
   export class MyFormComponent {
     nameControl = new FormControl('');  // 创建 FormControl 实例
   }
   ```
  
- `formControlName` 指令用于将一个` FormControl` 实例绑定到 `FormGroup` 中的表单控件。这个指令只能用于**响应式表单**（ReactiveForms），并且**必须与 `FormGroup` 一起使用**。
   
   ```html
   <form [formGroup]="form">
     <input formControlName="name" />
   </form>
   ```
   ```typescript
   import { Component } from '@angular/core';
   import { FormControl, FormGroup } from '@angular/forms';
   
   @Component({
     selector: 'app-my-form',
     templateUrl: './my-form.component.html',
   })
   export class MyFormComponent {
     form = new FormGroup({
       name: new FormControl(''),  // 将 'name' 字段添加到 FormGroup 中
     });
   }
   ```

### FormArray

`FormArray` 是一种特殊类型的 `FormGroup`，用于管理一组表单控件，通常用于处理动态数量的控件，它允许你动态地添加、移除或更新表单控件。例如，当你需要让用户添加多个相似项（如动态添加多个电子邮件地址、电话号码、或者一组购物车项目）时，`FormArray` 是理想的选择。

例如实现一个表单，允许用户输入多个电子邮件地址：

```typescript
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

@Component({
   selector: 'app-dynamic-form',
   templateUrl: './dynamic-form.component.html'
})
export class DynamicFormComponent implements OnInit {
   emailForm: FormGroup;

   constructor(private fb: FormBuilder) {}

   ngOnInit(): void {
      this.emailForm = this.fb.group({
         emails: this.fb.array([this.createEmailControl()])
      });
   }

   // 创建单个电子邮件控件
   createEmailControl(): FormGroup {
      return this.fb.group({
         email: ['', [Validators.required, Validators.email]]
      });
   }

   // 获取 FormArray
   get emailControls(): FormArray {
      return this.emailForm.get('emails') as FormArray;
   }

   // 添加新的电子邮件控件
   addEmail() {
      this.emailControls.push(this.createEmailControl());
   }

   // 删除指定索引的电子邮件控件
   removeEmail(index: number) {
      this.emailControls.removeAt(index);
   }

   // 提交表单数据
   onSubmit() {
      if (this.emailForm.valid) {
         console.log(this.emailForm.value);
      } else {
         console.log('Form is invalid');
      }
   }
}

```

`emailForm` 是一个包含 `emails` 的表单组，`emails` 是一个 `FormArray`。
`createEmailControl()` 是一个方法，用来创建一个带有电子邮件验证的 `FormGroup`。
`emailControls` 是一个 `getter`，用来获取 `FormArray`。
`addEmail()` 方法用于动态添加新的电子邮件控件到 `FormArray`。
`removeEmail(index)` 方法用于删除指定索引的控件。

```html
<form [formGroup]="emailForm" (ngSubmit)="onSubmit()">
   <div formArrayName="emails">
      <div *ngFor="let email of emailControls.controls; let i = index" [formGroupName]="i">
         <label for="email{{ i }}">Email {{ i + 1 }}:</label>
         <input id="email{{ i }}" formControlName="email" />

         <button type="button" (click)="removeEmail(i)">Remove</button>

         <div *ngIf="email.get('email').invalid && email.get('email').touched">
            <small *ngIf="email.get('email').hasError('required')">Email is required.</small>
            <small *ngIf="email.get('email').hasError('email')">Invalid email format.</small>
         </div>
      </div>
   </div>

   <button type="button" (click)="addEmail()">Add Email</button>
   <button type="submit" [disabled]="emailForm.invalid">Submit</button>
</form>

```

- `formArrayName="emails"`：将 `FormArray` 与模板中的对应部分绑定。
- `*ngFor`：遍历 `FormArray` 中的每个表单控件。
- `formControlName="email"`：为每个表单控件（电子邮件输入框）绑定一个 `FormControl`。
- `addEmail()`：点击 "Add Email" 按钮时，调用 `addEmail()` 方法来向表单中添加一个新的电子邮件输入框。
- `removeEmail(i)`：点击 "Remove" 按钮时，调用 `removeEmail()` 方法来从表单中删除指定的电子邮件输入框。

### 内置表单验证器

1. 使用内置验证器提供的验证规则验证表单字段

   ```typescript
   import { FormControl, FormGroup, Validators } from "@angular/forms"
   
   contactForm: FormGroup = new FormGroup({
     name: new FormControl("默认值", [
       Validators.required,
       Validators.minLength(2)
     ])
   })
   ```

2. 获取整体表单是否验证通过

   ```typescript
   onSubmit() {
     console.log(this.contactForm.valid)
   }
   ```

   ```html
   <!-- 表单整体未验证通过时禁用表单按钮 -->
   <button [disabled]="contactForm.invalid">提交</button>
   ```

3. 在组件模板中显示为验证通过时的错误信息

   ```typescript
   get name() {
     return this.contactForm.get("name")!
   }
   ```

   ```html
   <form [formGroup]="contactForm" (submit)="onSubmit()">
     <input type="text" formControlName="name" />
     <div *ngIf="name.touched && name.invalid && name.errors">
       <div *ngIf="name.errors.required">请填写姓名</div>
       <div *ngIf="name.errors.maxlength">
         姓名长度不能大于
         {{ name.errors.maxlength.requiredLength }} 实际填写长度为
         {{ name.errors.maxlength.actualLength }}
       </div>
     </div>
   </form>
   ```

### 自定义同步表单验证器

1. 自定义验证器的类型是 TypeScript 类
2. 类中包含具体的验证方法，验证方法必须为静态方法
3. 验证方法有一个参数 control，类型为 `AbstractControl`。其实就是 `FormControl` 类的实例对象的类型
4. 如果验证成功，返回 `null`
5. 如果验证失败，返回对象，对象中的属性即为验证标识，值为 `true`，标识该项验证失败
6. 验证方法的返回值为 `ValidationErrors | null`

```typescript
import { AbstractControl, ValidationErrors } from "@angular/forms"

export class NameValidators {
  // 字段值中不能包含空格
  static cannotContainSpace(control: AbstractControl): ValidationErrors | null {
    // 验证未通过
    if (/\s/.test(control.value)) return { cannotContainSpace: true }
    // 验证通过
    return null
  }
}
```

```typescript
import { NameValidators } from "./Name.validators"

contactForm: FormGroup = new FormGroup({
  name: new FormControl("", [
    Validators.required,
    NameValidators.cannotContainSpace
  ])
})
```

```html
<div *ngIf="name.touched && name.invalid && name.errors">
	<div *ngIf="name.errors.cannotContainSpace">姓名中不能包含空格</div>
</div>
```

### 自定义异步表单验证器

异步验证器函数：

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { debounceTime, map, catchError, switchMap, take } from 'rxjs/operators';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';

@Injectable({
   providedIn: 'root'
})
export class EmailValidatorService {
   constructor(private http: HttpClient) {}

   // 异步验证器：检查邮箱是否已注册
   emailExistsValidator(): AsyncValidatorFn {
      return (control: AbstractControl): Observable<ValidationErrors | null> => {
         if (!control.value) {
            return of(null); // 如果控件值为空，不做验证
         }

         // 返回 Observable，模拟 HTTP 请求
         return this.http.get<any>(`/api/check-email?email=${control.value}`).pipe(
                 debounceTime(500), // 防止发送过多请求
                 map(response => {
                    // 假设 response 存在 `exists` 字段，表示邮箱是否已经存在
                    return response.exists ? { emailExists: true } : null;
                 }),
                 catchError(() => of(null)) // 如果发生错误（如网络请求失败），返回 null
         );
      };
   }
}

```

- `AsyncValidatorFn`：这是异步验证器的类型，它返回一个 `Observable` 或 `Promise`，并且必须解析为 `ValidationErrors`（验证失败时）或 `null`（验证通过）。
- `debounceTime`：这是防止发送过多请求的技巧，尤其是在用户输入过程中。通常，在输入停止一段时间后再发起验证请求。
- `catchError`：如果网络请求失败或出现错误，返回 `null` 表示验证成功。

在组件中使用异步验证器：

```typescript
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmailValidatorService } from './email-validator.service';

@Component({
   selector: 'app-user-form',
   templateUrl: './user-form.component.html'
})
export class UserFormComponent implements OnInit {
   userForm: FormGroup;

   constructor(
     private fb: FormBuilder,
     private emailValidator: EmailValidatorService
   ) {}

   ngOnInit(): void {
      this.userForm = this.fb.group({
         email: [
            '',
            [Validators.required, Validators.email],
            [this.emailValidator.emailExistsValidator()]
         ]
      });
   }

   onSubmit(): void {
      if (this.userForm.valid) {
         console.log(this.userForm.value);
      } else {
         console.log('Form is invalid');
      }
   }
}

```

- `emailExistsValidator()`：这是在 `EmailValidatorService` 中定义的异步验证器，用于验证用户输入的电子邮件地址是否已存在。
- `[this.emailValidator.emailExistsValidator()]`：将异步验证器作为第三个参数传递给 `FormControl`，它会在表单控件的值变化时触发。
- `FormControl` 的验证顺序：`Validators.required` 和 `Validators.email` 是同步验证器，而 `emailExistsValidator()` 是异步验证器。

模板代码：

```html
<form [formGroup]="userForm" (ngSubmit)="onSubmit()">
   <div>
      <label for="email">Email:</label>
      <input id="email" formControlName="email" />

      <!-- 错误消息 -->
      <div *ngIf="userForm.get('email').hasError('required') && userForm.get('email').touched">
         Email is required.
      </div>
      <div *ngIf="userForm.get('email').hasError('email') && userForm.get('email').touched">
         Invalid email format.
      </div>
      <div *ngIf="userForm.get('email').hasError('emailExists') && userForm.get('email').touched">
         This email address is already registered.
      </div>
   </div>

   <button type="submit" [disabled]="userForm.invalid">Submit</button>
</form>

```

### FormBuilder

`FormBuilder` 是一个辅助工具，用于简化和减少 `FormControl` 和 `FormGroup` 的冗长创建过程，特别是在需要创建大量表单控件时。通过 `FormBuilder`，可以更简洁、更易读地构建表单。

1. `this.fb.control`：表单项
2. `this.fb.group`：表单组，表单至少是一个 `FormGroup`
3. `this.fb.array`：用于复杂表单，可以动态添加表单项或表单组，在表单验证时，`FormArray` 中有一项没通过，那么整体就不会通过。

```typescript
this.form = this.fb.group({
   name: ['', Validators.required],
   email: ['', [Validators.required, Validators.email]],
});
```

### 其他

#### setValue

用于将**整个表单控件**的值设置为一个新的值。如果你使用 `setValue`，必须提供一个完整的对象，该对象必须包含所有控件的值，且顺序和控件名必须与原始表单控件匹配。

```typescript
formGroup.setValue(value: { [key: string]: any }, options?: { onlySelf?: boolean, emitEvent?: boolean })
```

- `value`：一个包含所有控件的值的对象，必须包含表单中所有控件的值。
- `onlySelf`（可选）：如果为 `true`，则只会更新当前控件的值，不会影响父表单。
- `emitEvent`（可选）：如果为 `false`，则不会触发控件的 `valueChanges` 事件。

#### patchValue

`patchValue` 方法与 `setValue` 类似，也用于更新表单控件的值。但是，`patchValue` 允许**部分更新**表单控件的值。你只需要提供你希望更新的控件的值，而不必提供整个表单控件的值。这对于动态表单或者只需更新部分控件的场景非常有用。

```typescript
formGroup.patchValue(value: { [key: string]: any }, options?: { onlySelf?: boolean, emitEvent?: boolean })
```

- `value`：一个包含部分控件值的对象，更新该对象中的字段，不需要提供所有控件的值。
- `onlySelf`（可选）：如果为 `true`，则只会更新当前控件的值，不会影响父表单。
- `emitEvent`（可选）：如果为 `false`，则不会触发控件的 `valueChanges` 事件。

#### reset

方法用于将表单恢复到初始状态。可以通过它将控件值重置为初始值，并恢复表单的有效性。


#### valid、invalid

这两个属性用来检查表单是否有效。`valid` 返回 `true` 如果表单是有效的，`invalid` 返回 `true` 如果表单是无效的。

#### dirty、pristine

- `dirty`：如果控件的值已经被修改，则返回 `true`，否则返回 `false`。
- `pristine`：与 `dirty` 相反，如果控件的值从未被修改过，则返回` true`。

#### touched、untouched

- `touched`：如果控件已经被触摸（即用户离开了该控件），则返回 `true`。
- `untouched`：如果控件未被触摸，则返回 `true`。

#### markAsTouched()、markAsUntouched()

- `markAsTouched()`：将所有控件标记为已触摸。
- `markAsUntouched()`：将所有控件标记为未触摸。

#### markAsDirty()、markAsPristine()

- `markAsDirty()`：将所有控件标记为已修改。
- `markAsPristine()`：将所有控件标记为未修改。

#### enable()、disable()

- `enable()`：启用表单控件。
- `disable()`：禁用表单控件。

#### hasError()

`hasError()` 用于检查控件是否存在特定的验证错误。

```typescript
if (this.formGroup.get('email').hasError('required')) {
  console.log('Email is required');
}
```

#### setErrors()

`setErrors()` 将控件设置错误，并且可以指定一个错误对象。

```typescript
formGroup.setErrors(errors: ValidationErrors | null, options?: { emitEvent?: boolean }): void
```

- `errors`：一个包含错误信息的对象，或者为 `null`，表示清除所有错误。`ValidationErrors` 是一个键值对对象，键是错误的名称，值是错误的描述信息。
- `options.emitEvent`（可选）：一个布尔值，表示是否触发 `statusChanges` 和 `valueChanges` 事件。默认为 `true`，即触发事件。

```typescript
this.formGroup.setErrors({
  invalidForm: 'The form is invalid'
});
```

#### valueChanges、statusChanges

- `valueChanges`：当表单控件的值发生变化时（例如 `setValue()`），会触发该 `Observable`。
- `statusChanges`：当表单控件的状态发生变化时（例如从 `valid` 到 `invalid`，或者调用 `setErrors()`），会触发该 `Observable`。

```typescript
this.formGroup.valueChanges.subscribe(value => {
  console.log('Form value changed:', value);
});

this.formGroup.statusChanges.subscribe(status => {
  console.log('Form status changed:', status);
});
```

#### updateValueAndValidity

用于**更新表单控件的值和有效性**。它会触发控件的验证过程，重新评估控件的值是否有效，并更新控件的验证状态（如 `valid、invalid、pending、touched` 等）。

这个方法在你手动修改控件的值或验证器时特别有用，确保控件的状态得到重新评估。

```typescript
formControl.updateValueAndValidity(options?: { onlySelf?: boolean, emitEvent?: boolean }): void
```

- `onlySelf`（可选）：如果为 `true`，仅会更新当前控件，而不会影响父表单。默认为 `false`，即更新当前控件及其父控件。
- `emitEvent`（可选）：如果为 `false`，则不会触发 `valueChanges` 或 `statusChanges` 事件。默认为 `true`，即会触发这些事件。
