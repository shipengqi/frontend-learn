import {interval} from "rxjs"
import {take, reduce} from "rxjs/operators"

interval(100)
    .pipe(
        take(5),
        reduce((acc, value) => acc += value, 0)
    )
    .subscribe(console.log)
