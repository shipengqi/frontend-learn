# rxjs

## 可观察对象（Observable）

使用可观察对象（Observable）来传递值，推荐把它们用于事件处理、异步编程以及处理多个值等场景。

一个 `Observable` 的实例，其中定义了一个订阅者（`subscriber`）函数。当有消费者调用 `subscribe()` 方法时，这个函数就会执行。

`subscribe()` 方法，要传入一个观察者（observer）。它定义了你收到的这些消息的处理器（handler）。

`subscribe()` 调用会返回一个 `Subscription` 对象，具有一个 `unsubscribe()` 方法。当调用该方法时，你就会停止接收通知。

### 观察者

`Observer` 接口：

- `next` 必要。用来处理每个送达值。
- `error` 可选。用来处理错误通知。**错误会中断这个可观察对象实例的执行过程**。
- `complete` 可选。用来处理执行完毕（complete）通知。当执行完毕后，这些值就会继续传给下一个处理器。

### 创建可观察对象

快速创建一些常用的可观察对象的 RXJS 方法：
- `of(...items)` 返回一个 `Observable` 实例，它用同步的方式把参数中提供的这些值发送出来。
- `from(iterable)` 把它的参数转换成一个 `Observable` 实例。该方法通常用于把一个数组转换成一个（发送多个值的）可观察对象。

```typescript
// Create simple observable that emits three values
const myObservable = of(1, 2, 3);

// Create observer object
const myObserver = {
  next: (x: number) => console.log('Observer got a next value: ' + x),
  error: (err: Error) => console.error('Observer got an error: ' + err),
  complete: () => console.log('Observer got a complete notification'),
};

// Execute with the observer object
myObservable.subscribe(myObserver);

// Logs:
// Observer got a next value: 1
// Observer got a next value: 2
// Observer got a next value: 3
// Observer got a complete notification
```

与上面 `of(1, 2, 3)` 等价的方式：
```typescript
// This function runs when subscribe() is called
function sequenceSubscriber(observer: Observer<number>) {
  // synchronously deliver 1, 2, and 3, then complete
  observer.next(1);
  observer.next(2);
  observer.next(3);
  observer.complete();

  // unsubscribe function doesn't need to do anything in this
  // because values are delivered synchronously
  return {unsubscribe() {}};
}

// Create a new Observable that will deliver the above sequence
const sequence = new Observable(sequenceSubscriber);

// execute the Observable and print the result of each notification
sequence.subscribe({
  next(num) { console.log(num); },
  complete() { console.log('Finished sequence'); }
});

// Logs:
// 1
// 2
// 3
// Finished sequence
```


### 多播

典型的可观察对象会为每一个观察者创建一次新的、独立的执行。当观察者进行订阅时，该可观察对象会连上一个事件处理器，并且向那个观察者发送
一些值。当第二个观察者订阅时，这个可观察对象就会连上一个新的事件处理器，并独立执行一次，把这些值发送给第二个可观察对象。

有时候，不应该对每一个订阅者都独立执行一次，你可能会希望每次订阅都得到同一批值。

**多播用来让可观察对象在一次执行中同时广播给多个订阅者**。不必注册多个监听器，而是复用第一个（next）监听器，并且把值发送给各个订阅者。

```typescript
function sequenceSubscriber(observer: Observer<number>) {
  const seq = [1, 2, 3];
  let timeoutId: any;

  // Will run through an array of numbers, emitting one value
  // per second until it gets to the end of the array.
  function doInSequence(arr: number[], idx: number) {
    timeoutId = setTimeout(() => {
      observer.next(arr[idx]);
      if (idx === arr.length - 1) {
        observer.complete();
      } else {
        doInSequence(arr, ++idx);
      }
    }, 1000);
  }

  doInSequence(seq, 0);

  // Unsubscribe should clear the timeout to stop execution
  return {
    unsubscribe() {
      clearTimeout(timeoutId);
    }
  };
}

// Create a new Observable that will deliver the above sequence
const sequence = new Observable(sequenceSubscriber);

sequence.subscribe({
  next(num) { console.log(num); },
  complete() { console.log('Finished sequence'); }
});

// Logs:
// (at 1 second): 1
// (at 2 seconds): 2
// (at 3 seconds): 3
// (at 3 seconds): Finished sequence
```

**如果你订阅了两次，就会有两个独立的流，每个流都会每秒发出一个数字**。

```typescript
// Subscribe starts the clock, and will emit after 1 second
sequence.subscribe({
  next(num) { console.log('1st subscribe: ' + num); },
  complete() { console.log('1st sequence finished.'); }
});

// After 1/2 second, subscribe again.
setTimeout(() => {
  sequence.subscribe({
    next(num) { console.log('2nd subscribe: ' + num); },
    complete() { console.log('2nd sequence finished.'); }
  });
}, 500);

// Logs:
// (at 1 second): 1st subscribe: 1
// (at 1.5 seconds): 2nd subscribe: 1
// (at 2 seconds): 1st subscribe: 2
// (at 2.5 seconds): 2nd subscribe: 2
// (at 3 seconds): 1st subscribe: 3
// (at 3 seconds): 1st sequence finished
// (at 3.5 seconds): 2nd subscribe: 3
// (at 3.5 seconds): 2nd sequence finished
```

修改这个可观察对象以支持多播：

```typescript
function multicastSequenceSubscriber() {
  const seq = [1, 2, 3];
  // Keep track of each observer (one for every active subscription)
  const observers: Observer<unknown>[] = [];
  // Still a single timeoutId because there will only ever be one
  // set of values being generated, multicasted to each subscriber
  let timeoutId: any;

  // Return the subscriber function (runs when subscribe()
  // function is invoked)
  return (observer: Observer<unknown>) => {
    observers.push(observer);
    // When this is the first subscription, start the sequence
    if (observers.length === 1) {
      const multicastObserver: Observer<number> = {
        next(val) {
          // Iterate through observers and notify all subscriptions
          observers.forEach(obs => obs.next(val));
        },
        error() { /* Handle the error... */ },
        complete() {
          // Notify all complete callbacks
          observers.slice(0).forEach(obs => obs.complete());
        }
      };
      doSequence(multicastObserver, seq, 0);
    }

    return {
      unsubscribe() {
        // Remove from the observers array so it's no longer notified
        observers.splice(observers.indexOf(observer), 1);
        // If there's no more listeners, do cleanup
        if (observers.length === 0) {
          clearTimeout(timeoutId);
        }
      }
    };

    // Run through an array of numbers, emitting one value
    // per second until it gets to the end of the array.
    function doSequence(sequenceObserver: Observer<number>, arr: number[], idx: number) {
      timeoutId = setTimeout(() => {
        console.log('Emitting ' + arr[idx]);
        sequenceObserver.next(arr[idx]);
        if (idx === arr.length - 1) {
          sequenceObserver.complete();
        } else {
          doSequence(sequenceObserver, arr, ++idx);
        }
      }, 1000);
    }
  };
}

// Create a new Observable that will deliver the above sequence
const multicastSequence = new Observable(multicastSequenceSubscriber());

// Subscribe starts the clock, and begins to emit after 1 second
multicastSequence.subscribe({
  next(num) { console.log('1st subscribe: ' + num); },
  complete() { console.log('1st sequence finished.'); }
});

// After 1 1/2 seconds, subscribe again (should "miss" the first value).
setTimeout(() => {
  multicastSequence.subscribe({
    next(num) { console.log('2nd subscribe: ' + num); },
    complete() { console.log('2nd sequence finished.'); }
  });
}, 1500);

// Logs:
// (at 1 second): Emitting 1
// (at 1 second): 1st subscribe: 1
// (at 2 seconds): Emitting 2
// (at 2 seconds): 1st subscribe: 2
// (at 2 seconds): 2nd subscribe: 2
// (at 3 seconds): Emitting 3
// (at 3 seconds): 1st subscribe: 3
// (at 3 seconds): 1st sequence finished
// (at 3 seconds): 2nd subscribe: 3
// (at 3 seconds): 2nd sequence finished
```


### 错误处理

可观察对象会异步生成值，所以用 `try/catch` 是无法捕获错误的。你应该在观察者中指定一个 `error` 回调来处理错误。

发生错误时还会导致可观察对象清理现有的订阅，并且停止生成值。可观察对象可以生成值（调用 `next` 回调），也可以调用 `complete` 或 `error` 回调来主动结束。


## 创建可观察对象的函数

```typescript
import { from, Observable } from 'rxjs';

// Create an Observable out of a promise
const data = from(fetch('/api/endpoint'));
// Subscribe to begin listening for async result
data.subscribe({
  next(response) { console.log(response); },
  error(err) { console.error('Error: ' + err); },
  complete() { console.log('Completed'); }
});
```

```typescript
import { interval } from 'rxjs';

// Create an Observable that will publish a value on an interval
const secondsCounter = interval(1000);
// Subscribe to begin publishing values
const subscription = secondsCounter.subscribe(n =>
  console.log(`It's been ${n + 1} seconds since subscribing!`));
```

```typescript
import { fromEvent } from 'rxjs';

const el = document.getElementById('my-element')!;

// Create an Observable that will publish mouse movements
const mouseMoves = fromEvent<MouseEvent>(el, 'mousemove');

// Subscribe to start listening for mouse-move events
const subscription = mouseMoves.subscribe(evt => {
  // Log coords of mouse movements
  console.log(`Coords: ${evt.clientX} X ${evt.clientY}`);

  // When the mouse is over the upper-left of the screen,
  // unsubscribe to stop listening for mouse movements
  if (evt.clientX < 40 && evt.clientY < 40) {
    subscription.unsubscribe();
  }
});
```

```typescript
import { Observable } from 'rxjs';
import { ajax } from 'rxjs/ajax';

// Create an Observable that will create an AJAX request
const apiData = ajax('/api/data');
// Subscribe to create the request
apiData.subscribe(res => console.log(res.status, res.response));
```

## 操作符函数

操作符接受一些配置项，然后返回一个以**可观察对象为参数的函数**。当执行这个返回的函数时，这个操作符会操作**可观察对象**中发出的值，转换它们，并返回由转换后的值组成的新的可观察对象

```typescript
import { of } from 'rxjs';
import { map } from 'rxjs/operators';

const nums = of(1, 2, 3);

const squareValues = map((val: number) => val * val);
const squaredNums = squareValues(nums);

squaredNums.subscribe(x => console.log(x));

// Logs
// 1
// 4
// 9
```

常用操作符：
可以**使用管道 `pipe()` 来把这些操作符链接起来**。并且返回一个新的函数，当执行这个新函数时，就会顺序执行那些被组合进去的函数。

- 创建 from, fromEvent, of
- 组合 combineLatest, concat, merge, startWith , withLatestFrom, zip
- 过滤 debounceTime, distinctUntilChanged, filter, take, takeUntil
- 转换 bufferTime, concatMap, map, mergeMap, scan, switchMap
- 工具 tap
- 多播 share

### 错误处理

除了可以在订阅时提供 `error()` 处理器外，RxJS 还提供了 `catchError` 操作符，允许在管道中处理已知错误。

如果服务器返回了错误或值不存在，就会生成一个错误。**如果捕获这个错误并提供了一个默认值，流就会继续处理这些值，而不会报错**。

```typescript
import { Observable, of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { map, catchError } from 'rxjs/operators';

// Return "response" from the API. If an error happens,
// return an empty array.
const apiData = ajax('/api/data').pipe(
  map((res: any) => {
    if (!res.response) {
      throw new Error('Value expected!');
    }
    return res.response;
  }),
  catchError(() => of([]))
);

apiData.subscribe({
  next(x: T) { console.log('data: ', x); },
  error() { console.log('errors already caught... will not run'); }
});
```

### 重试失败的可观察对象

`catchError` 提供了一种简单的方式进行恢复，而 `retry` 操作符让你可以重试失败的请求。

可以在 `catchError` 之前使用 `retry` 操作符。它会订阅到原始的来源可观察对象，它可以重新运行导致结果出错的动作序列。
如果其中包含 HTTP 请求，它就会重新发起那个 HTTP 请求。

在捕获错误之前重发请求：
```typescript
import { Observable, of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { map, retry, catchError } from 'rxjs/operators';

const apiData = ajax('/api/data').pipe(
  map((res: any) => {
    if (!res.response) {
      console.log('Error occurred.');
      throw new Error('Value expected!');
    }
    return res.response;
  }),
  retry(3), // Retry up to 3 times before failing
  catchError(() => of([]))
);

apiData.subscribe({
  next(x: T) { console.log('data: ', x); },
  error() { console.log('errors already caught... will not run'); }
});
```

### 过滤操作符

#### take

`take` 是最简单的过滤操作符，它的意思是取 `n` 个值，传入的参数为取的个数：

```typescript
interval(1000).pipe(take(3)).subscribe(x => console.log(x));
// 0
// 1
// 2
```

#### takeLast

取最后的 n 个值，`takeLast` 会将值缓存在内存中，等到流结束时取最后的值，它不可以用于不会终止的流，在无尽的流上使用 `takeLast` 永远不会发出数据。

```typescript
range(1, 100).pipe(takeLast(3)).subscribe(x => console.log(x));
```

#### takeUtil

`takeUntil` 接收一个终止 `Observable`，当终止 `Observable` 产生数据时，原始 `Observable` 会停止：

```typescript
interval(1000).pipe(takeUntil(fromEvent(document, 'click'))).subscribe(x => console.log(x));
```

`click` 事件发生后会停止定时数据打印。

takeUntil 是一个很有用的操作符，比如停止订阅：我们在一个页面或组件中可能创建很多订阅，我们需要在卸载时销毁订阅，有了 `takeUntil`，我们就可以在添加订
阅时设置统一的 takeUntil 条件，在卸载时触发这个条件停止所有的事件订阅。


#### takeWhile

`takeWhile` 是当满足条件时取值，一旦遇到不满足条件的数据时直接终止：

```typescript
of(2, 3, 4, 5, 6).pipe(takeWhile(x => x < 4)).subscribe(console.log);
// 2
// 3
```

#### skip

`skip` 是与 `take` 相反的操作符，`skip` 的意思是跳过，使用 `skip` 可以实现跳过 n 个数据不取：

```typescript
of(1, 2, 3, 4, 5).pipe(skip(3)).subscribe(console.log);
// 4
// 5
```

#### skipLast

`skipLast` 为跳过后面 n 个值，它的实现和 `takeLast` 类似，当数据发送完成后跳过最后的值发出其他的值：

```typescript
of(1, 2, 3, 4, 5).pipe(skipLast(2)).subscribe(x => console.log(x));
// 1
// 2
// 3
```

#### skipUtil

`skipUntil` 也是接收一个终止 `Observable`，当终止 `Observable` 产生数据时停止跳过，即从终止 `Observable` 发数据之后开始正式取值：

```typescript
interval(1000).pipe(skipUntil(fromEvent(document, 'click'))).subscribe(x => console.log(x));
```

#### skipWhile

`skipWhile` 是当满足条件时跳过，一旦遇到不满足条件时开始发出：

```typescript
of(2, 3, 4, 5, 6).pipe(skipWhile(x => x < 4)).subscribe(console.log);
// 4
// 5
// 6
```

#### first

`first` 也是很常用的操作，意思是只取一个，实际上就是 `take(1)` 的效果：

```typescript
of(1, 2, 3, 4).pipe(first()).subscribe(console.log);
// 1
```

#### last

`last` 与 `first` 的效果是相反的，它是取最后一个，也就是 `takeLast(1)` 的效果：

```typescript
of(1, 2, 3, 4).pipe(last()).subscribe(console.log);
// 4
```


#### filter

`filter` 是按照条件来过滤：

```typescript
of(0, 1, 2, 3, 4).pipe(filter(x => x % 2 === 1)).subscribe(console.log);
// 1
// 3
```

#### elementAt

`elementAt` 类似数组的下标索引，表示输出指定 `index` 的值：

```typescript
fromEvent(document, 'click').pipe(elementAt(2)).subscribe(x => console.log(x));
```

可以在第三次 click 时看到打印。

#### ignoreElements

忽略全部内容，只传递异常和结束信息，可以用于不关注数据只关注异常的场景：

```typescript
of(1, 2, 3, 4).pipe(ignoreElements()).subscribe(
  v => console.log(v),
  err => console.log('err:', err),
  () => console.log('end'),
);
// end
```

## 可观察对象的命名约定

通常以 `$` 符号结尾。


## 应用

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

### 指数化退避

指数化退避是一种失败后重试 API 的技巧，它会在每次连续的失败之后让重试时间逐渐变长，超过最大重试次数之后就会彻底放弃。

```typescript
import { of, pipe, range, throwError, timer, zip } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { map, mergeMap, retryWhen } from 'rxjs/operators';

export function backoff(maxTries: number, delay: number) {
  return pipe(
    retryWhen(attempts =>
      zip(range(1, maxTries + 1), attempts).pipe(
        mergeMap(([i, err]) => (i > maxTries) ? throwError(err) : of(i)),
        map(i => i * i),
        mergeMap(v => timer(v * delay)),
      ),
    ),
  );
}

ajax('/api/endpoint')
  .pipe(backoff(3, 250))
  .subscribe(function handleData(data) { /* ... */ });
```


## Subject

在 RxJS 中有四种 Subject 分别是：Subject，BehaviorSubject，AsyncSubject，ReplaySubject；这四种 Subject 都是特殊的 Observable。

Subject 既是 `Observable` 也是 `Observer`

```typescript
import { Subject } from 'rxjs';

const subject = new Subject<number>();

subject.subscribe({
  next: (v) => console.log(`observerA: ${v}`),
});
subject.subscribe({
  next: (v) => console.log(`observerB: ${v}`),
});

subject.next(1);
subject.next(2);

// Logs:
// observerA: 1
// observerB: 1
// observerA: 2
// observerB: 2
```

**Subject 是多播的**。


### BehaviorSubject

BehaviorSubject，它有一个“当前值”的概念。它保存了发送给消费者的最新值，当有新的观察者订阅时，会立即从 BehaviorSubject 那接收到“当前值”，
在定义一个 BehaviorSubject 时需要有初始值。

```typescript
import { BehaviorSubject } from 'rxjs';
const subject = new BehaviorSubject(0); // 0 is the initial value

subject.subscribe({
  next: (v) => console.log(`observerA: ${v}`),
});

subject.next(1);
subject.next(2);

subject.subscribe({
  next: (v) => console.log(`observerB: ${v}`),
});

subject.next(3);

// Logs
// observerA: 0
// observerA: 1
// observerA: 2
// observerB: 2
// observerA: 3
// observerB: 3
```


### ReplaySubject

类似于 BehaviorSubject，区别是不仅是‘当前值’，之前的旧值也可以发送给新的订阅者。ReplaySubject 会记录多个值，并重放给新的订阅者。

```typescript
import { ReplaySubject } from 'rxjs';
const subject = new ReplaySubject(3); // buffer 3 values for new subscribers

subject.subscribe({
  next: (v) => console.log(`observerA: ${v}`),
});

subject.next(1);
subject.next(2);
subject.next(3);
subject.next(4);

subject.subscribe({
  next: (v) => console.log(`observerB: ${v}`),
});

subject.next(5);

// Logs:
// observerA: 1
// observerA: 2
// observerA: 3
// observerA: 4
// observerB: 2
// observerB: 3
// observerB: 4
// observerA: 5
// observerB: 5
```

除了缓冲区大小之外，还可以指定一个以毫秒为单位的窗口时间，以确定记录的数值可以有多长时间。

```typescript
import { ReplaySubject } from 'rxjs';
const subject = new ReplaySubject(100, 500 /* windowTime 500ms */);

subject.subscribe({
  next: (v) => console.log(`observerA: ${v}`),
});

let i = 1;
setInterval(() => subject.next(i++), 200);

setTimeout(() => {
  subject.subscribe({
    next: (v) => console.log(`observerB: ${v}`),
  });
}, 1000);

// Logs
// observerA: 1
// observerA: 2
// observerA: 3
// observerA: 4
// observerA: 5
// observerB: 3
// observerB: 4
// observerB: 5
// observerA: 6
// observerB: 6
// ...
```

### AsyncSubject

只有当 Observable 执行完成时(执行 `complete()`)，它才会将执行的最后一个值发送给观察者。 类似 `last()` 操作符。

```typescript
import { AsyncSubject } from 'rxjs';
const subject = new AsyncSubject();

subject.subscribe({
  next: (v) => console.log(`observerA: ${v}`),
});

subject.next(1);
subject.next(2);
subject.next(3);
subject.next(4);

subject.subscribe({
  next: (v) => console.log(`observerB: ${v}`),
});

subject.next(5);
subject.complete();

// Logs:
// observerA: 5
// observerB: 5
```

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
