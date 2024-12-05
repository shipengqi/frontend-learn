import {range} from "rxjs";
import {filter} from "rxjs/operators";

// filter 对数据流进行过滤
range(1, 10).pipe(filter((n) => n > 5))
    .subscribe((even) => console.log(even));

// Output:
// 6
// 7
// 8
// 9
// 10
