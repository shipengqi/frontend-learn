// 接口的声明合并
interface A {
    x: number;

    // 非函数的属性要保证唯一性，如果不唯一，类型必须相同。如 y 的类型必须相同
    // y: string; // Subsequent property declarations must have the same type.  Property 'y' must be of type 'string', but here has type 'number'.ts(2717)
    
    // 函数属性 每一个函数都会被声明为函数重载
    foo(bar: number): number; // 5
    foo(bar: 'a'): string; // 2
}

interface A {
    y: number;

    // 接口合并时，函数重载的顺序
    // 在接口内部，按照函数定义的顺序
    // 接口只之间，后面定义的接口，会排在前面
    // 如果函数的参数是字符串字面量，声明就会提升到最顶端
    foo(bar: string): string; // 3
    foo(bar: string[]): string[]; // 4
    foo(bar: 'b'): string; // 1
}

// 上面的两个接口 A 就会合并成一个接口（不同一个文件中，也会合并）
// am 需要有两个接口 A 的所有属性
let am: A = {
    x: 1,
    y: 2,
    // 实现函数重载
    foo(bar: any) {
        return bar
    }
}


// 命名空间的合并
// 命名空间必须在 类 函数 的声明之后，枚举没有要求

// 命名空间和类的合并
class C {}
namespace C { // 相当于给 C 类增加了静态属性 state
    export let state = 1
}
console.log(C.state) // 1

// 命名空间和函数的合并
function Lib() {}
namespace Lib { // 相当于给 Lib 函数增加了 version 属性
    export let version = '1.0'
}
console.log(Lib.version) // 1.0

// 命名空间和枚举的合并
enum Color {
    Red,
    Yellow,
    Blue
}
namespace Color { // 相当于给枚举 Color 增加了一个方法 mix
    export function mix() {}
}
console.log(Color) // {0: 'Red', 1: 'Yellow', 2: 'Blue', Red: 0, Yellow: 1, Blue: 2, mix: ƒ}