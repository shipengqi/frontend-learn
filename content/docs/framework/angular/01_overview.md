---
title: 概述
weight: 1
---

## NgModule

Angular 应用是由一个个模块组成的，称作 **NgModule**。

NgModule 是一组相关功能的集合，专注于某个应用领域，可以将组件和一组相关代码关联起来，是应用组织代码结构的一种方式。

NgModule 可以从其它 NgModule 中导入功能，并允许导出它们自己的功能供其它 NgModule 使用。

NgModule 是由 NgModule 装饰器函数装饰的类。

```javascript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [
    BrowserModule
  ]
})
export class AppModule { }
```

### `@NgModule` 元数据

NgModule 是一个带有 `@NgModule()` 装饰器的类。`@NgModule()` 元数据对象比较重要的属性：

- `declarations` 属于当前 NgModule 的组件、指令、管道。
- `exports` 导出当前 NgModule 的组件、指令、管道的列表。
- `imports`  导入的 NgModule、组件、指令、管道的列表。
- `providers` 当前 NgModule 所需的服务。
- `bootstrap` 应用的主视图，称为根组件。它是应用中所有其它视图的宿主。只有 **root module** 才应该设置这个 `bootstrap` 属性。

## 组件

组件用来描述用户界面，它由三部分组成，组件类、组件模板、组件样式，它们可以被集成在组件类文件中，也可以是三个不同的文件。

组件类用来编写和组件直接相关的界面逻辑，在组件类中要关联该组件的组件模板和组件样式。

组件模板用来编写组件的 HTML 结构，通过数据绑定标记将应用中数据和 DOM 进行关联。

组件样式用来编写组件的组件的外观，组件样式可以采用 CSS、LESS、SCSS、Stylus

在 Angular 应用中至少要有一个根组件，用于应用程序的启动。

组件类是由 Component 装饰器函数装饰的类。

```javascript
import { Component } from "@angular/core"

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  title = "angular-test"
}
```

## 服务

服务用于放置和特定组件无关并希望跨组件共享的数据或逻辑。

服务出现的目的在于解耦组件类中的代码，是组件类中的代码干净整洁。

服务是由 `Injectable` 装饰器装饰的类。

```javascript
import { Injectable } from '@angular/core';

@Injectable({})
export class AppService { }
```

服务的实例对象由 Angular 框架中内置的依赖注入系统创建和维护。服务是依赖需要被注入到组件中。

在组件中需要通过 `constructor` 构造函数的参数来获取服务的实例对象。

在组件中获取服务实例对象，写法如下。

```javascript
import { AppService } from "./AppService"

export class AppComponent {
  constructor (
  	private appService: AppService
  ) {}
}
```

Angular 会根据你指定的服务的类型来传递你想要使用的服务实例对象。

在 Angular 中服务被设计为单例模式，这也正是为什么服务可以被用来在组件之间共享数据和逻辑的原因。
