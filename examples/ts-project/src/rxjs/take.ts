import {range, interval, timer} from "rxjs"
import {take, takeWhile, takeUntil} from "rxjs/operators"

// range(1, 10).pipe(take(3)).subscribe(console.log)

// range(1, 10)
//     .pipe(takeWhile(n => n < 8))
//     .subscribe(console.log)

interval(1000)
    .pipe(takeUntil(timer(5000)))
    .subscribe(console.log)
