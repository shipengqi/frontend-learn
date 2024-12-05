# 依赖注入

## 概述

依赖注入 ( Dependency Injection ) 简称 DI，是面向对象编程中的一种设计原则，用来减少代码之间的**耦合度**。

```javascript
class MailService {
  constructor(APIKEY) {}
}

class EmailSender {
  mailService: MailService
  constructor() {
    this.mailService = new MailService("APIKEY1234567890")
  }

  sendMail(mail) {
    this.mailService.sendMail(mail)
  }
}

const emailSender = new EmailSender()
emailSender.sendMail(mail)
```

`EmailSender` 类运行时要依赖 `MailService` 类。

以上写法的耦合度太高，代码并不健壮。如果 `MailService` 类改变了参数的传递方式，在 `EmailSender` 的构造函数中的写法也要跟着改变。

```javascript
class EmailSender {
  mailService: MailService
  constructor(mailService: MailService) {
    this.mailService = mailService;
  }
}
const mailService = new MailService("APIKEY1234567890")
const emailSender = new EmailSender(mailService)
```

在实例化 `EmailSender` 类时将它的依赖项通过 `constructor` 构造函数参数的形式注入到类的内部，这种写法就是**依赖注入**。

通过依赖注入降了代码之间的耦合度，增加了代码的可维护性。`MailService` 类中代码的更改再也不会影响 `EmailSender` 类。

## DI 框架

Angular 有自己的 DI 框架，它将实现依赖注入的过程隐藏了，对于开发者来说只需使用很简单的代码就可以使用复杂的依赖注入功能。

在 Angular 的 DI 框架中有四个核心概念：

1. `Dependency`：组件要依赖的实例对象，服务实例对象
2. `Token`：获取服务实例对象的唯一标识
3. `Injector`：注入器，负责创建维护服务类的实例对象并向组件中注入服务实例对象。
4. `Provider`：配置注入器的对象，指定创建服务实例对象的服务类和获取实例对象的标识。

### 注入器 Injectors

注入器负责创建服务类实例对象，并将服务类实例对象注入到需要的组件中。

1. 创建注入器

   ```javascript
   import { ReflectiveInjector } from "@angular/core"
   // 服务类
   class MailService {}
   // 创建注入器并传入服务类
   // 服务实例对象的标识，默认就是类的名字
   const injector = ReflectiveInjector.resolveAndCreate([MailService])
   ```

2. 获取注入器中的服务类实例对象

   ```javascript
   const mailService = injector.get(MailService)
   ```

3. 服务实例对象为单例模式，注入器在创建服务实例后会对其进行缓存

   ```javascript
   const mailService1 = injector.get(MailService)
   const mailService2 = injector.get(MailService)
   
   console.log(mailService1 === mailService2) // true
   ```

4. 不同的注入器返回不同的服务实例对象

   ```javascript
   const injector = ReflectiveInjector.resolveAndCreate([MailService])
   // 创建一个子注入器
   const childInjector = injector.resolveAndCreateChild([MailService])
   
   const mailService1 = injector.get(MailService)
   const mailService2 = childInjector.get(MailService)
   
   console.log(mailService1 === mailService2) // false
   ```

5. 服务实例的查找类似函数作用域链，当前级别可以找到就使用当前级别，当前级别找不到去父级中查找

   ```javascript
   const injector = ReflectiveInjector.resolveAndCreate([MailService])
   // 创建一个子注入器
   const childInjector = injector.resolveAndCreateChild([])
   
   const mailService1 = injector.get(MailService)
   // 由于子级注入器没有 MailService，就会去父级注入器查找，所以这里拿到的 MailService 是属于父级注入器的
   const mailService2 = childInjector.get(MailService)
   
   console.log(mailService1 === mailService2) // true
   ```


### 提供者 Provider

1. 配置注入器的对象，通过 Provider 就可以让注入器知道使用哪个类来创建实例对象，访问这个实例对象的唯一标识是什么。

   ```javascript
   const injector = ReflectiveInjector.resolveAndCreate([
     { provide: MailService, useClass: MailService }
   ])
   ```
   
   - `useClass`：创建实例对象所使用的类。
   - `provide`：`Token` 访问实例对象的唯一标识

2. 访问依赖对象的标识也可以是字符串类型

   ```javascript
   const injector = ReflectiveInjector.resolveAndCreate([
     { provide: "mail", useClass: MailService }
   ])
   const mailService = injector.get("mail")
   ```

3. `useValue`

   ```javascript
   const injector = ReflectiveInjector.resolveAndCreate([
     {
       provide: "Config",
       // Object.freeze 冻结对象，不允许外部修改
       useValue: Object.freeze({
         APIKEY: "API1234567890",
         APISCRET: "500-400-300"
       })
     }
   ])
   const Config = injector.get("Config")
   ```
   使用 `useClass` 注入器缓存的类的实例对象，使用 `useValue` 是缓存一个值。

将实例对象和外部的引用建立了松耦合关系，外部通过标识获取实例对象，只要标识保持不变，内部代码怎么变都不会影响到外部。
