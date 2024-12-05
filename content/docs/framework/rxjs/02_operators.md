---
title: 操作符
weight: 2
---

# 操作符

操作符本质上是一个纯函数 (pure function)，它接收一个 `Observable` 作为输入，并生成一个新的 `Observable` 作为输出。并且前面的 `Observable` 保持不变。

操作符有两类：

- **Pipeable 操作符**：是指可以使用 `observable.pipe(operator)` 或更常用的 `observable.pipe(operatorFactory())` 语法将操作符管道化的操作符。操作符工厂函数包括 `filter(...)` 和 `mergeMap(...)` 等。
- **创建操作符**可以作为独立函数调用，可以创建一个新的 `Observable`。例如：`of(1, 2, 3)`。

## 创建操作符

### range

`range(start, length)`，调用方法后返回 `Observable` 对象，被订阅后会发出指定范围的数值。

```typescript
import { range } from "rxjs"

range(0, 5).subscribe(n => console.log(n))

// Output:
// 0
// 1
// 2
// 3
// 4
```

### of

将参数列表作为数据流返回。

```typescript
of("a", "b", [], {}, true, 20).subscribe(v => console.log(v))

// Output:
// a
// b
// []
// {｝
// true
// 20
```

### from, fromEvent, fromPromise

```typescript
// 将数组转为 Observable
from(["a", "b", "c"]).subscribe(v => console.log(v))

// Output:
// a
// b
// c

// 将事件转为 Observable
fromEvent(document.querySelector('button'), 'click');

// 将 Promise 转为 Observable

function p() {
    return new Promise(function (resolve) {
        resolve([100, 200])
    })
}

fromPromise(p()).subscribe(v => console.log(v))

// Output:
// [100, 200]

fromPromise(fetch('/users'));
```

### interval、timer

**interval**每隔一段时间发出一个数值，数值递增。

```typescript
import {interval, take} from 'rxjs';

const numbers = interval(1000);

const takeFourNumbers = numbers.pipe(take(4));

takeFourNumbers.subscribe(x => console.log('Next: ', x));

// Output:
// Next: 0
// Next: 1
// Next: 2
// Next: 3
```

**timer**间隔时间过去以后发出数值，行为终止，或间隔时间发出数值后，继续按第二个参数的时间间隔继续发出值

```typescript
import { timer } from "rxjs"

timer(2000).subscribe(n => console.log(n))
timer(0, 1000).subscribe(n => console.log(n))
```

### concat

合并数据流，先让第一个数据流发出值，结束后再让第二个数据流发出值，进行整体合并。

```typescript
import {interval, take, range, concat} from 'rxjs';

const timer = interval(1000).pipe(take(4), map(x => `${x}s`));
const sequence = range(1, 10);
const result = concat(timer, sequence);
result.subscribe(x => console.log(x));

// Output:
// 0s-> 1s-> 2s -> 3s -> 1 -> 2 ... -> 10

const timer = interval(1000).pipe(take(2));

concat(timer, timer) // concatenating the same Observable!
    .subscribe({
        next: value => console.log(value),
        complete: () => console.log('...and it is done!')
    });

// Logs:
// 0 after 1s
// 1 after 2s
// 0 after 3s
// 1 after 4s
// '...and it is done!' also after 4s
```

### merge

合并数据流，多个参数一起发出数据流，按照时间线进行交叉合并。

```typescript
import {merge, interval, take, map} from "rxjs";

const timer = interval(1000).pipe(take(3), map(v => 'timer1: ' + v + 's'));
const timer2 = interval(1000).pipe(take(3), map(v => 'timer2: ' + v + 's'));

merge(timer, timer2).subscribe(console.log);

// Output:
// timer1: 0s
// timer2: 0s
// timer1: 1s
// timer2: 1s
// timer1: 2s
// timer2: 2s
```

### combineLatest

将两个 Observable 中最新发出的数据流进行组合成新的数据流，其值由每个输入观测值的最新值计算得出。

```typescript
import { combineLatest, timer } from "rxjs"

const firstTimer = timer(0, 1000) // emit 0, 1, 2... after every second, starting from now
const secondTimer = timer(500, 1000) // emit 0, 1, 2... after every second, starting 0,5s from now
combineLatest(firstTimer, secondTimer).subscribe(console.log)

// Output:
// [0, 0] after 0.5s
// [1, 0] after 1s
// [1, 1] after 1.5s
// [2, 1] after 2s
```

传入字典参数：

```typescript
import { of, delay, startWith, combineLatest } from 'rxjs';

const observables = {
  a: of(1).pipe(delay(1000), startWith(0)),
  b: of(5).pipe(delay(5000), startWith(0)),
  c: of(10).pipe(delay(10000), startWith(0))
};
const combined = combineLatest(observables);
combined.subscribe(value => console.log(value));

// Output:
// { a: 0, b: 0, c: 0 } immediately
// { a: 1, b: 0, c: 0 } after 1s
// { a: 1, b: 5, c: 0 } after 5s
// { a: 1, b: 5, c: 10 } after 10s
```

### zip

将多个 Observable 中的数据流进行组合。其值按顺序从每个输入 Observable 的值中计算得出。

```typescript
import { zip, of } from "rxjs"
import { map } from "rxjs/operators"

let age = of(27, 25, 29)
let name = of("Foo", "Bar", "Beer")
let isDev = of(true, true, false)

zip(name, age, isDev)
  .pipe(map(([name, age, isDev]) => ({ name, age, isDev })))
  .subscribe(console.log)

// { name: 'Foo', age: 27, isDev: true }
// { name: 'Bar', age: 25, isDev: true }
// { name: 'Beer', age: 29, isDev: false }
```

### forkJoin

`forkJoin` 是 RxJS 版本的 `Promise.all()`，即表示等到所有的 Observable 都完成后，才一次性返回值。

传入字典参数：

```typescript
import {forkJoin, of, timer} from 'rxjs';

const observable = forkJoin({
    foo: of(1, 2, 3, 4),
    bar: Promise.resolve(8),
    baz: timer(4000)
});
observable.subscribe({
    next: value => console.log(value),
    complete: () => console.log('This is how it ends!'),
});

// Logs:
// { foo: 4, bar: 8, baz: 0 } after 4 seconds
// 'This is how it ends!' immediately after
```

传入数组参数：

```typescript
const observable = forkJoin([
    of(1, 2, 3, 4),
    Promise.resolve(8),
    timer(4000)
]);
observable.subscribe({
    next: value => console.log(value),
    complete: () => console.log('This is how it ends!'),
});

// Logs:
// [4, 8, 0] after 4 seconds
// 'This is how it ends!' immediately after
```

### throwError

返回可观察对象并向订阅者抛出错误。

```typescript
import { throwError } from "rxjs"

throwError("unknown error").subscribe({ error: console.log })
```

### race

接收并同时执行多个可观察对象，只将最快发出的数据流传递给订阅者。

```typescript
import {interval, map, race} from 'rxjs';

const obs1 = interval(7000).pipe(map(() => 'slow one'));
const obs2 = interval(3000).pipe(map(() => 'fast one'));
const obs3 = interval(5000).pipe(map(() => 'medium one'));

race(obs1, obs2, obs3)
    .subscribe(winner => console.log(winner));

// Outputs
// a series of 'fast one'
```

## Pipeable 操作符

### 转换操作符

#### map

**map**：对数据流进行转换，基于原有值进行转换。

```typescript
import { interval } from "rxjs"
import { map } from "rxjs/operators"

interval(1000)
  .pipe(map(n => n * 2))
  .subscribe(n => console.log(n))
```

#### reduce、scan

**reduce**: 用于将源 Observable 发出的所有的值累计成一个单一的结果。它类似于的数组 `reduce` 方法，但它是处理流的每个值，而不是数组。

```typescript
import { of } from 'rxjs';
import { reduce } from 'rxjs/operators';

// 定义一个源 Observable 发出一些数字
const source$ = of(1, 2, 3, 4, 5);

// 使用 reduce 操作符计算数字的总和
const sum$ = source$.pipe(
    reduce((acc, value) => acc + value, 0)
);

// 订阅并打印输出
sum$.subscribe(result => console.log(result));

// 15
```

`reduce(accumulator, [seed])` 接受两个参数：
- `accumulator` 是一个函数，接受两个参数：
  - `acc`（累计值）：上一次迭代的结果，或者是初始值（如果提供了 `seed`）。
  - `value`：当前发出的值。 该函数需要返回新的累计值。
- `seed`：可选。`acc` 的初始值。如果未提供，`acc` 会默认是流中的第一个值，从第二个值开始累计。

当 `reduce` 接收到源 Observable 的每个值时，会使用 `accumulator` 函数对当前值和累计值进行计算。 等到源 Observable 完成发射所有值时，`reduce` 会将最终的累计值作为结果发射出来。

**scan**：类似 `reduce`，进行累计操作，但执行时机不同，数据源每次发出数据流 `scan` 都会执行。`reduce` 是发送出最终计算的结果，而 `scan` 是发出每次计算的结果。

```typescript
import { of } from 'rxjs';
import { scan } from 'rxjs/operators';

// 定义一个源 Observable 发出一些数字
const source$ = of(1, 2, 3, 4, 5);

// 使用 scan 操作符逐步计算总和
const sum$ = source$.pipe(
    scan((acc, value) => acc + value, 0)
);

// 订阅并打印输出
sum$.subscribe(result => console.log(result));

// 1
// 3
// 6
// 10
// 15
```

### 过滤操作符

#### filter

对数据流进行过滤。

```typescript
import {range} from "rxjs"
import {filter} from "rxjs/operators"

range(1, 10).pipe(filter((n) => n > 5))
    .subscribe((even) => console.log(even));

// Output:
// 6
// 7
// 8
// 9
// 10
```

#### first

获取数据流中的第一个值或者查找数据流中第一个符合条件的值，类似数组中的 `find` 方法。获取到值以后终止行为。

```typescript
import {interval} from "rxjs"
import {first} from "rxjs/operators"

interval(1000)
  .pipe(first())
  .subscribe(n => console.log(n))

interval(1000)
  .pipe(first(n => n === 3))
  .subscribe(n => console.log(n))
```

#### last

获取数据流中的最后一个。**不可以用于不会终止的流**。

```typescript
import {range} from "rxjs"
import {last} from "rxjs/operators"

range(1, 10).pipe(last()).subscribe(console.log)

// 10
```

如果数据源不变成完成状态，则没有最后一个。

```typescript
import {interval} from "rxjs"
import {last} from "rxjs/operators"

interval(1000).pipe(last()).subscribe(console.log)

// 不会有输出，程序会 hang 住
```

#### take、takeWhile、takeUtil、takeLast

**take**：获取数据流中的前几个

```typescript
import { range } from "rxjs"
import { take } from "rxjs/operators"

range(1, 10).pipe(take(3)).subscribe(console.log)

// 1
// 2
// 3
```

**takeWhile**：只要数据源发出的值满足 `takeWhile` 中的条件，就发出该值，一旦不满足，就结束发射。

```typescript
import {range} from "rxjs"
import {takeWhile} from "rxjs/operators"

range(1, 10)
  .pipe(takeWhile(n => n < 5))
  .subscribe(console.log)

// 1
// 2
// 3
// 4
```

**takeUntil**：接收一个可观察对象，当接收的可观察对象发出值时，终止主数据源。

```typescript
import {interval, timer} from "rxjs"
import {takeUntil} from "rxjs/operators"

interval(1000)
    .pipe(takeUntil(timer(5000)))
    .subscribe(console.log)

// 0
// 1
// 2
// 3
```

**takeLast**：获取数据流中最后的一个值，`takeLast` 会将值缓存在内存中，等到流结束时取最后的值。

**它不可以用于不会终止的流，在无尽的流上使用 `takeLast` 永远不会发出数据**。

```typescript
range(1, 100).pipe(takeLast(3)).subscribe(x => console.log(x));
```

#### skip、skipWhile、skipUntil、skipLast

**skip**：跳过前几个数据流。

```typescript
import {range} from "rxjs"
import {skip} from "rxjs/operators"

range(1, 10).pipe(skip(8)).subscribe(console.log)

// 9
// 10
```

**skipWhile**：只要数据源发出的值满足 `skipWhile` 中的条件，就跳过该值。

```typescript
import {range} from "rxjs"
import {skipWhile} from "rxjs/operators"

range(1, 10)
  .pipe(skipWhile(n => n < 5))
  .subscribe(console.log)


// 5
// 6
// 7
// 8
// 9
// 10
```

**skipUntil**：接收一个可观察对象，并跳过主数据源发出的值，直到接收的可观察对象发出值，主数据源的值才能发出。

```typescript
import {timer, interval} from "rxjs"
import {skipUntil} from "rxjs/operators"

interval(500)
  .pipe(skipUntil(timer(2000)))
  .subscribe(console.log)

// 3
// 4
// 5
// ...
```

**skipLast**：跳过后面几个值，它的实现和 `takeLast` 类似，当数据发送完成后跳过最后的值发出其他的值。**不可以用于不会终止的流**。

```typescript
of(1, 2, 3, 4, 5).pipe(skipLast(2)).subscribe(x => console.log(x));

// 1
// 2
// 3
```

#### elementAt

`elementAt` 类似数组的下标索引，获取源 Observable 中指定索引位置的元素。

`elementAt(index, [defaultValue])` 接受两个参数：

- `index`: 要获取的元素的索引。
- `defaultValue`（可选）：如果索引超出范围，可以指定一个默认值。在没有提供默认值时，默认行为是发出一个错误通知。

```typescript
import { of } from 'rxjs';
import { elementAt } from 'rxjs/operators';

// 定义一个源 Observable 发出一些数字
const source$ = of(10, 20, 30, 40, 50);

// 使用 elementAt 获取索引为 2 的元素（即第三个元素，值为 30）
const element$ = source$.pipe(
  elementAt(2)
);

// 订阅并打印输出
element$.subscribe({
  next: value => console.log(value),
  error: err => console.error(err)
});

// 30
```

#### ignoreElements

忽略源 Observable 发出的所有值，只传递异常和结束信息，可以用于不关注数据只关注异常的场景。

```typescript
import { of } from 'rxjs';
import { ignoreElements } from 'rxjs/operators';

// 定义一个源 Observable 发出一些数字
const source$ = of(1, 2, 3, 4, 5);

// 使用 ignoreElements 操作符
const ignored$ = source$.pipe(
    ignoreElements()
);

// 订阅并打印输出
ignored$.subscribe({
    next: value => console.log('Next:', value),  // 不会打印任何值
    error: err => console.error('Error:', err),  // 如果有错误会打印
    complete: () => console.log('Completed!')   // 会打印 "Completed!"
});

// Completed!
```

### 连接操作符

#### startWith

创建一个新的 Observable 对象并将参数值发送出去，然后再发送源 Observable 对象发出的值。

在异步编程中提供默认值的时候非常有用。将 `startWith` 发出的值当做默认值。

```typescript
import {interval} from "rxjs"
import {map, startWith} from "rxjs/operators"

interval(1000)
  .pipe(
    map(n => n + 100),
    startWith(505)
  )
  .subscribe(n => console.log(n))
// 505
// 100
// 101
// 102
// ...
```

### 工具操作符

#### tap

`tap` 用来查看 Observable 流中的数据，同时不会对数据流产生任何影响。通常用来打印日志。

```typescript
import {of, tap, map} from 'rxjs';

of(Math.random()).pipe(
  tap(console.log),
  map(n => n > 0.5 ? 'big' : 'small')
).subscribe(console.log);
```

```typescript
import { of } from 'rxjs';
import { tap, map } from 'rxjs/operators';

const source = of(1, 2, 3, 4, 5);

const example = source
  .pipe(
    map(val => val + 10),
    tap({
      next: val => {
        console.log('on next', val);
      },
      error: error => {
        console.log('on error', error.message);
      },
      complete: () => console.log('on complete')
    })
  )
  .subscribe(val => console.log(val));
// 输出：
// on next 11
// 11
// on next 12
// 12
// on next 13
// 13
// on next 14
// 14
// on next 15
// 15
// on complete
```

#### delay、delayWhen

**delay**：对 Observable 发出的值延迟指定的时间，只执行一次。

```typescript
import {interval, take} from "rxjs"
import {delay} from "rxjs/operators"

const start = new Date();
interval(500)
  .pipe(
    take(5),
    delay(3000)
  )
  .subscribe((v) => {
    console.log('val', v);
    console.log(new Date() - start);
  })

// 3500ms 之后发出值，接下来每 500ms 发出一个值
```

**delayWhen**：将源 Observable 发出的值延迟一段时间，这个延迟时间由另一个 Observable 来决定。源 Observable 发出多少值，传入的回调函数就会执行多少次。

```typescript
import { of, timer } from 'rxjs';
import { delayWhen } from 'rxjs/operators';

// 定义一个源 Observable 发出一些数字
const source$ = of(1, 2, 3, 4);

const delayed$ = source$.pipe(
  delayWhen(value => {
    // 根据每个值决定延迟的时间
    // 比如这里是每个值的延迟时间都基于 1000ms + 当前数字 * 500ms
    return timer(1000 + value * 500);
  })
);

// 订阅并打印输出
delayed$.subscribe(console.log);
```

#### every

`every` 操作符用于判断源 Observable 发出的每个值是否都符合某个条件。返回布尔值。类似数组的 `every` 方法。

```typescript
import { range } from "rxjs"
import { every, map } from "rxjs/operators"

range(1, 9)
  .pipe(
    every(n => n > 5)
  )
  .subscribe(console.log)

// false，因为源 Observable 发出的值只有 6，7，8，9 大于 5

range(1, 9)
    .pipe(
        every(n => n > 0)
    )
    .subscribe(console.log)

// true
```

### 错误处理

#### catchError

`catchError` 用于捕获 Observable 流中的错误，并返回一个新的 Observable 来替代原来的错误流。这个操作符**允许你处理错误并继续执行流，而不是直接终止整个 Observable**。

```typescript
import { of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

// 模拟一个会抛出错误的 Observable
const source$ = throwError(() => new Error('Something went wrong!'));

// 使用 catchError 捕获错误并返回替代的 Observable
const result$ = source$.pipe(
  catchError(err => {
    console.error('Caught error:', err.message);
    return of('Fallback value');

    // 重新抛出一个新的错误
    // return throwError(() => new Error('Re-thrown error'));
  })
);

// 订阅并打印输出
result$.subscribe({
  next: value => console.log(value),
  error: err => console.error('Final error:', err),
  complete: () => console.log('Completed!')
});

// Caught error: Something went wrong!
// Fallback value
// Completed!
```

#### retry

`retry` 操作符用于自动重新订阅源 Observable，并重试失败的操作。当源 Observable 发出错误通知时，retry 会尝试重新发起新的订阅，直到达到指定的重试次数为止。如果重试次数超过了指定次数，则会将错误传递给观察者。

```typescript
import { of, throwError } from 'rxjs';
import { retry } from 'rxjs/operators';

// 模拟一个会发出错误的 Observable
const source$ = throwError(() => new Error('Something went wrong!'));

// 使用 retry 操作符，最多重试 3 次
const retried$ = source$.pipe(
    retry(3)  // 重试 3 次
);

// 订阅并打印输出
retried$.subscribe({
    next: value => console.log(value),
    error: err => console.error('Error:', err.message), // 在尝试了 3 次后，错误通知会被最终发出
    complete: () => console.log('Completed!')
});

// Error: Something went wrong!
```

如果 `count` 参数未指定，`retry` 会无限次重试，直到成功或手动取消订阅。


重试指定条件的错误：

`retryWhen` 操作符已被弃用，使用 `retry({ delay: () => notify$ })` 来替代 `retryWhen(() => notify$)`。

通过传递一个带有 `delay` 选项的对象给 `retry`，来控制每次重试之间的延迟时间。

- `delay`：可以是一个数字，表示延迟时间。
- `delay`：可以是一个函数 `delay: () => notify$`，返回一个 Observable。每次重试之前会等待 `notify$` 发出的值。

```typescript
import { of, throwError, timer } from 'rxjs';
import { retry } from 'rxjs/operators';

// 模拟一个会发出错误的 Observable
const source$ = throwError(() => new Error('Network Error'));

// 定义一个控制延迟的 Observable
const notify$ = timer(1000); // 每次重试之前等待 1 秒

// 使用 retry 操作符并指定 delay 属性
const retried$ = source$.pipe(
  retry({
    count: 3,
    delay: () => notify$ // 每次重试之间延迟 1 秒
  })
);

// 订阅并打印输出
retried$.subscribe({
    next: value => console.log(value),
    error: err => console.error('Error:', err.message),
    complete: () => console.log('Completed!')
});

// Error: Network Error
```

动态延迟，指数退避：

```typescript
import { of, throwError, timer } from 'rxjs';
import { retry } from 'rxjs/operators';

// 模拟一个会发出错误的 Observable
const source$ = throwError(() => new Error('Network Error'));

// 动态计算每次重试的延迟：指数退避（Exponential Backoff）
const retryDelay = (attempt: number) => timer(Math.pow(2, attempt) * 1000);  // 每次重试间隔 2^attempt 秒

// 使用 retry 操作符并指定延迟策略
const retried$ = source$.pipe(
  retry({
    count: 3,
    delay: (error, attempt) => retryDelay(attempt)  // 基于尝试次数来计算延迟
  })
);

// 订阅并打印输出
retried$.subscribe({
  next: value => console.log(value),
  error: err => console.error('Error:', err.message),
  complete: () => console.log('Completed!')
});

// Error: Network Error
```

根据不同错误类型重试：

```typescript
import { of, throwError, timer } from 'rxjs';
import { retry, delay } from 'rxjs/operators';

// 模拟一个会发出错误的 Observable
const source$ = throwError(() => new Error('Network Error'));

// 条件重试
const retryDelay = (err: any) => {
  if (err.message === 'Network Error') {
    // 如果是网络错误，延迟 1 秒
    console.log('Network Error: Retrying...');
    return of(err).pipe(delay(1000));
  } else if (err.message === 'Timeout Error') {
    // 如果是超时错误，延迟 2 秒
    console.log('Timeout Error: Retrying...');
    return of(err).pipe(delay(2000));
  } else {
    // 其他错误直接抛出
    return throwError(() => err);
  }
}

// 使用 retry 操作符并指定 delay 属性
const retried$ = source$.pipe(
  retry({
    count: 3,
    delay: (error, attempt) => retryDelay(error)
  })
);

// 订阅并打印输出
retried$.subscribe({
  next: value => console.log(value),
  error: err => console.error('Error:', err.message),
  complete: () => console.log('Completed!')
});
```

### 高阶操作符

所谓的高阶操作符（Higher Order Observable）就是指一个 Observable 发送出的值还是一个 Observable。

#### concatAll、concatMap

**concatAll**：用于将一个包含多个内部 Observables 的高阶 Observable（即 Observable 的 Observable）“展平”（flatten）为一个单一的 Observable，并按顺序依次合并这些内部 Observables。

- `concatAll` 确保它按顺序执行每个内部 Observable，前一个 Observable 完成后才会处理下一个。

```typescript
import { of } from 'rxjs';
import { concatAll } from 'rxjs/operators';

// 创建多个内部 Observables
const source$ = of(
  of('A', 'B', 'C'), 
  of('D', 'E'),
  of('F', 'G')
);

// 使用 concatAll 将其展平为一个流
const result$ = source$.pipe(concatAll());

// 订阅并打印输出
result$.subscribe(value => console.log(value));

// A
// B
// C
// D
// E
// F
// G
```

处理异步：

```typescript
import { of, timer } from 'rxjs';
import { concatAll, map } from 'rxjs/operators';

// 模拟异步操作（例如：HTTP 请求）
const simulateHttpRequest = (id) => {
  return timer(1000 * id).pipe(map(() => `Request ${id} completed`));
};

// 创建一个包含多个 HTTP 请求的 Observable
const source$ = of(1, 2, 3).pipe(
  map(id => simulateHttpRequest(id)) // 为每个请求返回一个内部 Observable
);

// 使用 concatAll 依次处理这些 HTTP 请求
const result$ = source$.pipe(concatAll());

// 订阅并打印输出
result$.subscribe(value => console.log(value));

// Request 1 completed
// Request 2 completed
// Request 3 completed
```

**concatMap**：用于将源 Observable 发出的每个值映射为一个内部 Observable，并按顺序依次处理这些内部 Observables。

- 每次只会处理一个内部 Observable，前一个 Observable 完成后才会处理下一个。
- 保证了顺序，不会并发执行内部 Observables。

```typescript
import { of, timer } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';

// 模拟异步操作（例如 HTTP 请求）
const simulateHttpRequest = (id) => {
  return timer(1000 * id).pipe(map(() => `Request ${id} completed`));
};

// 创建一个 Observable 发出请求 ID
const source$ = of(1, 2, 3);

// 使用 concatMap 按顺序执行 HTTP 请求
const result$ = source$.pipe(
  concatMap(id => simulateHttpRequest(id))
);

// 订阅并打印输出
result$.subscribe(value => console.log(value));

// Request 1 completed
// Request 2 completed
// Request 3 completed
```

#### mergeAll、mergeMap

**mergeAll**：用于将高阶 Observable（即一个发出多个内部 Observable 的 Observable）展平（flatten），并将所有内部 Observable 合并为一个单一的输出流。

- `mergeAll` 会立即订阅所有内部 Observable，然后并发地发出它们的值，而不会按顺序等待每个内部 Observable 完成。

`mergeAll(concurrent: number = Infinity)` 有一个可选参数 `concurrent` 可以用来控制并发数量。

```typescript
import { of } from 'rxjs';
import { mergeAll } from 'rxjs/operators';

// 创建一个包含多个内部 Observables 的高阶 Observable
const source$ = of(
        of('A', 'B', 'C'),
        of('D', 'E'),
        of('F', 'G')
);

// 使用 mergeAll 将这些内部 Observables 合并为一个单一的流
const result$ = source$.pipe(mergeAll());

// 订阅并打印输出
result$.subscribe(value => console.log(value));

// A
// B
// C
// D
// E
// F
// G
```

**mergeMap**：允许将源 Observable 发出的每一个值映射为一个内部 Observable（或称为“内部流”），并将这些内部 Observable 合并到一个单一的输出流中。

- 不同于 `concatMap`，`mergeMap` 会并发地处理多个内部 Observable，并不会等待前一个内部 Observable 完成后再处理下一个。

`mergeMap(project: (value: T) => ObservableInput, concurrent: number = Infinity)`，接受两个参数 

- `project`：一个函数，接收源 Observable 发出的每个值，并返回一个内部 Observable（或其他类型的值）。这个内部 Observable 会被合并到输出流中。
- `concurrent`（可选）：指定最多可以同时订阅多少个内部 Observable，默认为 `Infinity`，表示无限制并发。

```typescript
import { of } from 'rxjs';
import { mergeMap, delay } from 'rxjs/operators';

// 模拟异步操作
const simulateAsyncTask = (value) => {
  return of(`Task ${value} completed`).pipe(delay(1000 * value)); // 延时模拟异步操作
};

// 创建一个源 Observable
const source$ = of(1, 2, 3);

// 使用 mergeMap 来并发处理多个异步任务
// 任务 Task 1, Task 2, 和 Task 3 会同时开始处理
const result$ = source$.pipe(
  mergeMap(value => simulateAsyncTask(value))
);

// 订阅并打印输出
result$.subscribe(value => console.log(value));

// Task 1 completed
// Task 2 completed
// Task 3 completed
```

限制并发数量：

```typescript
import { of } from 'rxjs';
import { mergeMap, delay } from 'rxjs/operators';

// 模拟异步操作
const simulateAsyncTask = (value) => {
  return of(`Task ${value} completed`).pipe(delay(1000 * value)); // 延时模拟异步操作
};

// 创建一个源 Observable
const source$ = of(1, 2, 3, 4, 5);

// 使用 mergeMap 并限制并发数为 2
const result$ = source$.pipe(
  mergeMap(value => simulateAsyncTask(value), 2) // 这里限制并发数为 2
);

// 订阅并打印输出
result$.subscribe(value => console.log(value));

// Task 1 completed
// Task 2 completed
// Task 3 completed
// Task 4 completed
// Task 5 completed
```

#### switchMap

用于将源 Observable 发出的每个值映射为一个新的 Observable，并且在接收到新的值时，**取消订阅**当前的内部 Observable，并订阅新的内部 Observable。

这意味着只有最后一个内部 Observable 的值会被发出，其它之前的内部 Observable 会被自动取消订阅。

```typescript
import { fromEvent, fromPromise } from 'rxjs';
import { switchMap, debounceTime, map } from 'rxjs/operators';

// 模拟网络请求
const fakeApiRequest = (query) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(`Result for: ${query}`), 1000);
  });
};

// 获取搜索框元素
const searchInput = document.getElementById('search');

// 用户输入事件流
const search$ = fromEvent(searchInput, 'input').pipe(
  map(event => event.target.value), // 提取输入的值
  debounceTime(300), // 防抖，避免每次输入都发出请求
  switchMap(query => {
    if (query) {
      return fromPromise(fakeApiRequest(query)); // 返回一个新的 Observable
    } else {
      return of(''); // 如果没有输入，返回一个空字符串
    }
  })
);

// 订阅并打印搜索结果
search$.subscribe(result => console.log(result));
```

`fakeApiRequest(query)` 模拟一个异步请求，`switchMap` 会发出该请求，并在新的输入发生时取消之前的请求。

#### exhaustAll, exhaustMap

**exhaustMap**：映射源 Observable 发出的每个值为一个内部 Observable，并且忽略在内部 Observable 完成之前发出的所有新值。

- `exhaustMap` 会等待当前的内部 Observable 完成。
- 在当前的内部 Observable 执行期间，任何新的源值都会被忽略。
- 只有在内部 Observable 完成后，才会处理源 Observable 中的下一个值。

这种行为通常用于限制并发任务的数量，尤其是在处理需要等待的异步操作时，例如避免用户频繁点击按钮触发多个请求。

```typescript
import { fromEvent } from 'rxjs';
import { exhaustMap, map, debounceTime } from 'rxjs/operators';

// 模拟异步搜索请求
const simulateSearchRequest = (query) => {
  console.log(`Searching for: ${query}`);
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(`Search results for: ${query}`);
    }, 1500); // 模拟请求延时
  });
};

// 获取搜索框元素
const searchInput = document.getElementById('searchBox');

// 用户输入事件流
const search$ = fromEvent(searchInput, 'input').pipe(
  debounceTime(500), // 防抖，避免每次输入都发出请求
  map(event => event.target.value), // 提取输入的值
  exhaustMap(query => {
    if (query) {
      return from(simulateSearchRequest(query)); // 返回一个新的 Observable
    } else {
      return of(''); // 如果没有输入，返回空字符串
    }
  })
);

// 订阅并打印搜索结果
search$.subscribe(result => console.log(result));
```

`exhaustMap` 会确保每次用户输入时只处理最后一次的请求，而忽略在请求进行中产生的其他输入。


**exhaustAll**：类似于 `exhaustMap`，但它的用途稍有不同。`exhaustAll` 用于将源 Observable 发出的每个值（这些值本身通常是 Observable）转换为内部 Observable，并且在当前内部 Observable 完成之前，会忽略所有新的值，直到当前内部 Observable 完成。

- `exhaustAll` 监听源 Observable 中发出的每个值，这些值通常是 Observable。
- 当源 Observable 发出一个新的 Observable 时，`exhaustAll` 会订阅该内部 Observable。
- 如果当前的内部 Observable 还没有完成，`exhaustAll` 会忽略源 Observable 发出的所有后续值，直到当前的内部 Observable 完成。
- 一旦当前的内部 Observable 完成，`exhaustAll` 会继续处理源 Observable 中的下一个值（如果存在）。


```typescript
import { of, interval } from 'rxjs';
import { exhaustAll, map, take } from 'rxjs/operators';

// 模拟内部 Observable（例如 HTTP 请求）
const simulateAsyncTask = (id) => {
  return of(`Request ${id} completed`).pipe(
    // 模拟任务延迟
    map(val => val),
    take(1) // 模拟每个请求只会发出一个值，然后完成
  );
};

// 创建一个源 Observable，发出多个 Observable
const source$ = of(
  simulateAsyncTask(1),
  simulateAsyncTask(2),
  simulateAsyncTask(3),
  simulateAsyncTask(4)
);

// 使用 exhaustAll 来处理内部 Observable
const result$ = source$.pipe(
  exhaustAll() // 忽略当前任务未完成时的其他任务
);

// 订阅并打印输出
result$.subscribe(value => console.log(value));

// Request 1 completed
// Request 2 completed
// Request 3 completed
// Request 4 completed
```
