---
title: 实践
weight: 4
---

# 实践

## 优雅的资源释放

对于无限值必须要取消订阅，反之可以不需要。例如监听 DOM 元素的事件：

```typescript
Observable.fromEvent(node, 'input')
  .subscribe(value => {
      console.log(value);
  });
```

因为如果不取消订阅，事件所关联的方法会一直被占用，导致内存泄露。

### 传统方式

```typescript
@Component({
  selector: 'app-demo',
  template: `
  <div>Hello, world!</div>
  `
})
export class GeneralComponent implements OnDestroy {
  private readonly _destroy$ = new Subject<void>();

  private timer; 

  constructor() {
    this.timer = interval(1000).pipe(takeUntil(this._destroy$)).subscribe(console.log);
  }

  ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
```

上面的在组件中定义了一个私有变量 `_destroy$`，是一个 `Subject` 对象，用于在组件销毁时发出信号以释放资源。通过 `takeUntil(this._destroy$)` 操作符来限制 `Observable` 的生命周期，在 `_destroy$` 发出信号时停止发出值。

这种方式虽然使用了 `takeUntil` 来限制 `Observable` 的生命周期，但是仍然需要在 `ngOnDestroy` 钩子中手动调用 `_destroy$.next()` 和 `_destroy$.complete()` 来确保释放资源。容易遗漏而引发错误。


### 继承方式

```typescript
@Directive()
export class BaseComponent implements OnDestroy {
  // protected, not private
  protected readonly _destroy$ = new Subject<void>();

  ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }
}

@Component({
  selector: 'app-demo',
  template: `
  <div>Hello, world!</div>
  `
})
export class GeneralComponent extends BaseComponent {
  constructor() {
    super();

    interval(1000).pipe(takeUntil(this._destroy$)).subscribe(console.log);
  }
}
```

继承方式可以减少了在每个组件中手动管理资源释放的重复性工作。但是导致了派生组件与基类紧密耦合。一个派生类只能继承自一个基类。如果要在不同的组件中共享不同的基础逻辑，就会受到继承单一基类的限制。而且继承方式导致代码的可读性和可维护性下降。

### DestroyRef 机制

```typescript
function destroyRefFactory() {
  const destroy$ = new Subject<void>();
  const destroyRef = inject(DestroyRef);

  destroyRef.onDestroy(() => {
    destroy$.next();
    destroy$.complete();
  })

  return destroy$;
}

@Component({
  selector: 'app-demo',
  template: `
  <div>Hello, world!</div>
  `
})
export class GeneralComponent implements OnDestroy {
  private readonly _destroy$ = destroyRefFactory();

  constructor() {
    interval(1000).pipe(takeUntil(this._destroy$)).subscribe(console.log)
  }
}
```

基于 `DestroyRef` 机制，不需要在组件中手动释放资源。而且不仅限于单一订阅场景，它在多个订阅场景中同样适用。

### 自定义操作符

基于 `DestroyRef` 机制的实现方式简洁灵活，但是仍然需要在组件中声明 `_destroy$`。通过自定义操作符可以将释放资源的逻辑封装在操作符内部，让代码更加整洁，使资源释放与业务逻辑解耦。

```typescript
function takeUntilDestroyed<T>(destroyRef?: DestroyRef): MonoTypeOperatorFunction<T> {
  if (!destroyRef) {
    destroyRef = inject(DestroyRef);
  }

  const destroy$ = new Observable<void>(observer => {
    return destroyRef!.onDestroy(() => {
      observer.next();
      observer.complete();
    });
  })

  return <T>(source: Observable<T>) => {
    return source.pipe(takeUntil(destroy$))
  }
}

@Component({
  selector: 'app-demo',
  template: `
  <div>Hello, world!</div>
  `
})
export class GeneralComponent implements OnDestroy {
  constructor() {
    interval(1000).pipe(takeUntilDestroyed()).subscribe(console.log)
  }
}
```

`@angular/core/rxjs-interop` 中已经提供了 `takeUntilDestroyed` 操作符。

