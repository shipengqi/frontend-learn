---
title: 概念
weight: 1
---

RxJS：Think of RxJS as Lodash for events。也就是说，RxJS 是一个类似 lodash 的工具库，不过处理的对象是 Events。这里的 Events，可以称之为**流**。

什么是流？例如，代码中每秒会输出一个数据，或者用户每一次对元素的点击，就像是在时间这个维度上，产生了一个数据集。这个数据集不像数组那样，它不是一开始都存在的，而是随着时间的流逝，一个一个数据被输出出来。这种异步行为产生的数据，就可以被称之为一个**流**，在 Rxjs 中，称之为 `Observalbe`（本质其实就是一个数据集合，只是这些数据不一定是一开始就设定好的，而是随着时间而不断产生的）。而 Rxjs，就是为了处理这种流而产生的工具，比如流与流的合并，流的截断，延迟，消抖等等操作。

```typescript
import {interval, map} from 'rxjs';

const sub = interval(1000).pipe(
    map(second => second + 's')
).subscribe(res => {
    console.log(res);
});

// Output:
// 0s
// 2s
// 3s
// 4s
// 5s
// ...
```

利用 `interval` 返回一个 `Observable` 流，每 1 秒产生一个数据，然后交给 `map` 操作符将内容进行转换，最后交过观察者打印结果。

## Observable 的核心

### 创建

```typescript
import { Observable } from 'rxjs';

const observable = new Observable(function subscribe(subscriber) {
    const timer = setInterval(() => {
        // 可以多次调用 next 方法向外发送数据
        subscriber.next('hi');
        subscriber.next('hello');
        // 当所有数据发送完成以后，可以调用 complete 方法终止数据发送
        subscriber.complete();
        clearInterval(timer);
    }, 1000);
});
```

通常会使用创建操作符, `of`、`from`、`interval` 等来创建。

```typescript
import { of, from, fromEvent, fromPromise, bindCallback, bindNodeCallback } from 'rxjs';
// 将一个或多个值转为 Observable
of('foo', 'bar');

// 将数组转为 Observable
from([1, 2, 3]);

// 将事件转为 Observable
fromEvent(document.querySelector('button'), 'click');

// 将 Promise 转为 Observable
fromPromise(fetch('/users'));

// 将回调函数 (最后一个参数是回调函数，比如下面的 cb) 转为 Observable
// fs.exists = (path, cb(exists))
var exists = bindCallback(fs.exists);
exists('file.txt').subscribe(exists => console.log('Does file exist?', exists));

// 将回调函数(最后一个参数得是回调函数，比如下面的 cb) 转为 Observable
// fs.rename = (pathA, pathB, cb(err, result))
var rename = bindNodeCallback(fs.rename);
rename('file.txt', 'else.txt').subscribe(() => console.log('Renamed!'));
```

### 订阅

```typescript
observable.subscribe((x) => console.log(x));
```

订阅 `Observable` 可以理解为启动这个 `Observable 流`，并提供接收数据的回调函数。

**同一个 `Observable` 可以被多次订阅，并且每个观察这都是独立的**。每个 `subscribe` 会启动一个独立的流，并向观察者传递数据。流与流相互独立，互不干扰。

### 执行

Observable 执行可以传递三种类型的值：

- `next` 通知：发送一个值，比如数字、字符串、对象，等等。
- `error` 通知：发送一个错误或异常。
- `complete` 通知：不再发送任何值。

在 `Observable` 执行中, 可能会发送无穷个 `next` 通知。**如果发送的是 `error` 或 `complete` 通知的话，那么之后不会再发送任何通知了**。

```typescript
import { Observable } from 'rxjs';

const observable = new Observable(function subscribe(subscriber) {
    try {
        subscriber.next(1);
        subscriber.next(2);
        subscriber.next(3);
        subscriber.complete();
        subscriber.next(3); // 不会发送
    } catch (err) {
        subscriber.error(err); // 如果捕获到异常会发送一个错误
    }
});
```

### 清理

因为 `Observable` 执行可能会是无限的，并且观察者通常希望能在有限的时间内中止执行，它必须要一种方法来停止执行，以避免浪费计算能力或内存资源。

`observable.subscribe` 会返回一个 `Subscription` 可以用来取消订阅。

```typescript
import { from } from 'rxjs';

const observable = from([10, 20, 30]);
const subscription = observable.subscribe((x) => console.log(x));
// Later:
subscription.unsubscribe();
```

### 可观察对象的命名约定

通常以 `$` 符号结尾。

## Observer

`Observer` 观察者只是一组回调函数的集合，用来消费 `Observable` 发送的数据。

```typescript
const observer = {
  next: x => console.log('Observer got a next value: ' + x),
  error: err => console.error('Observer got an error: ' + err),
  complete: () => console.log('Observer got a complete notification'),
};

observable.subscribe(observer);
```

## Subscription

`Subscription` 通常是 `Observable` 的执行。`Subscription` 有一个重要的方法，即 `unsubscribe`，用来取消 `Observable` 执行。

`Subscription` 还可以合在一起：

```typescript
import { interval } from 'rxjs';

const observable1 = interval(400);
const observable2 = interval(300);

const subscription = observable1.subscribe(x => console.log('first: ' + x));
const childSubscription = observable2.subscribe(x => console.log('second: ' + x));

subscription.add(childSubscription);

setTimeout(() => {
    // subscription 和 childSubscription 都会取消订阅
  subscription.unsubscribe();
}, 1000);
```

`Subscriptions` 还有一个 `remove(otherSubscription)` 方法，用来撤销一个已添加的子 `Subscription`。
