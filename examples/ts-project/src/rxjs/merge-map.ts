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
