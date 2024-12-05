import {range, timer, interval} from "rxjs"
import {skipWhile, skipUntil} from "rxjs/operators"

// range(1, 10)
//     .pipe(skipWhile(n => n < 5))
//     .subscribe(console.log)

interval(500)
    .pipe(skipUntil(timer(2000)))
    .subscribe(console.log)
