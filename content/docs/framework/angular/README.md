# Angular

## NgModule

Angular 应用是模块化的，它拥有自己的模块化系统，称作 NgModule。

一个 NgModule 就是一个容器，它专注于某个应用领域、某个工作流或一组紧密相关的能力。 NgModule 可以将其组件和一组相关代码（如服务）关联起来，形成功能单元。

- 一个 Angular 应用程序是由一组 NgModules 定义的。
- 一个应用程序总是至少有一个 **root module**（通常命名为 `AppModule`，位于一个名叫 `app.module.ts` 的文件中），根模块提供了用来启动应用的引导机制。 一个应用通常会包含很多特性模块。
- NgModule 也可以从其它 NgModule 中导入功能，并允许导出它们自己的功能供其它 NgModule 使用。

### `@NgModule` 元数据

NgModule 是一个带有 `@NgModule()` 装饰器的类。`@NgModule()` 元数据对象比较重要的属性：

- `declarations` 属于当前 NgModule 的组件、指令、管道。
- `exports` 可供导入了当前 NgModule 的模块使用的可声明对象（组件、指令、管道类）的列表。
- `imports`  告诉 Angular 当前 NgModule 还需要哪些 NgModule。
- `providers` 当前 NgModule 所需的服务。
- `bootstrap` 应用的主视图，称为根组件。它是应用中所有其它视图的宿主。只有 **root module** 才应该设置这个 `bootstrap` 属性。

### NgModule 和组件

NgModule 为一个组件集声明了编译的上下文环境。根模块总会有一个根组件，并在引导期间创建它。 但是，任何模块都能包含任意数量的其它组件，这些组件可以通过路由器加载，也可以通过模板创建。那些属于这个 NgModule 的组件会共享同一个编译上下文环境。

### 特性模块

特性模块是用来对代码进行组织的模块。

特性模块，你以把与特定的功能或特性有关的代码从其它代码中分离出来。 为应用勾勒出清晰的边界。

特性模块是最佳的组织方式。特性模块提供了聚焦于特定应用需求的一组功能，比如用户工作流、路由或表单。虽然可以用根模块做完所有事情，不过特性模块可以帮助你把应用划分成一些聚焦的功能区。特性模块通过它提供的服务以及共享出的组件、指令和管道来与根模块和其它模块合作。

## 组件

- 每个应用都至少有一个根组件。它会把组件树和页面中的 DOM 连接起来。
- **组件定义视图**。视图是一组可见的屏幕元素，Angular 可以根据你的程序逻辑和数据来选择和修改它们。
- **组件使用服务**。服务会提供那些与视图不直接相关的功能。服务提供者可以作为依赖被注入到组件中， 这能让你的代码更加模块化、更加可复用、更加高效。
- **事件绑定** 让你的应用可以通过更新应用的数据来响应目标环境下的用户输入。
- **属性绑定** 让你将从应用数据中计算出来的值插入到 HTML 中。
- **双向数据绑定** 这意味着 DOM 中发生的变化（比如用户的选择）同样可以反映回你的程序数据中。


### 数据绑定

数据绑定标记的四种形式：

```html
<li>{{hero.name}}</li>
<app-hero-detail [hero]="selectedHero"></app-hero-detail>
<li (click)="selectHero(hero)"></li>
```

- `{{hero.name}}` 插值，在 `<li>` 标签中显示组件的 `hero.name` 属性的值。
- `[hero] = "value"` 属性绑定，把父组件的 `selectedHero` 的值传到子组件 `app-hero-detai`
- `(event) = "handler"` 事件绑定，会调用当前组件的 `selectHero` 方法。

```html
<input type="text" id="hero-name" [(ngModel)]="hero.name">
```

双向数据绑定，把属性绑定和事件绑定组合成一种单独的写法。

`ngModel` 指令使用了双向数据绑定：数据属性值 `hero.name` 通过属性绑定从组件流到 `input` 标签。用户的修改通过事件绑定流回组件，把属性值 `hero.name` 设置为最新的值。

### 管道

Angular 的管道可以让你在模板中声明显示值的转换逻辑。带有 `@Pipe` 装饰器的类中会定义一个转换函数，用来把输入值转换成供视图显示用的输出值。[内置的 Pipes API 列表](https://angular.cn/api?type=pipe)

要在 HTML 模板中指定值的转换方式，使用管道操作符 `|`。

```html
<!-- Default format: output 'Jun 15, 2015'-->

 <p>Today is {{today | date}}</p>
```


### 指令

指令就是一个带有 `@Directive()` 装饰器的类。

组件是一种特殊的指令（也可以简单理解为指令是没有模板的组件），除组件外，还有两种指令：**结构型指令**和**属性型指令**。也可以使用 `@Directive()` 装饰器来自定义指令。

像组件一样，指令的元数据把它所装饰的指令类和一个 `selector` 关联起来，`selector` 用来把该指令插入到 HTML 中。 
在模板中，指令通常作为属性出现在元素标签上，可能仅仅作为名字出现，也可能作为赋值目标或绑定目标出现。


结构型指令通过添加、移除或替换 DOM 元素来修改布局。

```html
<li *ngFor="let hero of heroes"></li>
<app-hero-detail *ngIf="selectedHero"></app-hero-detail>
```

- `*ngFor` 是一个迭代器，遍历 heroes 列表，每个元素渲染出一个 `<li>`。
- `*ngIf` 是个条件语句，只有当 `selectedHero` 为真时，组件 `app-hero-detail` 才会创建。



属性型指令会修改现有元素的外观或行为。`ngModel` 指令就是属性型指令。


## 依赖注入

Dependency injection (DI) 被融入 Angular 框架中，用于在任何地方给新建的组件提供服务。

要把一个类定义为服务，就要用 `@Injectable()` 装饰器来提供元数据，以便让 Angular 可以把它作为依赖注入到组件中。同样，也可以使用 `@Injectable()` 装饰器来表明一个组件或其它类（比如另一个服务、管道或 NgModule）拥有一个依赖。

- **injector**是主要的机制。Angular 会在启动过程中自动创建全应用级 injector 以及所需的其它 injector。不需要自己创建 injector。
- injector 会创建依赖、维护一个容器来管理这些依赖，并尽可能复用它们。
- **provider** 是一个对象，用来告诉 injector 应该如何获取或创建依赖。

应用中所需的任何依赖，都必须使用该应用的 injector 来注册一个 provider，以便 injector 可以使用这个 provider，以便 injector 创建新实例。 对于Service，provider 通常就是 Service Class 本身。

**依赖不一定是服务 —— 它还可能是函数或值**。

Angular 创建组件类的新实例时，它会通过查看该组件类的构造函数，来决定该组件依赖哪些服务或其它依赖项。

下面的构造函数依赖 `HeroService`：
```typescript
constructor(private service: HeroService) { }
```

当 Angular 发现某个组件依赖某个服务时，它会首先检查是否该注入器中已经有了那个服务的任何现有实例。如果所请求的服务尚不存在，注入器就会使用以前注册的服务提供者来制作一个，并把它加入注入器中，然后把该服务返回给 Angular。

### 注册服务

如何注册一个 provider？

1. Service 可以在 `@Injectable()` 元数据中把自己注册为提供者
   ```typescript
   @Injectable({
       providedIn: 'root', // 注册到 root injector 中
   })
   ```
   注册到 root injector 中，Angular 会为 Service 创建一个单一的共享实例（单例模式），并且把它注入到任何想要它的类中。

2. `@NgModule()` 元数据的 `providers` 属性中注册 provider
   ```typescript
   @NgModule({
       providers: [
           BackendService,
           Logger
       ],
    ...
   })
   ```
   同一个 Service 实例对该 NgModule 中的所有组件可用。对于这个 NgModule 是单例的。但是如果有多个 NgModule，加载了这个 Service，
   Service 就会被注册在多个地方。这会导致出现多个服务实例，并且该服务的行为不再像单例一样。
   如果不希望这样：使用 `@Injectable()` 方式注册，或者在各个 NgModule 中都放一个 Servie，最后还可以定义 `forRoot()` 和 `forChild()` 方法
3. 在 `@Component()` 元数据的 `providers` 属性中注册 provider
   ```typescript
   @Component({
       selector:    'app-hero-list',
       templateUrl: './hero-list.component.html',
       providers:   [ HeroService ]
   })
   ```
   injector 会为组件的每一个新实例注入一个新的 Service 实例

#### forRoot() 模式

`forRoot` 字面意思就是针对根模块的。这只是一种模式。

例如在一个模块 A 中定义静态函数 `forRoot()` 把 provider 从模块 A 中分离出去，只有根模块中导入该模块 A 时，调用 `forRoot` 函数，返回的NgModule 的定义中把 providers 带上。

```typescript
static forRoot(config: UserServiceConfig): ModuleWithProviders<GreetingModule> {
  return {
    ngModule: GreetingModule,
    providers: [
      {provide: UserServiceConfig, useValue: config }
    ]
  };
}
```

```typescript
@NgModule({
  declarations: [AppComponent, ExtendSessionComponent],
  imports: [
    // ...
    ColorServiceModule.forRoot(colorSets.microFocus),
    LoggerModule.forRoot({
      serverLoggingUrl: environment.baseHref + 'v1/log',
      level: environment.localLogLevel,
    }),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

#### forRoot() 和 Router

RouterModule 中提供了 Router 服务。

如果 RouterModule 没有 `forRoot()`，那么每个特性模块都会实例化一个新的 Router 实例，而这会破坏应用的正常逻辑，因为应用中只能有一个 Router 实例。通过使用 `forRoot()` 方法，应用的根模块中会导入 `RouterModule.forRoot(...)`，从而获得一个 Router 实例，而所有的特性模块要导入 `RouterModule.forChild(...)`，它就不会实例化另外的 Router。

#### 惰性加载

在 CLI 生成的应用中，模块是急性加载的，也就是应用启动时就会加载。应用中的根注入器会让所有 providers 对整个应用都是有效的。

惰性加载就是只有当需要时才加载模块。比如 Router。惰性加载可以减小初始包的尺寸，从而减少加载时间。

Router 惰性加载使用 `loadChildren` 代替 `component`：

```typescript
const routes: Routes = [
  {
    path: 'items',
    // 惰性加载
    loadChildren: () => import('./items/items.module').then(m => m.ItemsModule)
    // component: ItemsComponent
  }
];
```

当 Angular 的 Router 惰性加载一个模块时，它会创建一个新的注入器。这个注入器是应用的根注入器的一个子注入器。想象一棵注入器树，它有唯一的根注入器，而**每一个惰性加载模块都有一个自己的子注入器**。Router 会把根注入器中的所有提供者添加到子注入器中。如果 Router 在惰性加载时创建组件，Angular 会更倾向于使用从这些 providers 中创建的服务实例，而不是来自应用的根注入器的服务实例。

通过使用 `providedIn: 'any'`，所有急性加载的模块都会共享同一个服务单例，不过，惰性加载模块各自有它们自己独有的单例。

#### 防止重复导入

防止惰性加载模块重复导入

```typescript
constructor(@Optional() @SkipSelf() parentModule?: GreetingModule) {
  if (parentModule) {
    throw new Error(
      'GreetingModule is already loaded. Import it in the AppModule only');
  }
}
```

该构造函数把 `GreetingModule` 注入它自己。 如果在当前注入器中查找 `GreetingModule`，这次注入就会导致死循环，但是 `@SkipSelf()` 装饰器的意思是 "在注入器树中层次高于我的祖先注入器中查找 `GreetingModule`。"

如果该构造函数如预期般执行在 AppModule 中，那就不会有任何祖先注入器可以提供 `GreetingModule` 的实例，所以该注入器就会放弃注入。

默认情况下，当注入器找不到想找的提供者时，会抛出一个错误。 但 `@Optional()` 装饰器表示找不到该服务也无所谓。于是注入器会返回 `null`，`parentModule` 参数也就被赋成了空值，而构造函数没有任何异常。

## 模板变量   

模板变量可以帮助你在模板的另一部分使用这个部分的数据。

在模板中，用 `#` 来声明一个模板变量。

```html
<input #phone placeholder="phone number" />
```

`<input>` 元素上声明了一个名为 `phone` 的模板变量，可以在组件模板中的任何地方引用：

```html
<input #phone placeholder="phone number" />

<!-- lots of other elements -->

<!-- phone refers to the input element; pass its `value` to an event handler -->
<button (click)="callPhone(phone.value)">Call</button>
```

点击 button，触发 click 事件，处理程序会把这个 phone 引用的 `<input>` 的值传给该组件的 `callPhone()` 方法。

在大多数情况下，Angular 会把模板变量的值设置为它所在的元素。上面的例子就是。

`NgForm` 指令演示了如何通过引用指令的的 exportAs 名字来引用不同的值。

```html
<form #itemForm="ngForm" (ngSubmit)="onSubmit(itemForm)">
  <label for="name">Name</label>
  <input type="text" id="name" class="form-control" name="name" ngModel required />
  <button type="submit">Submit</button>
</form>

<div [hidden]="!itemForm.form.valid">
  <p>{{ submitMessage }}</p>
</div>
```

上面的例子，如果没有 `#itemForm="ngForm"`，itemForm 引用的值就是 `<form>` 元素。但是 Component 和 Directive 的区别在于 Angular 在没有指定属性值的情况下，Angular 会引用 Component，而 Directive 仍然引用它的宿主元素。

而使用了 NgForm 之后，itemForm 就是对 NgForm 指令的引用，可以用它来跟踪表单中每一个控件的值和有效性。

与原生的 `<form>` 元素不同， NgForm 指令有一个 form 属性。如果 `itemForm.form.valid` 无效，那么 NgForm 的 form 属性就会让你禁用提交按钮。

### 模板变量作用域

```html
<input #ref1 type="text" [(ngModel)]="firstExample" />
<span *ngIf="true">Value: {{ ref1.value }}</span>

<!-- 相当于 -->
<input #ref1 type="text" [(ngModel)]="firstExample" />
<ng-template [ngIf]="true">
  <span>Value: {{ ref1.value }}</span>
</ng-template>
```

`<span>` 在一个隐式的 `<ng-template>` 中，`#ref1` 定义在该隐式模板之外。访问父模板中的模板变量是可行的，因为子模板会从父模板继承上下文。

从外部的父模板访问子模板中的变量是行不通的。

```html
<input *ngIf="true" #ref2 type="text" [(ngModel)]="secondExample" />
<span>Value: {{ ref2?.value }}</span> <!-- doesn't work -->


<!-- 相当于 -->
<ng-template [ngIf]="true">
  <input #ref2 type="text" [(ngModel)]="secondExample" />
</ng-template>
<span>Value: {{ ref2?.value }}</span>
```

对于 `*ngFor`：

```html
<ng-container *ngFor="let i of [1,2]">
  <input #ref type="text" [value]="i" />
</ng-container>
{{ ref.value }}
```

这里的 `ref.value` 不起作用。因为 `*ngFor` 在对数组中的两个元素进行迭代。因此不可能定义出 `ref.value` 指向的是谁。


在 `<ng-template>` 上声明变量时，该变量会引用一个 `TemplateRef` 实例来表示该模板。

```html
<ng-template #ref3></ng-template>
<button (click)="log(ref3)">Log type of #ref</button>

<!-- ▼ ƒ TemplateRef()
name: "TemplateRef"
__proto__: Function -->
```


#### 模板输入变量

可以用 `let` 关键字声明模板输入变量：

```html
<!-- 变量：hero、i 和 odd 变量的范围仅限于可复写模板中的单个实例 -->
<ng-template #hero let-hero let-i="index" let-odd="isOdd">
  <div [class]="{'odd-row': odd}">{{i}}:{{hero.name}}</div>
</ng-template>
```

模板输入变量和模板变量名称具有各自的名称空间。`let hero` 中的模板输入变量 `hero` 和 `#hero` 中的模板变量 `hero` 是不同的。

## Observable

可观察对象（Observable）对在应用的各个部分之间传递消息提供了支持。

可观察对象是声明式的 —— 也就是说，虽然你定义了一个用于发布值的函数，但是**在有消费者订阅它之前，这个函数并不会实际执行**。 订阅之后，当这个函数执行完或取消订阅时，订阅者就会收到通知。

可观察对象可以发送多个任意类型的值 —— 字面量、消息、事件。无论这些值是同步发送的还是异步发送的，接收这些值的 API 都是一样的。

应用代码只管订阅并消费这些值就可以了，做完之后，取消订阅。无论这个流是按键流、HTTP 响应流还是定时器，对这些值进行监听和停止监听的接口都是一样的。


创建一个 Observable 的实例，其中定义了一个订阅者（subscriber）函数。 当有消费者调用 `subscribe()` 方法时，这个函数就会执行。
要执行所创建的可观察对象，并开始从中接收通知，你就要调用它的 `subscribe()` 方法，并传入一个观察者（observer）。 这是一个 JavaScript 对象，它定义了你收到的这些消息的处理器（handler）。 `subscribe()` 调用会返回一个 `Subscription` 对象，该对象具有一个 `unsubscribe()` 方法。 当调用该方法时，你就会停止接收通知。
```typescript
// Create an Observable that will start listening to geolocation updates
// when a consumer subscribes.
const locations = new Observable((observer) => {
  let watchId: number;

  // Simple geolocation API check provides values to publish
  if ('geolocation' in navigator) {
    watchId = navigator.geolocation.watchPosition((position: GeolocationPosition) => {
      observer.next(position);
    }, (error: GeolocationPositionError) => {
      observer.error(error);
    });
  } else {
    observer.error('Geolocation not available');
  }

  // When the consumer unsubscribes, clean up data ready for next subscription.
  return {
    unsubscribe() {
      navigator.geolocation.clearWatch(watchId);
    }
  };
});

// Call subscribe() to start listening for updates.
const locationsSubscription = locations.subscribe({
  next(position) {
    console.log('Current Position: ', position);
  },
  error(msg) {
    console.log('Error Getting Location: ', msg);
  }
});

// Stop listening for location after 10 seconds
setTimeout(() => {
  locationsSubscription.unsubscribe();
}, 10000);
```

### 观察者

Observer 接口：

| NOTIFICATION TYPE   | Description                                                                          |
| ------------------- | ------------------------------------------------------------------------------------ |
| `next`              | Required 处理消息的函数，可能执行零次或多次。                                           |
| `error`             | Optional 用来处理错误通知。错误会中断这个可观察对象实例的执行过程。                       |
| `complete`          | Optional 用来处理执行完成（complete）通知。这些值就会继续传给下一个处理器。               |
