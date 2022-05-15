# Angular

## NgModule

Angular 应用是模块化的，它拥有自己的模块化系统，称作 NgModule。

一个 NgModule 就是一个容器，它专注于某个应用领域、某个工作流或一组紧密相关的能力。 NgModule 可以将其组件和一组相关代码（如服务）关联起来，形成功能单元。

- 一个 Angular 应用程序是由一组 NgModules 定义的。
- 一个应用程序总是至少有一个 **root module**（通常命名为 `AppModule`，位于一个名叫 `app.module.ts` 的文件中），根模块提供了用来启动应用的引导机制。 一个应用通常会包含很多特性模块。
- NgModule 也可以从其它 NgModule 中导入功能，并允许导出它们自己的功能供其它 NgModule 使用。

### @NgModule 元数据

NgModule 是一个带有 `@NgModule()` 装饰器的类。`@NgModule()` 元数据对象比较重要的属性：

- `declarations` 属于当前 NgModule 的组件、指令、管道。
- `exports` 在其他 NgModules 的组件模板中应该可见和可用的声明的子集。
- `imports`  其他 NgModules 导出的类被当前这个 NgModule 中声明的组件模板所需要。
- `providers` 当前 NgModule 向全局服务中提供的一些服务的创建器；这些服务可以在应用程序的所有部分被访问。(你也可以在组件级别指定服务提供者，这通常是首选方式）。
- `bootstrap` 应用的主视图，称为根组件。它是应用中所有其它视图的宿主。只有 **root module** 才应该设置这个 `bootstrap` 属性。

### NgModule 和组件

NgModule 为一个组件集声明了编译的上下文环境。根模块总会有一个根组件，并在引导期间创建它。 但是，任何模块都能包含任意数量的其它组件，这些组件可以通过路由器加载，也可以通过模板创建。那些属于这个 NgModule 的组件会共享同一个编译上下文环境。

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

组件是一种特殊的指令，除组件外，还有两种指令：**结构型指令**和**属性型指令**。也可以使用 `@Directive()` 装饰器来自定义指令。

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
   同一个 Service 实例对该 NgModule 中的所有组件可用。

3. 在 `@Component()` 元数据的 `providers` 属性中注册 provider
   ```typescript
   @Component({
       selector:    'app-hero-list',
       templateUrl: './hero-list.component.html',
       providers:   [ HeroService ]
   })
   ```
   injector 会为组件的每一个新实例注入一个新的 Service 实例


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