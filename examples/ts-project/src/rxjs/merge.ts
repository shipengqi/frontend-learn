import {merge, interval, take, map} from "rxjs";

const timer = interval(1000).pipe(take(3), map(v => 'timer1: ' + v + 's'));
const timer2 = interval(1000).pipe(take(3), map(v => 'timer2: ' + v + 's'));

// 合并数据流，多个参数一起发出数据流，按照时间线进行交叉合并
merge(timer, timer2).subscribe(console.log);

// Output:
// timer1: 0s
// timer2: 0s
// timer1: 1s
// timer2: 1s
// timer1: 2s
// timer2: 2s

