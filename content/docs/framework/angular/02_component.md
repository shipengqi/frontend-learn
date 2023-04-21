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

#### ViewChildren

`ViewChildren` 和 `ViewChild` 行为类似，只是 `ViewChild` 只返回一个引用，而 `ViewChildren` 以 `QueryList` 对象的形式返回多个引用。

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


## Change Detection：变化检测策略

Angular 默认的变化检测机制是 `ChangeDetectionStrategy.Default`：异步事件 callback 结束后，NgZone 会触发整个组件树至上而下做变化检测。

但是在实际应用里，并不是每个异步操作需要变化检测，某些组件也可以完全不用做变化检测，应用越大页面越复杂，过多的变化检测会影响整个应用的性能。Angular 除了默认的变化检测
机制，也提供了 `ChangeDetectionStrategy.OnPush`，用 `OnPush` 可以跳过某个组件或者某个父组件以及它下面所有子组件的变化检测。

定义一个 `ParentComponent` 如下：

```typescript
@Component({
    template: `<h1> { { data.title } } </h1>

               <cd-child [data]="data"></cd-child>
   
               <button (click)="changeInfo()">Change Info</button>`
})
export class ParentComponent {
    data: any = {
       title: 'parent',
    };
    changeInfo() {
        this.data.title = 'child';
    }

}
```

定义一个 `ChildComponent` 如下：
```typescript
@Component({
    selector: "cd-child",
    template: `<h3>{ { title } } </h3>`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CDChildComponent implements OnChanges {
   @Input() data: any;

   ngOnChanges() {
      console.log('data has been changed: ' + this.data.title);
   }
}
```

点击 `ChangeInfo` 按钮，不会触发 `ChildComponent` 中的变化检测，页面 title 也不会有变化。加了 `OnPush` 表示，在发生异步事件以后触发变化检测，Angular 会跳过这个组件，不会触发
这个组件的变化检测。如果 `OnPush` 是加在某个父组件上，那么这个父组件和它下面所有的子组件都不会触发变化检测。

但是在实际应用里，我们并不希望把整个组件的变化检测都禁掉，而是希望部分操作还是可以触发它的变化检测，比如从后端 API 返回新的数据，虽然加了 `OnPush`，这些数
据还是能够更新在页面上。

Angular 在组件里添加了 `OnPush` 策略，以下四种情况还是可以触发该组件的变化检测：

1. 组件的 `@Input` 引用发生变化。注意 `Object` 是通过引用传递的，每次对 `Object` 改动，引用不会改变。
2. 组件的 DOM 事件，包括它子组件的 DOM 事件，比如 `click`、`submit`、`mouse down`。
3. `Observable` 订阅事件，同时设置 `Async pipe`。
4. 利用以下方式手动触发变化检测： 
   - `ChangeDetectorRef.detectChanges`
   - `ChangeDetectorRef.markForCheck()`
   - `ApplicationRef.tick()`

## Component 装饰器的其他属性
- `styles`：本组件用到的一个或多个内联 CSS 样式。
- `animations`：一个或多个动画 trigger()调用，包含一些 state()和 transition()定义。
- `interpolation`：改写默认的插值表达式起止分界符（`{{` 和 `}}`）
- `preserveWhitespaces`：值为 `false` 时，从编译后的模板中移除可能多余的空白字符，为 `true` 时则保留，空白字符就是指那些
  能在 JavaScript 正则表达式中匹配 `\s` 的字符。默认为 `false`。

### encapsulation

当我们定义一个 Component 的时候，要考虑它的 encapsulation 封装性，也就是说你期望这个组件里定义的样式是只作用于这个组件，还是想作用于全局。

供模板和 CSS 样式使用的样式封装策略。取值为：

- `ViewEncapsulation.Native`：使用 Shadow DOM。它只在原生支持 Shadow DOM 的平台上才能工作。允许我们对元素应用作用域样式，而不影响其他元素。
- `ViewEncapsulation.Emulated`：使用垫片（shimmed) CSS 来模拟原生行为。可以将样式范围限定为特定元素。而且由于它没有使用Shadow DOM，因此它仍然可以在不支
  持 Shadow DOM 的浏览器中运行。
- `ViewEncapsulation.None`： Use global CSS without any encapsulation.
- `ViewEncapsulation.None`：使用全局 CSS，不做任何封装。 如果没有提供，该值就会从 CompilerOptions 中获取它。默认的
  编译器选项是 `ViewEncapsulation.Emulated`

### viewProviders

定义一组可注入对象，它们在视图的各个子节点中可用。[示例](https://angular.io/api/core/Component#injecting-a-class-with-a-view-provider)

```typescript
class Greeter {
   greet(name:string) {
     return 'Hello ' + name + '!';
   }
}

@Directive({
  selector: 'needs-greeter'
})
class NeedsGreeter {
  greeter:Greeter;

  constructor(greeter:Greeter) {
    this.greeter = greeter;
  }
}

@Component({
  selector: 'greet',
  viewProviders: [
    Greeter
  ],
  // 重点
  template: `<needs-greeter></needs-greeter>`
})
class HelloWorld {
}
```

### animations

想在我们的应用中使用动画，有一个前提条件，得先引入 `BrowserAnimationsModule` 模块。

```typescript
    animations: [
        trigger('flyInOut', [
            state('in', style({transform: 'translateX(0)'})),
            // keyframes 多阶段动画(任何状态切换的时候都使用该动画)
            transition('* => *', [
                animate(1000, keyframes([
                    style({opacity: 0, transform: 'translateX(-100%)', offset: 0}),
                    // 多往右边移除一点
                    style({opacity: 1, transform: 'translateX(50%)', offset: 0.5}),
                    style({opacity: 1, transform: 'translateX(0)', offset: 1.0})
                ]))
            ])
        ])
    ]
```

`trigger` 触发器，将根据提供的 `triggerName` 值创建一个动画触发器。在模板中使用 `[@triggerName]` 语法来把它附加到一个或多个元素上去。
把元素和触发器对应的动画绑定起来。

```html
<div style="width: 200px; height: 200px;background-color: #67ee38" [@flyInOut]></div>
```

`state` 状态：通过这个 `state` 函数来定义每个状态最终的样式(动画开始时候的样子和动画结束之后的样子)；想要动画动起来需要通过改变状态 (state)来触
发(trigger)动画(animate)。

`transition` 过渡，定义 state 转换的时候使用什么的样的动画来完成。

```typescript
trigger('animationState', [
    // stateA 状态最终样式
    state('stateA', style({
        backgroundColor: '#67ee38',
        transform: 'scale(1)'
    })),
    // stateB 状态最终样式
    state('stateB', style({
        backgroundColor: '#4a302c',
        transform: 'scale(1.1)'
    })),
    // stateA 到 stateB 状态动画
    transition('stateA => stateB', animate('500ms ease-in')),
    // stateB 到 stateA 状态动画
    transition('stateB => stateA', animate('500ms ease-out'))
]),
```

两个状态之间的装换就是通过 `状态 => 状态` 这样的表达式来定义。
`*`、`void` 状态。其中 `*` 状态匹配任何状态，`void` 状态表示元素没有被附加到视图时候的状态。

入场和出场动画：

```typescript
    animations: [
        trigger('flyInOut', [
            state('in', style({opacity: 1, transform: 'translateX(0) scale(1)'})),
            // 进场动画
            // void => * 可以替换为 :enter
            transition('void => *', [
                style({opacity: 0, transform: 'translateX(-100%) scale(0)'}),
                animate(500)
            ]),
            // 出场动画
            // * => void 可以替换为 :leave
            transition('* => void', [
                animate(500, style({opacity: 0, transform: 'translateX(100%) scale(0)'}))
            ])
        ])
    ]
```

关键帧动画：

```typescript
transition(":leave", [
  animate(
    600,
    keyframes([
      style({ offset: 0.3, transform: "translateX(-80px)" }),
      style({ offset: 1, transform: "translateX(100%)" })
    ])
  )
])
```

动画回调：

```html
<li @slide (@slide.start)="start($event)" (@slide.done)="done($event)"></li>
```

```typescript
import { AnimationEvent } from "@angular/animations"

start(event: AnimationEvent) {
  console.log(event)
}
done(event: AnimationEvent) {
  console.log(event)
}
```

可重用动画：

动画定义在一个独立的文件中：
```typescript
import {animate, animation, keyframes, style, transition, trigger, useAnimation} from "@angular/animations"

export const slideInUp = animation(
    [
        style({ opacity: 0, transform: "translateY(40px)" }),
        animate("{{ duration }} {{ delay }} {{ easing }}")
    ],
    {
        params: {
            duration: "400ms",
            delay: "0s",
            easing: "ease-out"
        }
    }
)

export const slideOutLeft = animation([
    animate(
        600,
        keyframes([
            style({ offset: 0.3, transform: "translateX(-80px)" }),
            style({ offset: 1, transform: "translateX(100%)" })
        ])
    )
])

export const slide = trigger("slide", [
    transition(":enter", useAnimation(slideInUp, {params: {delay: "1s"}})),
    transition(":leave", useAnimation(slideOutLeft))
])
```

```typescript
import { slide } from "./animations"

@Component({
  animations: [slide]
})
```

查询元素执行动画：

`query` 方法可以用来查找元素并为元素创建动画
```typescript
import { slide } from "./animations"

animations: [
  slide,
  trigger("todoAnimations", [
    transition(":enter", [
      query("h2", [
        style({ transform: "translateY(-30px)" }),
        animate(300)
      ]),
      // 查询子级动画 使其执行
      query("@slide", animateChild())
    ])
  ])
]
```

```html
<div class="container" @todoAnimations>
  <h2>Todos</h2>
  <ul class="list-group">
    <li
      @slide
      (click)="removeItem(i)"
      *ngFor="let item of todos; let i = index"
      class="list-group-item"
    >
      {{ item }}
    </li>
  </ul>
</div>
```

默认情况下，父级动画和子级动画按照顺序执行，先执行父级动画，再执行子级动画，可以使用 `group` 方法让其并行

```typescript
trigger("todoAnimations", [
  transition(":enter", [
    group([
      query("h2", [
        style({ transform: "translateY(-30px)" }),
        animate(300)
      ]),
      query("@slide", animateChild())
    ])
  ])
])
```

交错动画：

`stagger` 方法，在多个元素同时执行同一个动画时，让每个元素动画的执行依次延迟，**stagger 方法只能在 query 方法内部使用**。
```typescript
transition(":enter", [
  group([
    query("h2", [
      style({ transform: "translateY(-30px)" }),
      animate(300)
    ]),
    query("@slide", stagger(200, animateChild()))
  ])
])
```

### 继承自 Directive 装饰器

`selector`：这个 CS S选择器用于在模板中标记出该指令，并触发该指令的实例化。
`jit`：如果为 `true`，则该指令/组件将会被 AOT 编译器忽略，始终使用 JIT 编译。

#### exportAs

定义一个名字，用于在模板中把该指令赋值给一个变量。父组件就可以获得指令的实例了。

```typescript
@Directive({
  selector: '[appColorful]',
  // 加上 exportAs
  exportAs: 'colorful'
})
```
在模板上就可以使用 `#color="colorful"` 的方式，取得 directive 实体了：

```typescript
@Component({
  selector: 'my-app',
  template: `
  <!-- 使用 #color="colorful" 取得实体 -->
  <p appColorful="blue" #color="colorful">Hello World</p>
  <button (click)="change()">Change Color</button>
  `,
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  // 确定取得的是 ColorDirective 的实体
  @ViewChild('color') color: ColorfulDirective;

  change() {
    console.log(this.color);
    this.color.changeColor('black');
  }
}
```

路由动画：

1. 为路由添加状态标识，此标识即为路由执行动画时的自定义状态：
    ```typescript
    const routes: Routes = [
      {
        path: "",
        component: HomeComponent,
        pathMatch: "full",
        data: {
          animation: "one" 
        }
      },
      {
        path: "about",
        component: AboutComponent,
        data: {
          animation: "two"
        }
      },
      {
        path: "news",
        component: NewsComponent,
        data: {
          animation: "three"
        }
      }
    ]
    ```

2. 通过路由插座对象获取路由状态标识，并将标识传递给动画的调用者，让动画执行当前要执行的状态是什么：

    ```html
    <div class="routerContainer" [@routerAnimations]="prepareRoute(outlet)">
      <router-outlet #outlet="outlet"></router-outlet>
    </div>
    ```
    
    ```typescript
    import { RouterOutlet } from "@angular/router"
    
    export class AppComponent {
      prepareRoute(outlet: RouterOutlet) {
        return (
          outlet &&
          outlet.activatedRouteData &&
          outlet.activatedRouteData.animation
        )
      }
    }
    ```
3. 将 `routerContainer` 设置为相对定位，将它的直接一级子元素设置成绝对定位：

    ```css
    /* styles.css */
    .routerContainer {
      position: relative;
    }
    
    .routerContainer > * {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
    }
    ```
4. 创建动画：
```typescript
trigger("routerAnimations", [
  transition("one => two, one => three, two => three", [
    query(":enter", style({ transform: "translateX(100%)", opacity: 0 })),
    group([
      query(
        ":enter",
        animate(
          "0.4s ease-in",
          style({ transform: "translateX(0)", opacity: 1 })
        )
      ),
      query(
        ":leave",
        animate(
          "0.4s ease-out",
          style({
            transform: "translateX(-100%)",
            opacity: 0
          })
        )
      )
    ])
  ]),
  transition("three => two, three => one, two => one", [
    query(
      ":enter",
      style({ transform: "translateX(-100%)", opacity: 0 })
    ),
    group([
      query(
        ":enter",
        animate(
          "0.4s ease-in",
          style({ transform: "translateX(0)", opacity: 1 })
        )
      ),
      query(
        ":leave",
        animate(
          "0.4s ease-out",
          style({
            transform: "translateX(100%)",
            opacity: 0
          })
        )
      )
    ])
  ])
])
```
#### host

使用一组键-值对，把类的属性映射到宿主元素的绑定（Property、Attribute 和事件）。

`@HostBinding()` 可以为指令的宿主元素添加类、样式、属性等，而 `@HostListener()` 可以监听宿主元素上的事件。

官网的说明：
- `HostBinding`：用于把一个 DOM 属性标记为绑定到宿主的属性，并提供配置元数据。 Angular 在变更检测期间会自动检查宿主属性绑定，如果这个绑定变化了，它就会更新该指令所在的宿主元素。
- `HostListener`：用于声明要监听的 DOM 事件，并提供在该事件发生时要运行的处理器方法。

```typescript
@Component({
  selector: 'demo-component',
  host: {
    '(click)': 'onClick($event.target)', // 事件
    'role': 'nav', // 属性
    '[class.pressed]': 'isPressed', // 类
  }
})
export class DemoComponent {
  isPressed: boolean = true;
 
  onClick(elem: HTMLElement) {
    console.log(elem);
  }
}
```

等价于 `@HostBinding`、`@HostListener`：

```typescript
@Component({
  selector: 'demo-component'
})
export class DemoComponent {
  @HostBinding('attr.role') role = 'nav';
  @HostBinding('class.pressed') isPressed: boolean = true;
 
  @HostListener('click', ['$event.target'])
  onClick(elem: HTMLElement) {
    console.log(elem);
  }
}
```

实现一个在输入时实时改变字体和边框颜色：
```typescript
import { Directive, HostBinding, HostListener } from '@angular/core'; 
@Directive({  
    selector:'[rainbow]'      
})

export class RainbowDirective{ 
possibleColors = [
  'darksalmon', 'hotpink', 'lightskyblue', 'goldenrod',   
  'peachpuff', 'mediumspringgreen', 'cornflowerblue', 
  'blanchedalmond', 'lightslategrey'  
];                       
@HostBinding('style.color') color: string; 
@HostBinding('style.borderColor') borderColor: string;    
@HostListener('keydown') onKeydown() {    
    const colorPick = Math.floor(Math.random()*this.possibleColors.length);      
    this.color = this.borderColor = this.possibleColors[colorPick];  
}}
```

用 `@HostBinding()`装饰 `color` 和 `borderColor`，用于设置样式。`@HostListener()` 监听宿主元素的 `keydown` 事件，为 `color` 
和 `borderColor` 随机分配颜色。

```html
<input rainbow>
```

`@HostBinding` 的作用其实就是将某个属性绑定到了宿主元素上，这个属性指的是 angular 模板中支持的属性，其实 `@HostBinding` 就相当于模板中的 `[]` 或者 `bind-`。
`@HostListener` 就相当于模板中的 `()` 或者 `on-`。

## ContentChild, ContentChildren

`ContentChildren` 属性装饰器用来从通过 Content Projection 方式设置的视图中获取 `ng-content` 里面匹配的多个元素，返回的结果是一个 `QueryList` 集合。

`ContentChild` 类似 `ContentChildren`，不过返回的是一个元素。

`ContentChild` 和 `ViewChild` 的区别：

`ContentChild` 用来从通过 Content Projection 方式 (ng-content) 设置的视图中获取匹配的元素。
`ViewChild` 匹配的元素在组件的模板中定义的内容，它是组件的一部分。
在父组件的 `ngAfterContentInit` 生命周期钩子中才能成功获取通过 `ContentChild` 查询的元素
在父组件的 `ngAfterViewInit` 生命周期钩子中才能成功获取通过 `ViewChild` 查询的元素


## Todo

- 更改检测
  - [Angular 更改检测](https://cloud.tencent.com/developer/news/489235)
  - [Angular 的变化检测](https://zhuanlan.zhihu.com/p/50715168)
- [Angular 路由](https://cloud.tencent.com/developer/section/1489557)
  - [Angular 路由 Official](https://v9.angular.cn/guide/router#router-state)
  - [RouterOutlet 指令](https://segmentfault.com/a/1190000039677270)
  - [router-outlet 使用](https://www.jianshu.com/p/d2e0223a337d)
- CSS
  - 元素选择器，所有的伪类，动画，过渡，transform，系统学习
  - [::before 和 ::after](https://juejin.cn/post/6992961262560739364)
  - [::before 和 ::after 伪元素的实际用途](https://juejin.cn/post/7103110475960811527)
  - [:before 和 :after 用法详解](https://www.cnblogs.com/wonyun/p/5807191.html)
  - [::after ::before与原理详解](https://blog.csdn.net/weixin_34533343/article/details/113041858)
  - [CSS 变量教程](https://www.ruanyifeng.com/blog/2017/05/css-variables.html)
  - [CSS 全局变量的使用](https://juejin.cn/post/6883759797338898439)
  - [垂直居中的12种实现方式](https://juejin.cn/post/6844903550909153287)
  - [元素垂直居中笔记](https://segmentfault.com/a/1190000008707864)
  - [CSS元素居中教程](https://www.pengfeixc.com/blogs/css/css-center-element-tutorial)
