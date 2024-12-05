import {concatMap, interval, Observable, Subscriber, take} from 'rxjs';

const fakeHttp = {
    get: function (url: string) {
        return new Observable(function subscribe(subscriber: Subscriber<string>) {
            const id = setTimeout(() => {
                subscriber.next('success');
                subscriber.complete();
            }, 1000);
        });
    }
}

const observable = new Observable(function subscribe(subscriber: Subscriber<string>) {
    interval(1000).pipe(take(5)).subscribe(() => {
        subscriber.next('https://fakeurl.com');
    })
});

// concatMap
const stream$ = observable.pipe(
    concatMap((url) => fakeHttp.get(url))
);

stream$.subscribe((res) => {
    console.log(res);
})

// Output:
// success
// success
// success
// success
// success
