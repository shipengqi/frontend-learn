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

## 组件交互

### 从父组件传到子组件
从父组件传到子组件：`@Input()`

### 通过 setter 监听输入属性的变化。

```typescript
@Component({
  selector: 'app-name-child',
  template: '<h3>"{{name}}"</h3>'
})
export class NameChildComponent {
@Input()
  get name(): string { return this._name; }
  set name(name: string) {
    this._name = (name && name.trim()) || '<no name set>';
  }
  private _name = '';
}
```

### 通过 `ngOnChanges()` 监听输入属性值的变化。

组件实现 `OnChanges` 生命周期钩子接口的 `ngOnChanges()` 方法来监听输入属性值的变化并做出回应。
```typescript
export class VersionChildComponent implements OnChanges {
  @Input() major = 0;
  @Input() minor = 0;
  changeLog: string[] = [];

  ngOnChanges(changes: SimpleChanges) {
    const log: string[] = [];
    for (const propName in changes) {
      const changedProp = changes[propName];
      const to = JSON.stringify(changedProp.currentValue);
      if (changedProp.isFirstChange()) {
        log.push(`Initial value of ${propName} set to ${to}`);
      } else {
        const from = JSON.stringify(changedProp.previousValue);
        log.push(`${propName} changed from ${from} to ${to}`);
      }
    }
    this.changeLog.push(log.join(', '));
  }
}
```

### 父组件监听子组件的事件：`@Output()`

父组件监听子组件的事件：`@Output()`
```typescript
export class VoterComponent {
  @Input()  name = '';
  @Output() voted = new EventEmitter<boolean>();


  vote(agreed: boolean) {
    this.voted.emit(agreed);
  }
}
```

### 父组件与子组件通过本地变量互动

父组件不能使用数据绑定来读取子组件的属性或调用子组件的方法。但可以在父组件模板里，新建一个本地变量来代表子组件，然后利用这个变量来读取子组件的属性和调用子组件的方法：

子组件 `CountdownTimerComponent`：
```typescript
@Component({
  selector: 'app-countdown-timer',
  template: '<p>{{message}}</p>'
})
export class CountdownTimerComponent implements OnDestroy {
  
  intervalId = 0;
  message = '';
  seconds = 11;

  ngOnDestroy() { this.clearTimer(); }

  start() { this.countDown(); }
  stop()  {
    this.clearTimer();
    this.message = `Holding at T-${this.seconds} seconds`;
  }

  private clearTimer() { clearInterval(this.intervalId); }
  private countDown() { 
    // ... 
  }
}
```

父组件 `CountdownLocalVarParentComponent`：

```typescript
@Component({
  selector: 'app-countdown-parent-lv',
  template: `
    <h3>Countdown to Liftoff (via local variable)</h3>
    <button type="button" (click)="timer.start()">Start</button>
    <button type="button" (click)="timer.stop()">Stop</button>
    <div class="seconds">{{timer.seconds}}</div>
    <app-countdown-timer #timer></app-countdown-timer>
  `,
  styleUrls: ['../assets/demo.css']
})
export class CountdownLocalVarParentComponent { }
```

父组件不能通过数据绑定使用子组件的 `start` 和 `stop` 方法，也不能访问子组件的 `seconds` 属性。把本地变量(`#timer`)放到(`<countdown-timer>`)标签中，
用来代表子组件。这样父组件的模板就得到了子组件的引用，可以在父组件的模板中访问子组件的属性和方法。

### 父级调用 `@ViewChild()`

父组件与子组件通过**本地变量**互动的方法简单明了，但是也有局限：由于父组件-子组件的连接必须全部在**父组件的模板中**进行。父组件本身的代码对子组件没有访问权。

当父组件类需要这种访问时，可以把子组件作为 `ViewChild`，注入到父组件里面。修改上面本地变量的示例：

父组件 `CountdownViewChildParentComponent`:
```typescript
@Component({
  selector: 'app-countdown-parent-vc',
  template: `
    <h3>Countdown to Liftoff (via ViewChild)</h3>
    <button type="button" (click)="start()">Start</button>
    <button type="button" (click)="stop()">Stop</button>
    <div class="seconds">{{ seconds() }}</div>
    <app-countdown-timer></app-countdown-timer>
  `,
  styleUrls: ['../assets/demo.css']
})
export class CountdownViewChildParentComponent implements AfterViewInit {

  @ViewChild(CountdownTimerComponent)
  private timerComponent!: CountdownTimerComponent;

  seconds() { return 0; }

  ngAfterViewInit() {
    // Redefine `seconds()` to get from the `CountdownTimerComponent.seconds` ...
    // but wait a tick first to avoid one-time devMode
    // unidirectional-data-flow-violation error
    setTimeout(() => this.seconds = () => this.timerComponent.seconds, 0);
  }

  start() { this.timerComponent.start(); }
  stop() { this.timerComponent.stop(); }
}
```

生命周期钩子 `AfterViewInit` 接口的 `ngAfterViewInit` 必须实现。被注入的子组件只有在 Angular 显示了父组件视图之后才能访问，所以它先把秒数显示为 `0`。

装饰器 `@ViewChild` 将子组件 `CountdownTimerComponent` 注入到私有属性 `timerComponent` 里面。`#timer` 本地变量就可以删掉了。

### 父组件和子组件通过 service 来通讯

父组件和它的子组件共享同一个服务，利用该服务在组件家族内部实现双向通讯。

该服务实例的作用域被限制在父组件和其子组件内。这个组件子树之外的组件将无法访问该服务或者与它们通讯。

这个 `MissionService` 把 `MissionControlComponent` 和多个 `AstronautComponent` 子组件连接起来。

```typescript
@Injectable()
export class MissionService {

  // Observable string sources
  private missionAnnouncedSource = new Subject<string>();
  private missionConfirmedSource = new Subject<string>();

  // Observable string streams
  missionAnnounced$ = this.missionAnnouncedSource.asObservable();
  missionConfirmed$ = this.missionConfirmedSource.asObservable();

  // Service message commands
  announceMission(mission: string) {
    this.missionAnnouncedSource.next(mission);
  }

  confirmMission(astronaut: string) {
    this.missionConfirmedSource.next(astronaut);
  }
}
```

`MissionControlComponent` 提供服务的实例，并将其共享给它的子组件(通过 `providers` 元数据数组)，子组件可以通过构造函数将该实例注入到自身。

```typescript
import { Component } from '@angular/core';

import { MissionService } from './mission.service';

@Component({
  selector: 'app-mission-control',
  template: `
    <h2>Mission Control</h2>
    <button type="button" (click)="announce()">Announce mission</button>

    <app-astronaut
      *ngFor="let astronaut of astronauts"
      [astronaut]="astronaut">
    </app-astronaut>
  `,
  providers: [MissionService]
})
export class MissionControlComponent {
  astronauts = ['Lovell', 'Swigert', 'Haise'];
  history: string[] = [];
  missions = ['Fly to the moon!',
              'Fly to mars!',
              'Fly to Vegas!'];
  nextMission = 0;

  constructor(private missionService: MissionService) {
    missionService.missionConfirmed$.subscribe(
      astronaut => {
        this.history.push(`${astronaut} confirmed the mission`);
      });
  }

  announce() {
    const mission = this.missions[this.nextMission++];
    this.missionService.announceMission(mission);
    this.history.push(`Mission "${mission}" announced`);
    if (this.nextMission >= this.missions.length) { this.nextMission = 0; }
  }
}
```

由于每个 `AstronautComponent` 都是 `MissionControlComponent` 的子组件，所以它们获取到的也是父组件的这个服务实例。

```typescript
@Component({
  selector: 'app-astronaut',
  template: `
    <p>
      {{astronaut}}: <strong>{{mission}}</strong>
    </p>
  `
})
export class AstronautComponent implements OnDestroy {
  @Input() astronaut = '';
  mission = '<no mission announced>';
  confirmed = false;
  announced = false;
  subscription: Subscription;

  constructor(private missionService: MissionService) {
    this.subscription = missionService.missionAnnounced$.subscribe(
      mission => {
        this.mission = mission;
        this.announced = true;
        this.confirmed = false;
    });
  }

  confirm() {
    this.confirmed = true;
    this.missionService.confirmMission(this.astronaut);
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.subscription.unsubscribe();
  }
}
```
## 组件之间的样式

Angular 每个组件都有自己的样式，但是每个组件的样式最终都会打包到一起，那么，组件之间的样式是否会相互影响？

Angular 给每个组件的元素动态的加上独有的属性，然后给这个组件的选择器后面也动态的加上这个独有属性选择器，而每个组件的动态属性都不一样，这样选择器
就只会选到自己组件的 Dom 元素，从而防止组件的样式污染，让它们互不影响。


### `:host`

`:host` 是让 css 选择器只选择自己组件的 Dom

保证 css 选择器只能作用于自己的组件

### `::ng-deep`

加了 `::ng-deep` 后，选择器后面的属性选择器没了，这样就是导致这个样式可以影响到别的组件


### `:host` 和 `::ng-deep`

在一些使用了第三方组件，又想修改第三方组件里元素的样式时, 或者是项目里的通用组件，想在某个使用它的组件里单独修改它的样式，而不影响别的组件

`:host` 和 `::ng-deep` 配合使用 

```css
:host ::ng-deep .modal-dialog {
  margin-top: 10%;
}
```

`:host` 在前面加了个本组件的动态属性的属性选择器，确保样式只生效于本组件和他的子组件，`::ng-deep` 把选择器后面的属性选择器去掉了，这样就能作用别的组件了。

组合在一起就是只有本组件和本组件的子组件里的 `div` 才能被选择到, 这样既能控制范围，又能影响到子组件

### `:host-context`

需要满足某条件才能应用样式。它在当前组件宿主元素的祖先节点中查找 CSS 类，直到文档的根节点为止。如果找到，才会应用后面的样式到本组件内部元素。


### 外部以及全局样式文件
当使用 CLI 进行构建时，必须配置 `angular.json` 文件，使其包含所有外部资源（包括外部的样式表文件）。

在它的 `styles` 区注册这些全局样式文件，默认情况下，它会有一个预先配置的全局 `styles.css` 文件。

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

在这种情况下，**不建议使用 `<ng-content>` 元素，因为只要组件的使用者提供了内容，即使该组件从未定义 `<ng-content>` 元素或该 `<ng-content>` 元素位于 `ngIf` 语句的内部，该内容也总会被初始化**。

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

#### NgTemplateOutlet
使 `NgTemplateOutlet` 的宿主元素变成一个内嵌视图 —— 这个内嵌视图是根据一个提前定义好的 `templateRef` 模板引用生成的。而宿主元素无论是什么元素，都不会被渲染出来。

```typescript
@Component({
  selector: 'ng-template-outlet-example',
  template: `
    <ng-container *ngTemplateOutlet="one"></ng-container>
    <hr>
    <ng-container *ngTemplateOutlet="two; context: myContext"></ng-container>
    <hr>
    <ng-container *ngTemplateOutlet="three; context: myContext"></ng-container>
    <hr>

    <ng-template #one><span>Hello</span></ng-template>
    <ng-template #two let-name><span>Hello {{name}}!</span></ng-template>
    <ng-template #three let-person="lastName">My name is <span>LeBron {{person}}!</span></ng-template>
`
})
export class NgTemplateOutletExample {
  myContext = {$implicit: 'World', lastName: 'James'};
}
```

一个宿主元素可以使用 `ngTemplateOutlet` 这个结构性指令，使自己变成任意的一个 `<ng-template>` 模板生成的内嵌视图。并且可以给其设置**上下文对象**。
然后我们在这个模板中可以使用 `let-变量` 这个模板输入变量来获取上下文对象中的值，这个模板更具灵活性。

在上下文对象中使用 `$implicit` 这个 key 会把对应的值设置为默认值。


## 动态组件加载

## Angular 元素

Angular 元素就是打包成自定义元素的 Angular 组件。所谓自定义元素就是一套与具体框架无关的用于定义新 HTML 元素的 Web 标准。

[自定义元素](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements)这项特性目前受
到了 Chrome、Edge（基于 Chromium 的版本）、Opera 和 Safari 的支持，在其它浏览器中也能通过腻子脚本加以支持。

自定义元素扩展了 HTML，它允许你定义一个由 JavaScript 代码创建和控制的标签。 浏览器会维护一个自定义元素的注册表 `CustomElementRegistry`，它把一个可实
例化的 JavaScript 类映射到 HTML 标签上。

`@angular/elements` 包的 `createCustomElement()` API 把组件转换成自定义元素可以让所有所需的 Angular 基础设施都在浏览器中可用。
