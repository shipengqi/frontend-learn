import { range } from "rxjs"
import { every } from "rxjs/operators"

range(1, 9)
    .pipe(
        every(n => n > 0)
    )
    .subscribe(console.log)
