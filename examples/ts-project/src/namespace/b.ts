// namespace 可以拆分，分布在多个文件中，并且共享同一个 namespace

/// <reference path="a.ts" />
namespace Shape {
    export function square(x: number) {
        return x * x
    }
}

console.log(Shape.cricle(2))
console.log(Shape.square(2))

import cricle = Shape.cricle
console.log(cricle(2))


// 需要编译成 js 文件，并在 html 文件中引用
// tsc ./b.ts