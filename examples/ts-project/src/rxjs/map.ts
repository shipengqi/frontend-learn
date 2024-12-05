import {map, interval, take} from "rxjs";

const timer = interval(1000).pipe(take(5));

// map 对数据流进行转换，基于原有值进行转换。
const positions = timer.pipe(map(ev => ev * 10));
positions.subscribe(x => console.log(x));

// Output:
// 0
// 10
// 20
// 30
// 40
