---
title: 服务
weight: 8
---

# 创建服务

```javascript
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TestService { }
```

使用：

```javascript
export class AppComponent {
    // 这里的 TestService 实际上就是获取示例对象的 Token（唯一标识）
 	constructor (private _test: TestService) {}
}
```

# 服务的作用域

使用服务可以轻松实现跨模块跨组件共享数据，这取决于服务的作用域。

1. 在根注入器中注册服务，所有模块使用同一个服务实例对象。

   ```javascript
   import { Injectable } from '@angular/core';
   
   @Injectable({
     providedIn: 'root'
   })
   
   export class CarListService {
   }
   ```

2. 在模块级别注册服务，该模块中的所有组件使用同一个服务实例对象。

   新语法：
   ```javascript
   import { Injectable } from '@angular/core';
   import { CarModule } from './car.module';
   
   @Injectable({
     providedIn: CarModule,
   })
   
   export class CarListService {
   }
   ```
   
   老语法：
   ```javascript
   import { CarListService } from './car-list.service';
   
   @NgModule({
     providers: [CarListService],
   })
   export class CarModule {
   }
   ```

3. 在组件级别注册服务，该组件及其子组件使用同一个服务实例对象。

   ```javascript
   import { Component } from '@angular/core';
   import { CarListService } from '../car-list.service.ts'
   
   @Component({
     selector:    'app-car-list',
     templateUrl: './car-list.component.html',
     providers:  [CarListService]
   })
   ```
