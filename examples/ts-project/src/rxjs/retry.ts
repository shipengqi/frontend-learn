import {of, throwError, timer} from 'rxjs';
import {delay, retry} from 'rxjs/operators';

// 模拟一个会发出错误的 Observable
const source$ = throwError(() => new Error('Unknown Error'));

// 定义一个控制延迟的 Observable
// const notify$ = timer(1000); // 每次重试之前等待 1 秒

// 动态计算每次重试的延迟：指数退避（Exponential Backoff）
// const retryDelay = (attempt: number) => timer(Math.pow(2, attempt) * 1000);  // 每次重试间隔 2^attempt 秒

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
        // delay: () => notify$ // 每次重试之间延迟 1 秒
        delay: (error, attempt) => retryDelay(error)
    })
);

// 订阅并打印输出
retried$.subscribe({
    next: value => console.log(value),
    error: err => console.error('Error:', err.message),
    complete: () => console.log('Completed!')
});
