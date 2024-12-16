---
title: 组件生命周期
weight: 4
---

## 概述

生命周期钩子执行顺序：

1. `ngOnChanges`：当组件的**输入属性**（`@Input`）发生变化时会调用。
2. `ngOnInit`：当组件初始化时被调用。这通常在 Angular 初始化组件并绑定所有输入属性后触发。
3. `ngDoCheck`：在每次 Angular 检查组件变化时被调用。它比 `ngOnChanges` 更加底层，允许自定义检测逻辑。
4. `ngAfterContentInit`：当组件的**内容投影**（`<ng-content>`）初始化完成后触发。这个钩子在 Angular 投影内容进入组件后调用一次。
5. `ngAfterContentChecked`：当 Angular 完成对组件内容投影的变更检测后调用。
6. `ngAfterViewInit`：当组件的视图（包括子组件的视图）初始化完成后调用。也就是说，它在视图的所有子组件和模板内容都加载完毕后触发。
7. `ngAfterViewChecked`：每次视图（包括子视图）变更检测之后调用。它会在 Angular 每次更新视图之后触发。
8. `ngOnDestroy`：当组件销毁之前调用。可以用来执行清理工作，如取消订阅、清理定时器等。

## 挂载阶段

挂载阶段的生命周期函数**只在挂载阶段执行一次，数据更新时不再执行**。

1. `constructor`

   Angular 在实例化组件类时执行, 可以用来接收 Angular 注入的服务实例对象。

   ```javascript
   export class ChildComponent {
     constructor (private test: TestService) {
       console.log(this.test) // "test"
     }
   }
   ```

2. `ngOnInit`

   ngOnInit 会在组件的输入属性被绑定之后被调用，适合在组件加载时执行需要的初始化工作。

   ```html
   <app-child name="张三"></app-child>
   ```

   ```javascript
   export class ChildComponent implements OnInit {
     @Input("name") name: string = ""
     ngOnInit() {
       console.log(this.name) // "张三"
     }
   }
   ```

3. `ngAfterContentInit`

   组件的**内容投影**（`<ng-content>`）初始化完成后触发。这个钩子在 Angular 投影内容进入组件后调用一次。适用于当你需要在内容投影完成后执行某些操作时。

   ```html
   <app-child>
   	<div #box>Hello Angular</div>
   </app-child>
   ```

   ```javascript
   export class ChildComponent implements AfterContentInit {
     @ContentChild("box") box: ElementRef<HTMLDivElement> | undefined
   
     ngAfterContentInit() {
       console.log(this.box) // <div>Hello Angular</div>
     }
   }
   ```

4. `ngAfterViewInit`

   当组件的视图（包括子组件的视图）初始化完成后调用。也就是说，它在视图的所有子组件和模板内容都加载完毕后触发。适用于你需要在组件视图完全初始化之后执行某些操作的场景。

   ```html
   <!-- app-child 组件模板 -->
   <p #p>app-child works</p>
   ```

   ```javascript
   export class ChildComponent implements AfterViewInit {
     @ViewChild("p") p: ElementRef<HTMLParagraphElement> | undefined
     ngAfterViewInit () {
       console.log(this.p) // <p>app-child works</p>
     }
   }
   ```

## 更新阶段

1. `ngOnChanges`

    1. 当输入属性值发生变化时执行，**初始设置时也会执行一次**，顺序优于 `ngOnInit`。
    2. 不论多少输入属性同时变化，钩子函数只会执行一次，变化的值会同时存储在参数中。
    3. 参数接收一个 `SimpleChanges` 对象，包含了所有已变更的输入属性的**当前值**和**上一个值**。
    4. 对于**基本数据类型**来说, 只要值发生变化就可以被检测到。
    5. 对于**引用数据类型**来说, 可以检测从一个对象变成另一个对象（引用地址发生了改变）, 但是**检测不到同一个对象中属性值的变化**，但是不影响组件模板更新数据。

   **基本数据类型值变化**：

   ```html
   <app-child [name]="name" [age]="age"></app-child>
   <button (click)="change()">change</button>
   ```

   ```javascript
   export class AppComponent {
     name: string = "张三";
   	 age: number = 20
     change() {
       this.name = "李四"
       this.age = 30
     }
   }
   ```

   ```javascript
   export class ChildComponent implements OnChanges {
     @Input("name") name: string = ""
   	 @Input("age") age: number = 0
   
     ngOnChanges(changes: SimpleChanges) {
       console.log("基本数据类型值变化可以被检测到")
       if (changes['name']) {
         const currentValue = changes['name'].currentValue;
         const previousValue = changes['name'].previousValue;
         const firstChange = changes['name'].firstChange;

         console.log(`Name changed from ${previousValue} to ${currentValue}`);
         if (firstChange) {
           console.log('This is the first change');
         }
       }
     }
   
   }
   ```

   **引用数据类型变化**：

   ```html
   <app-child [person]="person"></app-child>
   <button (click)="change()">change</button>
   ```

   ```javascript
   export class AppComponent {
     person = { name: "张三", age: 20 }
     change() {
       this.person = { name: "李四", age: 30 }
     }
   }
   ```

   ```javascript
   export class ChildComponent implements OnChanges {
     @Input("person") person = { name: "", age: 0 }
   
     ngOnChanges(changes: SimpleChanges) {
       console.log("对于引用数据类型, 只能检测到引用地址发生变化, 对象属性变化不能被检测到")
     }
   }
   ```

2. `ngDoCheck`：在每次 Angular 检查组件变化时被调用。它比 `ngOnChanges` 更加底层，允许自定义检测逻辑。主要用于调试，只要输入属性发生变化，不论是基本数据类型还是引用数据类型还是引用数据类型中的属性变化，都会执行。

3. `ngAfterContentChecked`：当 Angular 完成对组件内容投影的变更检测后调用。适用于检测投影内容的变化。

4. `ngAfterViewChecked`：每次视图（包括子视图）变更检测之后调用。它会在 Angular 每次更新视图之后触发。用于在视图检查之后执行一些操作，如处理视图上的 DOM 操作。

## 卸载阶段

1. `ngOnDestroy`

   当组件被销毁之前调用, 用于清理操作。

   ```javascript
   export class HomeComponent implements OnDestroy {
     ngOnDestroy() {
       console.log("组件被卸载")
     }
   }
   ```
