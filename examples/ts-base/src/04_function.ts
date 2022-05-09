// 函数定义的四种方式

function plus1(x: number, y: number) {
    return x + y
}

// 下面的三种方式只是函数类型的定义，并没有具体实现
let plus2: (x: number, y: number) => number

type plus3 = (x: number, y: number) => number

interface plus4 {
    (x: number, y: number): number
}

// plus1(1, 2, 3) // Expected 2 arguments, but got 3.

// y 是可选参数
function plus5(x: number, y?: number) {
    return y ? x + y: x;
}

// function plus6(x: number, y?: number, z: number) { // A required parameter cannot follow an optional parameter.ts(1016)
//     return y ? x + y: x;
// }

plus5(1)

// 参数默认值
function plus7(x: number, y = 0, z: number, q: number = 1) {
    return x + y + z + q
}

// 如果可选参数后面有必选参数，那么不可以省略，可以传入 undefined 来获取默认值，最后的可选参数可以省略
console.log('可选参数：', plus7(1, undefined, 3)) // 可选参数： 5

// rest 参数
function plus8(x: number, ...rest: number[]) {
    return x + rest.reduce((pre, cur) => pre + cur);
}
console.log('rest 参数：', plus8(1, 2, 3, 4, 5)) // rest 参数： 15

// 函数重载，两个函数名称相同，但是函数参数的个数或者类型不同
// ts 编译器处理重载时，会去查询重载的列表，逐个尝试，所以应该把最常用的重载函数定义在最前面

// 定义名称相同函数声明
function plus9(...rest: number[]): number;
function plus9(...rest: string[]): string;
// 实现重载
function plus9(...rest: any[]): any {
    let first = rest[0];
    if (typeof first === 'number') {
        return rest.reduce((pre, cur) => pre + cur);
    }
    if (typeof first === 'string') {
        return rest.join('');
    }
}

console.log('函数重载 number:', plus9(1, 2)) // 函数重载 number: 3
console.log('函数重载 string:', plus9('a', 'b', 'c')) // 函数重载 string: abc