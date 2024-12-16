---
title: Subject
weight: 3
---

## 概述

RxJS `Subject` 是一种特殊类型的 `Observable`，它允许将值多播给多个观察者，所以 `Subject` 是多播的，这意味着 `Subject` 确保每个观察者之间共享 `Observable` 的值。

**而普通的 `Observable` 是单播的，它会为每一个观察者创建一次新的、独立的执行。当观察者进行订阅时，该可观察对象会连上一个事件处理器，并且向那个观察者发送一些值。当第二个观察者订阅时，这个可观察对象就会连上一个新的事件处理器，并独立执行一次，把这些值发送给第二个可观察对象**。

在 RxJS 中有四种 Subject 分别是：`Subject`，`BehaviorSubject`，`AsyncSubject`，`ReplaySubject`；这四种 Subject 都是特殊的 `Observable`。

`Subject` 既是 `Observable` 也是 `Observer`。

## Subject

`Subject` 其实是观察者模式的实现，所以当观察者订阅 `Subject` 对象时，它会把订阅者添加到观察者列表中，每当有接收到新值时，它就会遍历观察者列表，依次调用观察者内部的 `next` 方法，把值一一送出。

```typescript
import { Subject } from 'rxjs';

const subject$ = new Subject<number>();

subject$.next(1);

subject$.subscribe({
  next: (v) => console.log(`observerA: ${v}`),
});

subject$.next(2);

subject$.subscribe({
  next: (v) => console.log(`observerB: ${v}`),
});

subject$.next(3);

// Output:
// observerA: 2
// observerA: 3
// observerB: 3
```

1. 创建了一个 `Subject`
2. 发出了一个值 1，但由于此时并没有订阅者，所以这个值不会被订阅到
3. 创建了 observerA
4. 又发出一个值 2，这时候 observerA 会接收到这个值
5. 又创建一个 observerB
6. 最后发出一个值 3，这时候已经订阅的都会接收到这个值

### BehaviorSubject

`BehaviorSubject`，它有一个**当前值**的概念。它保存了发送给消费者的最新值，当有新的观察者订阅时，会立即从 `BehaviorSubject` 那接收到最后发出的值。

在定义一个 `BehaviorSubject` 时需要有初始值。

```typescript
import { BehaviorSubject } from 'rxjs';
const behavior$ = new BehaviorSubject(0); // 0 is the initial value

behavior$.subscribe({
  next: (v) => console.log(`observerA: ${v}`),
});

behavior$.next(1);

behavior$.subscribe({
  next: (v) => console.log(`observerB: ${v}`),
});

behavior$.next(2);

// Output:
// observerA: 0
// observerA: 1
// observerB: 1
// observerA: 2
// observerB: 2
```

1. 创建了一个 `BehaviorSubject` 的实例 `behavior$`，初始值为 0。
2. 然后订阅了这个 `behavior$`，由于 `BehaviorSubject` 的特点是把最新的值发布给订阅者，observerA 会得到初始值 0，所以会输出 `observerA: 0` 
3. `behavior$` 发出一个新的值 1，这时候 observerA 将会收到新的值，输出 `observerA: 1` 
4. 增加一个订阅者 observerB，这时候它会得到最新的值 1，所以输出 `observerB: 1`，
5. 最后再一次发出一个新的值 2，这个时候有两个订阅者 observerA 和 observerB，它们都会接收到新的值 2，所以会输出 `observerA: 2` 和 `observerB: 2`


### ReplaySubject

`ReplaySubject` 有点像 `BehaviorSubject`，区别是不仅是**当前值**，之前的旧值也可以发送给新的订阅者。`ReplaySubject` 会记录多个值，并重放给新的订阅者。

它的第一个参数 `bufferSize` 指定了缓存的大小，默认为 `Infinity`，即缓存所有发出的值。还可以向其传递第二个参数 `windowTime`，指定缓存的时间限制，默认为 `Infinity`，即不限制值的失效时间。

```typescript
import { ReplaySubject } from 'rxjs';
const replay$ = new ReplaySubject(2); // buffer 2 values for new subscribers

replay$.subscribe({
  next: (v) => console.log(`observerA: ${v}`),
});

replay$.next(1);
replay$.next(2);
replay$.next(3);

replay$.subscribe({
  next: (v) => console.log(`observerB: ${v}`),
});

replay$.next(4);

// Output:
// observerA: 1
// observerA: 2
// observerA: 3
// observerB: 2
// observerB: 3
// observerA: 4
// observerB: 4
```

1. 创建了一个 `ReplaySubject` 的实例 `replay$`，并设置缓存为 2.
2. 创建了一个订阅者 observerA 
3. 调用三次的 next 方法，把值发布给订阅者。这时订阅者 observerA 会输出三次
4. 创建一个新的订阅者 observerB，由于 `ReplaySubject` 缓存了两个值，因此它将直接向订阅者 observerB 发出这两个值，订阅者 observerB 打印这两个值。
5. 发出另外一个值 4，这时候 observerA 和 observerB 都接收到值的改变，分别打印这个值。


指定一个以毫秒为单位的窗口时间，示例：

```typescript
import { ReplaySubject } from 'rxjs';
const replay$ = new ReplaySubject(2, 100 /* windowTime 100ms */);

replay$.subscribe({
  next: (v) => console.log(`observerA: ${v}`),
});

let i = 1;
setInterval(() => replay$.next(i++), 200);

setTimeout(() => {
  replay$.subscribe({
    next: (v) => console.log(`observerB: ${v}`),
  });
}, 1000);

// Output:
// observerA: 0
// observerA: 1
// observerA: 2
// observerA: 3
// observerA: 4
// observerB: 4
// observerA: 5
// observerB: 5
// ...
```

1. 创建 `ReplaySubject`并设置缓存为 2，缓存时间不超过 100ms
2. 创建一个 observerA
3. 每 200ms 发出一个新的值。observerA 会接收到发出的所有值
4. 创建一个 observerB，由于是在 1000ms 后进行订阅。这意味着在开始订阅之前，`replay$` 已经发出了 5 个值。在创建 `ReplaySubject` 时，指定最多存储 2 个值，并且不能超过 100ms。这意味着在 1000ms 后，observerB 开始订阅时，由于 `replay$` 是 200ms 发出一个值，因此 observerB 只会接收到 1 个值。

### AsyncSubject

只有当 Observable 执行完成时(执行 `complete()`)，它才会将执行的最后一个值发送给观察者。 类似 `last()` 操作符。

```typescript
import { AsyncSubject } from 'rxjs';
const async$ = new AsyncSubject();

async$.subscribe({
  next: (v) => console.log(`observerA: ${v}`),
});

async$.next(1);
async$.next(2);

async$.subscribe({
  next: (v) => console.log(`observerB: ${v}`),
});

async$.next(3);
async$.complete();

// Logs:
// observerA: 3
// observerB: 3
```

1. 创建 `AsyncSubject` 的实例
2. 创建一个 observerA
3. `async$` 发出 2 个值，但是 observerA 不会有输出。
4. 创建一个 observerB
5. 发出新的值，但是 observerA 和 observerB 都不会有输出。 
6. 执行 `complate` 完成，这时候将最后一个值发送给所有订阅者


### Void subject

有时，subject 的值并不重要，重要的是有一个事件被触发了。

可以声明一个 `void subject`，表示这个值是不相关的。只有事件本身才是重要的。

```typescript
import { Subject } from 'rxjs';

const subject = new Subject(); // Shorthand for Subject<void>

subject.subscribe({
    next: () => console.log('One second has passed'),
});

setTimeout(() => subject.next(), 1000);
```
