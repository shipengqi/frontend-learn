# 路由

## 路由器事件

在每次导航过程中，路由器都会通过 `Router.events` 属性发出导航事件。这些事件如下表所示。

- [NavigationStart](https://angular.dev/api/router/NavigationStart) ：导航开始。
- [RouteConfigLoadStart](https://angular.dev/api/router/RouteConfigLoadStart) ：在路由器 lazy loads 之前进行路由配置。
- [RouteConfigLoadEnd](https://angular.dev/api/router/RouteConfigLoadEnd) ：延迟加载路由后。
- [RoutesRecognized](https://angular.dev/api/router/RoutesRecognized) ：当路由器解析 URL 并识别路由时。
- [GuardsCheckStart](https://angular.dev/api/router/GuardsCheckStart) ：当路由器开始路由的保护阶段时。
- [ChildActivationStart](https://angular.dev/api/router/ChildActivationStart) ：当路由器开始激活路由的子级时。
- [ActivationStart](https://angular.dev/api/router/ActivationStart) ：当路由器开始激活路由时。
- [GuardsCheckEnd](https://angular.dev/api/router/GuardsCheckEnd) ：当路由器成功完成路由的保护阶段时。
- [ResolveStart](https://angular.dev/api/router/ResolveStart) ：当路由器开始路由的解析阶段时。
- [ResolveEnd](https://angular.dev/api/router/ResolveEnd) ：当路由器成功完成路由的解析阶段时。
- [ChildActivationEnd](https://angular.dev/api/router/ChildActivationEnd) ：当路由器完成激活路由的子级时。
- [ActivationEnd](https://angular.dev/api/router/ActivationEnd) ：当路由器完成激活路由时。
- [NavigationEnd](https://angular.dev/api/router/NavigationEnd) ：当导航成功结束时。
- [NavigationCancel](https://angular.dev/api/router/NavigationCancel) ：当取消导航时。
- [NavigationError](https://angular.dev/api/router/NavigationError) ：当导航由于意外错误而失败时。
- [Scroll](https://angular.dev/api/router/Scroll) ：当用户滚动时。

## 路由守卫

有时候需要控制对该应用的不同路由的访问。可能包括如下场景：

1. 该用户可能无权导航到目标组件
2. 可能用户得先登录（认证）
3. 在显示目标组件前，你可能得先获取某些数据
4. 在离开组件前，你可能要先保存修改
5. 你可能要询问用户：你是否要放弃本次更改，而不用保存它们？

守卫可以返回一个值，以控制路由器的行为：

- `true` 导航过程会继续
- `false` 导航过程就会终止，且用户留在原地。
- `UrlTree` 取消当前导航，并开始导航到所返回的 UrlTree

守卫可以用同步的方式返回一个布尔值。但在很多情况下，守卫无法用同步的方式给出答案。守卫可能会向用户问一个问题、把更改保存到服务器，或者获
取新数据，而这些都是异步操作。

因此，路由的守卫可以返回一个 `Observable<boolean>` 或 `Promise<boolean>`，并且路由器会等待这个可观察对象被解析为 `true` 或 `false`。

路由器可以支持多种守卫接口：

- `canActivate` 导航到某路由时介入
- `canActivateChild` 导航到某个子路由时介入
- `canDeactivate` 从当前路由离开时介入
- `resolve` 在某路由激活之前获取路由数据
- `canLoad` 导航到某个异步加载的特性模块时介入
- `canMatch` 控制是否应该使用 `Route` ，即使 `path` 与 `URL` 段匹配。

在分层路由的每个级别上，你都可以设置多个守卫。路由器会先按照**从最深的子路由由下往上检查的顺序来检查 `canDeactivate()` 守卫**。
然后它会按照**从上到下的顺序检查 `canActivate()` 守卫**。如果特性模块是异步加载的，在加载它之前还会检查 `canLoad()` 守卫。

除 `canMatch` 之外，如果任何一个守卫返回 `false`，其它尚未完成的守卫会被取消，这样整个导航就被取消了。如果 `canMatch` 守卫返回 `false`，那
么 `Router` 就会继续处理这些 `Routes` 的其余部分，以查看是否有别的 `Route` 配置能匹配此 `URL`。
