import {concat, range, interval, take, map} from "rxjs";

// concat(range(1, 5), range(6, 5)).subscribe(console.log);

// Output:
// 1
// 2
// 3
// 4
// 5
// 6
// 7
// 8
// 9
// 10

// const timer = interval(1000).pipe(take(4), map(x => `${x}s`));
// const sequence = range(1, 10);
// const result = concat(timer, sequence);
// result.subscribe(x => console.log(x));

// Output:
// 0s-> 1s-> 2s -> 3s -> 1 -> 2 ... -> 10

const timer = interval(1000).pipe(take(2));

concat(timer, timer) // concatenating the same Observable!
    .subscribe({
        next: value => console.log(value),
        complete: () => console.log('...and it is done!')
    });

// Logs:
// 0 after 1s
// 1 after 2s
// 0 after 3s
// 1 after 4s
// '...and it is done!' also after 4s
