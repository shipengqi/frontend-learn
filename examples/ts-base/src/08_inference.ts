let a = 1 // a: number
let b = [1] // b: number[]
let b2 = [1, null] // b2: (number | null)[] 这是因为 number 和 null 是不兼容的类型
// 把 tsconfig.json 中的 "strictNullChecks" 改为 false，那么 number 和 null 就可以兼容，类型推断为 b2: number[]

let c = (x = 1) => { // c: (x?: number) => number
    return x + 1
}

// 上面的类型推断都是从右向左的，根据右边的值 推断类型

// 上下文类型推断是从左向右的，例如 window.onkeydown 推断出 event 是 KeyboardEvent 类型
window.onkeydown = (event) => { // (parameter) event: KeyboardEvent
    console.log(event.BUBBLING_PHASE)
}

// 类型断言
// 有时候 ts 的类型推断不是你想要的，就可以使用类型断言覆盖类型推断

interface Foo {
    bar: number
}

// let foo = {}
// foo.bar = 1 // Property 'bar' does not exist on type '{}'.ts(2339)

// 使用类型断言
let foo = {} as Foo
foo.bar = 1

// 类型断言不要随便使用，如果上面的代码没有给 foo 添加 bar 属性，但是由于类型断言，并不会报，
// 那么后面使用时，就可能出现错误。建议在声明时 直接指定类型
let foo2: Foo = {bar: 1}