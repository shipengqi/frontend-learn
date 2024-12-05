import {interval, take} from "rxjs"
import {delay} from "rxjs/operators"

const start = new Date();
interval(500)
    .pipe(
        take(3),
        delay(3000)
    )
    .subscribe((v) => {
        console.log('val', v);
        // @ts-ignore
        console.log(new Date() - start);
    })
