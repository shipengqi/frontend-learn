---
title: 路由
weight: 11
---

## 快速上手

1. 创建页面组件、Layout 组件以及 Navigation 组件，供路由使用

    1. 创建**首页**页面组件`ng g c pages/home`
    2.  创建**关于我们**页面组件`ng g c pages/about`
    3. 创建**布局**组件`ng g c pages/layout`
    4. 创建**导航**组件`ng g c pages/navigation`

2. 创建路由规则

   ```typescript
   // app.module.ts
   import { Routes } from "@angular/router"
   
   const routes: Routes = [
     {
       path: "home",
       component: HomeComponent
     },
     {
       path: "about",
       component: AboutComponent
     }
   ]
   ```

3. 引入路由模块并启动

   ```typescript
   // app.module.ts
   import { RouterModule, Routes } from "@angular/router"
   
   @NgModule({
     imports: [RouterModule.forRoot(routes, { useHash: true })],
   })
   export class AppModule {}
   ```

4. 添加路由插座

   **路由插座 `<router-outlet>` 即占位组件 匹配到的路由组件将会显示在这个地方**

   ```html
   <!--  -->
   <router-outlet></router-outlet>
   ```

5. 在导航组件中定义链接

   ```html
   <a routerLink="/home">首页</a>
   <a routerLink="/about">关于我们</a>
   ```

## 路由规则

### 重定向

```typescript
const routes: Routes = [
  {
    path: "home",
    component: HomeComponent
  },
  {
    path: "about",
    component: AboutComponent
  },
  {
    path: "",
    // 重定向
    redirectTo: "home",
    // 完全匹配
    pathMatch: "full"
  }
]
```

### 404 页面

```typescript
const routes: Routes = [
  {
    path: "home",
    component: HomeComponent
  },
  {
    path: "about",
    component: AboutComponent
  },
  {
    path: "**",
    component: NotFoundComponent
  }
]
```

## 路由传参

### 查询参数

通过 `queryParams` 添加查询参数：

```html
<a routerLink="/about" [queryParams]="{ name: 'kitty' }">关于我们</a>
```

访问 url 路径是：`/about?name=kitty`。

```typescript
import { ActivatedRoute } from "@angular/router"

export class AboutComponent implements OnInit {
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(query => {
      query.get("name")
    })
  }
}
```

### 动态参数

```typescript
const routes: Routes = [
  {
    path: "home",
    component: HomeComponent
  },
  {
    path: "about/:name",
    component: AboutComponent
  }
]
```

`about/:name` 中的 `:name` 就是一个动态参数。

```html
<a [routerLink]="['/about', 'zhangsan']">关于我们</a>
```

访问 url 路径是：`/about/zhangsan`。

```typescript
import { ActivatedRoute } from "@angular/router"

export class AboutComponent implements OnInit {
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      params.get("name")
    })
  }
}
```

### 配置路由数据

Angular 可以在路由配置中使用 `data` 属性来定义数据。`data` 属性接受一个对象，可以在组件中通过 `ActivatedRoute` 获取这些数据。

```typescript
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: { title: 'Home Page' } // 配置数据
  },
  {
    path: 'about',
    component: AboutComponent,
    data: { title: 'About Us' } // 配置数据
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

```

通过 `ActivatedRoute` 来访问路由数据：

```typescript
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  template: `<h1>{{ title }}</h1>`
})
export class HomeComponent implements OnInit {
  title: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // 获取路由配置中的数据
    this.title = this.route.snapshot.data['title'];

    // 也可以订阅数据变化
    this.route.data.subscribe(data => {
        this.title = data['title'];
    });
  }
}

```

### snapshot

`ActivatedRoute.snapshot` 是一个用于获取当前路由状态的快照对象。它包含了与当前路由相关的所有信息，包括路由参数、查询参数、数据等。`snapshot` 主要用于**同步**获取路由信息。

- **当你需要在路由切换时读取静态的路由信息时**，而不需要响应路由变化。
- **不需要监听路由变化**，而是只需要在组件初始化时获取一次路由参数和其他信息时使用。

```typescript
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  productId: string;
  category: string;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    // 获取路由参数
    this.productId = this.route.snapshot.paramMap.get('id');
    // 获取查询参数
    this.category = this.route.snapshot.queryParamMap.get('category');
    // 获取完整的 URL
    console.log(this.route.snapshot.url); // 返回 URL 数组
    console.log(this.route.snapshot.url.join('/')); // 返回 URL 字符串
  }
}

```

它适用于你只需要在组件加载时读取一次路由信息，并且不需要响应路由参数变化的场景。如果需要响应路由的变化（例如，路由参数的改变），则应该使用 `route.params` 或 `route.queryParams` 并订阅它们。

### route.parent

多层嵌套的路由配置，其中 `parent` 路由包含一个 `id` 参数，`child` 路由是 `parent` 路由的子路由，`grandchild` 是 `child` 路由的孙子级路由。

```typescript
const routes: Routes = [
  {
    path: 'parent',
    component: ParentComponent,
    children: [
      {
        path: ':id',  // 父路由的参数
        component: ChildComponent,
        children: [
          {
            path: ':subId',  // 孙子路由的参数
            component: GrandchildComponent
          }
        ]
      }
    ]
  }
];

```

使用 `route.parent` 可以获取到父路由的参数。

```typescript
import { ActivatedRoute } from '@angular/router';

export class GrandchildComponent {
  constructor(private route: ActivatedRoute) {
    // 获取父路由的参数
    const parentId = this.route.parent?.snapshot.paramMap.get('id');
    console.log('Parent id:', parentId);

    // 获取孙子路由的参数
    const subId = this.route.snapshot.paramMap.get('subId');
    console.log('Sub id:', subId);
  }
}
```

## 路由嵌套

路由嵌套指的是如何定义子级路由。

```typescript
const routes: Routes = [
  {
    path: "about",
    component: AboutComponent,
    children: [
      {
        path: "introduce",
        component: IntroduceComponent
      },
      {
        path: "history",
        component: HistoryComponent
      }
    ]
  }
]
```

下面是父级组件模板：

```html
<!-- about.component.html -->
<app-layout>
  <p>about works!</p>
  <a routerLink="/about/introduce">公司简介</a>
  <a routerLink="/about/history">发展历史</a>
  <div>
    <router-outlet></router-outlet>
  </div>
</app-layout>
```

父级模板中添加了 `<router-outlet>`，用来显示子级路由的组件。

## 命名插座

命名路由插座使得在同一页面中渲染多个视图变得更加灵活，常用于复杂的布局或多个区域显示不同内容的场景。。

命名插座使用 `outlet` 属性来指定。

```typescript
const routes: Routes = [
   { path: 'dashboard', component: DashboardComponent },
   { path: 'user-profile', component: UserProfileComponent, outlet: 'sidebar' }
];

```

模板布局：

```html
<div class="main-content">
   <router-outlet></router-outlet> <!-- 默认插座显示 dashboard 或其他组件 -->
</div>

<div class="sidebar">
   <router-outlet name="sidebar"></router-outlet> <!-- 命名插座显示 user-profile -->
</div>

```

可以在路由链接中指定插座名称：

```html
<a [routerLink]="[{ outlets: { primary: ['dashboard'], sidebar: ['user-profile'] } }]">
   Go to Dashboard and User Profile
</a>

```

## 导航路由

在 JS 中通过 `Router.navigate` 方法跳转路由：

```html
<!-- app.component.html -->
 <button (click)="jump()">跳转到发展历史</button>
```

```typescript
// app.component.ts
import { Router } from "@angular/router"

export class HomeComponent {
  constructor(private router: Router) {}
  jump() {
    this.router.navigate(["/about/history"], {
      queryParams: {
        name: "Kitty"
      }
    })
  }
}
```

## 路由懒加载

Angular 最新的版本推荐使用 Standalone 组件，可以通过 `loadComponent` 来进行懒加载配置。和常规的模块懒加载不同，Standalone 组件的懒加载是基于组件的，而不是模块。

```typescript
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent)  // 懒加载 Standalone 组件
  },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

```

> 在 Angular 中，Standalone 组件配置了懒加载，其**子组件不会自动成为懒加载组件**。懒加载是基于路由配置的，当你在路由配置中指定某个组件使用 `loadComponent` 来进行懒加载时，只有**该组件本身**被懒加载。其子组件仍然会像常规组件一样，在加载父组件时一并加载。

### 路由懒加载的好处

- 减小初始包体积：只有在用户访问某个路由时，相关的 Standalone 组件才会被加载，这样可以减小应用的初始包体积，提升性能。
- 按需加载：用户只加载他们需要的部分，这对于大型应用来说是一个显著的性能优化。
- 简单配置：与传统的模块懒加载相比，Standalone 组件的懒加载配置更加简洁，因为不再需要为每个懒加载的组件创建单独的模块。

## 路由守卫

**路由守卫**（Route Guards）用于在用户导航到路由之前、或者离开路由时，控制访问权限或执行某些逻辑。

路由守卫可以帮助你做很多事情，例如：权限控制、登录验证、数据预加载等。

常用的路由守卫类型：

- `CanActivate`: 在导航到某个路由时进行检查，控制是否允许该路由激活。
- `CanDeactivate`: 在导航离开当前路由时进行检查，控制是否允许离开该路由（例如，防止丢失未保存的表单数据）。
- `CanLoad`: 在懒加载模块时进行检查，控制是否允许加载该模块。
- `Resolve`: 在路由激活前加载数据，确保数据在路由激活之前就被加载。

路由可以应用多个守卫，所有守卫方法都允许，路由才被允许访问，有一个守卫方法不允许，则路由不允许被访问。

### CanActivate

`CanActivate` 守卫用于控制进入路由时的权限，比如检查用户是否已经登录，或者是否有权限访问某个页面。`CanActivate` 会在路由激活之前执行。即便是懒加载模块，`CanActivate` 也会在模块加载之前执行。

创建路由守卫：`ng generate guard auth`

```typescript
// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';  // 假设你有一个 AuthService 用于检查登录状态

@Injectable({
   providedIn: 'root'
})
export class AuthGuard implements CanActivate {

   constructor(private authService: AuthService, private router: Router) {}

   canActivate(
       next: ActivatedRouteSnapshot,
       state: RouterStateSnapshot
   ): Observable<boolean> | Promise<boolean> | boolean {
      if (this.authService.isAuthenticated()) {
         return true;
      } else {
         // 如果未认证，重定向到登录页面
         this.router.navigate(['/login']);
         return false;
      }
   }
}
```

然后，在路由配置中使用该守卫：

```typescript
// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';  // 引入守卫

const routes: Routes = [
   {
      path: 'dashboard',
      component: DashboardComponent,
      canActivate: [AuthGuard]  // 使用守卫
   },
   {
      path: 'login',
      component: LoginComponent
   },
   {
      path: '',
      redirectTo: '/dashboard',
      pathMatch: 'full'
   }
];

@NgModule({
   imports: [RouterModule.forRoot(routes)],
   exports: [RouterModule]
})
export class AppRoutingModule {}

```

当用户尝试访问 `/dashboard` 路由时，AuthGuard 会先执行，如果用户已经认证（`authService.isAuthenticated()` 返回 `true`），则允许导航；否则，导航会被重定向到 `/login` 页面。

### CanActivateChild

`CanActivateChild` 路由守卫用于控制 子路由 的访问权限。它与 `CanActivate` 类似，但 `CanActivateChild` 主要针对的是父路由的**所有子路由**的访问控制。通过使用 `CanActivateChild`，可以统一管理子路由的权限控制，而不需要在每个子路由上单独配置守卫。

```typescript
// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';  // 假设你有一个 AuthService 用于检查用户登录状态

@Injectable({
   providedIn: 'root'
})
export class AuthGuard implements CanActivateChild {

   constructor(private authService: AuthService, private router: Router) {}

   canActivateChild(
       next: ActivatedRouteSnapshot, 
       state: RouterStateSnapshot
   ): Observable<boolean> | Promise<boolean> | boolean {

      // 判断用户是否已认证
      if (this.authService.isAuthenticated()) {
         return true;  // 允许访问子路由
      } else {
         // 如果未认证，重定向到登录页面
         this.router.navigate(['/login']);
         return false;  // 拒绝访问
      }
   }
}

```

在路由配置中使用 `CanActivateChild` 守卫。`CanActivateChild` 需要被配置在父路由上，而不是每个子路由。

```typescript
// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';  // 引入守卫
import { DashboardComponent } from './dashboard/dashboard.component';
import { SettingsComponent } from './settings/settings.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
   {
      path: 'dashboard',
      component: DashboardComponent,
      canActivateChild: [AuthGuard],  // 使用 CanActivateChild 守卫
      children: [
         {
            path: 'settings',
            component: SettingsComponent
         },
         {
            path: 'profile',
            component: ProfileComponent
         }
      ]
   },
   {
      path: 'login',
      component: LoginComponent
   },
   {
      path: '',
      redirectTo: '/dashboard',
      pathMatch: 'full'
   }
];

@NgModule({
   imports: [RouterModule.forRoot(routes)],
   exports: [RouterModule]
})
export class AppRoutingModule {}

```

### CanDeactivate

`CanDeactivate` 守卫用于在离开当前路由时进行检查，通常用于防止用户丢失未保存的表单数据或者在离开当前页面时提示用户。

```typescript
// can-deactivate.guard.ts
import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';

// 守卫可以适用于多个组件，通常会创建一个接口来约束组件
export interface CanComponentDeactivate {
   canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable({
   providedIn: 'root'
})
export class CanDeactivateGuard implements CanDeactivate<CanComponentDeactivate> {

   canDeactivate(
       component: CanComponentDeactivate
   ): Observable<boolean> | Promise<boolean> | boolean {
      return component.canDeactivate ? component.canDeactivate() : true;
   }
}
```

在组件中实现 `canDeactivate` 方法：

```typescript
// form.component.ts
import { Component } from '@angular/core';
import { CanComponentDeactivate } from './can-deactivate.guard';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements CanComponentDeactivate {

  formIsDirty = false;  // 假设这是表单是否已更改的状态

  canDeactivate(): boolean {
    if (this.formIsDirty) {
      return window.confirm('You have unsaved changes. Do you really want to leave?');
    }
    return true;
  }
}
```

配置路由守卫：

```typescript
// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanDeactivateGuard } from './can-deactivate.guard';  // 引入守卫
import { FormComponent } from './form.component';

const routes: Routes = [
   {
      path: 'form',
      component: FormComponent,
      canDeactivate: [CanDeactivateGuard]  // 使用守卫
   }
];

@NgModule({
   imports: [RouterModule.forRoot(routes)],
   exports: [RouterModule]
})
export class AppRoutingModule {}

```

### CanLoad

`CanLoad` 守卫用于在懒加载模块时进行检查，确保只有在满足某些条件下才允许加载该模块。它通常用于懒加载模块的权限控制。如果用户没有权限或未登录，`CanLoad` 可以阻止模块加载，避免加载不必要的资源。

```typescript
// can-load.guard.ts
import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CanLoadGuard implements CanLoad {

  constructor(private authService: AuthService, private router: Router) {}

  canLoad(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean> | Promise<boolean> | boolean {
    
    if (this.authService.isAuthenticated()) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}

```

然后在懒加载模块的路由配置中使用 `CanLoad` 守卫：

```typescript
// app-routing.module.ts
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    canLoad: [CanLoadGuard]  // 使用 CanLoad 守卫
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

```

### Resolve

`Resolve` 守卫用于在路由激活之前预先加载数据，确保组件渲染之前数据已经准备好。

通常会调用一个服务来获取数据，然后在服务中实现 `Resolve` 接口：

```typescript
// data-resolver.service.ts
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { DataService } from './data.service';  // 假设有一个服务提供数据

@Injectable({
   providedIn: 'root'
})
export class DataResolver implements Resolve<any> {

   constructor(private dataService: DataService) {}

   resolve(): Observable<any> {
      return this.dataService.getData();  // 返回需要加载的数据
   }
}

```

配置路由时使用 resolve：

```typescript
// app-routing.module.ts
import { Routes, RouterModule } from '@angular/router';
import { DataResolver } from './data-resolver.service';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
   {
      path: 'dashboard',
      component: DashboardComponent,
      resolve: {
         data: DataResolver  // 使用 resolve 守卫
      }
   }
];

@NgModule({
   imports: [RouterModule.forRoot(routes)],
   exports: [RouterModule]
})
export class AppRoutingModule {}

```

在组件中，通过 `ActivatedRoute` 来访问预加载的数据：

```typescript
// dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
   selector: 'app-dashboard',
   templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {

   data: any;

   constructor(private route: ActivatedRoute) {}

   ngOnInit(): void {
      this.data = this.route.snapshot.data['data'];  // 获取 resolve 中的数据
   }
}

```

## 路由事件

路由事件 (`RouterEvent`) 是指与路由相关的各种操作发生时触发的事件。通过监听这些事件，可以执行一些特定的操作，如路由开始时的动画效果、在路由切换时获取日志信息、监控路由生命周期等。

常用的路由事件：

- `NavigationStart`: 当路由开始导航时触发。
- `NavigationEnd`: 当路由导航完成时触发。
- `NavigationCancel`: 如果导航被取消时触发。
- `NavigationError`: 如果导航出错时触发。
- `RoutesRecognized`: 当路由的目标路径已经解析完毕时触发。
- `ChildActivationStart`: 当子路由激活开始时触发。
- `ChildActivationEnd`: 当子路由激活结束时触发。
- `ActivationStart`: 当路由激活开始时触发。
- `ActivationEnd`: 当路由激活结束时触发。
- `DeactivationStart`: 当路由停用开始时触发。
- `DeactivationEnd`: 当路由停用结束时触发。

### 显示加载指示器

如果要实现在导航开始时显示一个加载器，并在导航完成时隐藏它。可以通过订阅 `NavigationStart` 和 `NavigationEnd` 事件来实现。

```typescript
import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  loading: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.loading = true;  // 显示加载指示器
      }
      if (event instanceof NavigationEnd) {
        this.loading = false;  // 隐藏加载指示器
      }
    });
  }
}

```
