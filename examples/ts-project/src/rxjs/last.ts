import {interval} from "rxjs"
import {last} from "rxjs/operators"

interval(1000).pipe(last()).subscribe(console.log)
