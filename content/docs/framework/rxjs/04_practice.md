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


## 避免嵌套

例如实现一个保存表单草稿的功能，如果像下面这样：

```typescript
this.form.valueChanges
    .subscribe((val) => {
        this.http.put(`/api/course/${courseId}`, val).subscribe({
            next: () => {},
            error: () => {}
        });
    });
```

订阅表单的 `valueChanges` 事件，然后创建一个 HTTP observable 去保存对象，这样就形成了多级嵌套。

为了避免这种情况，用一种更简便的方法去做所有的过程：

1. 拿到表单值，然后映射到另一个用于保存的 `Observable`。这会创建一个高阶可观察对象，它的每个值都对应一个保存请求。
2. 接着订阅每个 HTTP `Observable`，然后能直接一步到位获取所有网络请求的响应，这样可以避免嵌套。

#### concat

```typescript
// 用 of 创建两个可观察对象
const series1$ = of('a', 'b');
const series2$ = of('x', 'y');
// concat 连接两个可观察对象
const result$ = concat(series1$, series2$);
result$.subscribe(console.log);
// Output:
// a
// b
// x
// y
```

函数 `of` 将创建的可观察对象会把传入到 `of()` 的值发送出去，当所**有的值都被发出后**才会完成这些可观察对象。

```
---a---b---|->
           ---x---y---|-> 
concat(series1$, series2$)
---a---b---x---y---|-> 
```

竖线 `|` 标记代表可观察对象完成的时间点。

这个过程就是：
1. 两个可观察对象 `series1$` 和 `series2$` 传给函数 `concat`
2. `concat` 会订阅第一个可观察对象 `series1$`，但不会订阅第二个可观察对象 `series2$`
3. `source1$`发送值 `a,b`，它会立即反应到可观察对象 `result$` 的输出中
4. `source1$` 然后就完成了，只有当它完成了，`concat` 才会订阅 `source2$`
5. `source2$` 的值 `x,y` 将开始反应到输出，直至完成
6. 当 `source2$` 完成后，`result$` 也将完成


保存草稿就可以**使用 `concat` 连接可观察对象来实现顺序保存**。

订阅每个 `httpPost$`，然后按顺序处理每个请求的结果：

- 需要一个更高阶映射操作（取得表单值然后把它变成一个 `httpPost$` 可观察对象）
- 使用 `concat` 操作符，连接多个 `httpPost$` 可观察对象，以确保在前一个进行中的保存操作完成之前，不会创建新的 HTTP 保存请求。

```typescript
this.form.valueChanges
    .pipe(
        concatMap(formValue => this.http.put(`/api/course/${courseId}`, 
                                             formValue))
    )
    .subscribe(
       // res =>  ... handle successful save ...,
       // err => ... handle save error ...      
    );
```

使用更高阶映射操作符的第一个好处就是我们不会再有嵌套订阅了。

`concatMap` 在映射新的值到 HTTP 可观察对象之前会等待前一个 HTTP可观察对象完成，然后订阅它，从而触发下一个保存。

#### merge

有一些场景，想要**并行**执行操作，不等待前一个内部可观察对象完成。那就可以使用 `merge`。`merge` 同时订阅每个被合并的可观察对象，
当多个值到达时，它将把每个源可观察对象的值输出到结果可观察对象中。

```typescript
// 创建两个永不完成的可观察对象 interval Observable
const series1$ = interval(1000).pipe(map(val => val*10));
const series2$ = interval(1000).pipe(map(val => val*100));
// merge 合并两个可观察对象
const result$ = merge(series1$, series2$);
result$.subscribe(console.log);
// Output
// 0
// 0
// 10
// 100
// 20
// 200
// 30
// 300
```

`interval()` 创建的可观察对象将会在一秒钟间隔内发送值 0，1，2 ...，它永远不会完成。

```
---0---1---2---|->
  ---a---b---c---|-> 
merge(series1$, series2$)
---0---a---1---b---2---c---|->
```

合并后的源可观察对象的值会立即显示在输出中。结果可观察对象在所有的合并后的可观察对象完成之后才会完成。


```typescript
this.form.valueChanges
    .pipe(
        mergeMap(formValue => 
                 this.http.put(`/api/course/${courseId}`, 
                               formValue))
    )
    .subscribe(
       // res =>  ... handle successful save ...,
       // err => ... handle save error ...      
    );
```

请求会并发的执行。

#### switch

switch 是另一种 Observable 的合并机制。但是和 `merge` 不同的是，如果一个新的 Observable 开始发出值的话，在订阅新的 Observable 之前，
switch 会**取消订阅前一个 Observable**。

示例：

1. 一个高阶 Observable 发出它的第一个内部 Observable（a-b-c-d），内部 Observable 被订阅（通过 `switch` 策略的实现）
2. 第一个内部 Observable（a-b-c-d）发出值 a 和 b，立即被反应到输出中
3. 紧接着第二个内部 Observable（e-f-g）被发出。它会触发第一个内部 Observable（a-b-c-d）的取消订阅，这是 switch 的关键部
4. 第二个内部 Observable（e-f-g）开始发出新的值，新的值被反应到输出中
5. 第一个内部 Observable（a-b-c-d）虽然仍然在发出新的值 c 和 d，但是 switch 已经取消了订阅，所以这些值不会在输出中
6. 最终的输出结果是 (a-b-e-f-g)

#### exhaust

示例：

1. `exhaust` 订阅了第一个内部 Observable（a-b-c）
2. 正常地，值 a，b 和c 立即被反应到输出中
3. 然后第二个内部 Observable（d-e-f）被发出了
4. 由于第一个 Observable（a-b-c）还未完成，第二个 Observable 通过 exhaust 策略被清除了，它将不会被订阅（这是 exhaust 的关键部分）
5. 仅当第一个 Observable（a-b-c）完成后，exhaust 策略才会订阅新的 Observable
6. 当第三个 Observable（g-h-i）被发出的时候，第一个 Observable（a-b-c）已经完成了，所以第三个 Observable 不会被清除，并且会被订阅
7. 第三个 Observable 的值 g-h-i 会出现在结果 Observable 的输出中，不像值 d-e-f 那样没有出现在输出中

如果我们需要在等待完成的时候按顺序做事，使用 `concatMap`
为了并行处理事情，使用 `mergeMap`
如果需要取消的逻辑，就使用 `switchMap`
当前操作还在进行时，要忽略新的 Observable，使用 `exhaustMap`


## 输入提示

典型的输入提示要完成一系列独立的任务：

1. 从输入中监听数据
2. 移除输入值前后的空白字符，并确认它达到了最小长度
3. 防抖（这样才能防止连续按键时每次按键都发起 API 请求，而应该等到按键出现停顿时才发起）
4. 如果输入值没有变化，则不要发起请求（比如按某个字符，然后快速按退格）
5. 如果已发出的 AJAX 请求的结果会因为后续的修改而变得无效，那就取消它

```typescript
import { fromEvent, Observable } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { debounceTime, distinctUntilChanged, filter, map, switchMap } from 'rxjs/operators';

const searchBox = document.getElementById('search-box') as HTMLInputElement;

const typeahead = fromEvent(searchBox, 'input').pipe(
  map(e => (e.target as HTMLInputElement).value),
  filter(text => text.length > 2),
  debounceTime(10),
  distinctUntilChanged(),
  switchMap(searchTerm => ajax(`/api/endpoint?search=${searchTerm}`))
);

typeahead.subscribe(data => {
  // Handle the data from the API
});
```

