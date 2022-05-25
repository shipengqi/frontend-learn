# Test

一般测试文件会和代码文件放在一起，例如 `app.component.ts` 和 `app.component.spec.ts` 文件位于同一个文件夹 `app.component` 中。

- 对应的测试容易找到，有缺失很容易看出来
- 临近的测试可以揭示这部分代码如何在上下文中工作
- 修改或移动代码文件时，不容易忽略测试文件

**集成测试**可以测试跨文件夹和模块的多个部分之间的交互。可以放在一个单独的 `test` 的目录。

## 覆盖率

```bash
ng test --no-watch --code-coverage
```

该命令会在项目中创建一个 `/coverage` 目录。打开 `index.html` 文件，可以查看带有源代码和代码覆盖率值的报表。


## TestBed

TestBed 创建了一个动态构造的 Angular 测试模块，用来模拟一个 Angular 的 `@NgModule` 。

`TestBed.configureTestingModule()` 方法接受一个元数据对象，它可以拥有 `@NgModule` 的大部分属性。

要测试某个服务，你可以在元数据属性 `provider`s 中设置一个要测试或模拟的 providers 数组。

```typescript
let service: ValueService;

beforeEach(() => {
  TestBed.configureTestingModule({ providers: [ValueService] });
});
```

调用 `TestBed.inject()` 放大将 provider 注入到测试中。
