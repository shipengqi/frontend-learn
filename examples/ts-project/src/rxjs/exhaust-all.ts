import { of, interval } from 'rxjs';
import { exhaustAll, map, take } from 'rxjs/operators';

// 模拟内部 Observable（例如 HTTP 请求）
const simulateAsyncTask = (id: number) => {
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
