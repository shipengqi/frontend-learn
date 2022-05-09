// 原始类型
let bool: boolean = true
let num: number = 100
let str: string = 'hello'
// str = 123 // Type 'number' is not assignable to type 'string'.ts(2322)

// 数组
let arr1: number[] = [1, 2, 3]
let arr2: Array<number> = [1, 2, 3]
// let arr3: Array<number> = [1, 2, 3, '4'] // Type 'string' is not assignable to type 'number'.ts(2322)
// 联合类型
let arr4: Array<number | string> = [1, 2, 3, '4']

// 元组 特殊的数组 限制了元素的类型和个数
let tuple: [number, string] = [0, '1']
// let tuple2: [number, string] = ['1', '1'] // Type 'string' is not assignable to type 'number'.ts(2322)
// let tuple3: [number, string] = [0, '1', 2] // Type '[number, string, number]' is not assignable to type '[number, string]'. Source has 3 element(s) but target allows only 2.ts(2322)
// 元组的越界问题
tuple.push(2)
console.log(tuple) // [0, "1", 2]
// tuple[2] // Tuple type '[number, string]' of length '2' has no element at index '2'.ts(2493)
// 所以 ts 允许向元组插入元素，但是不能访问


// 函数
let add = (x: number, y: number): number => x + y
let add2 = (x: number, y: number) => x + y // 利用了 ts 的类型推断功能，省略了返回值的类型

// 定义了函数类型 compute
let compute: (x: number, y: number) => number
// 实现 compute，不需要再指定具体的类型
compute = (a, b) => a + b;

// 对象
let obj: object = {x: 1, y: 2}
// obj.x = 1 // Property 'x' does not exist on type 'object'.ts(2339) 
// 上面只是指定了 obj 的类型是 object，没有具体定义包含的属性
// 正确的的定义
let obj2: {x: number, y: number} = {x: 1, y: 2}
obj2.x = 3

// symbol 具有唯一的值
let s1: symbol = Symbol()
let s2 = Symbol()
console.log(s1 === s2) // false

// undefined, null
let un: undefined = undefined
// let nu2: undefined = 3 // Type '3' is not assignable to type 'undefined'.ts(2322)
// undefined 类型只能被赋值为 undefined
// num = undefined // Type 'undefined' is not assignable to type 'number'.ts(2322)
// num = null // Type 'null' is not assignable to type 'number'.ts(2322)

// undefined 和 null 是任意类型的子类型，要修复这个报错，需要修改 tsconfig.json，将 "strictNullChecks": true, 改为 false
// 这里也可以使用联合类型来修复报错
// let num: number | undefined | null = 2


let nu: null = null

// void 没有返回值的类型，可以让任何表达式返回 undefined，例如 void 0
// 在 ts 中 undefined 不是保留字，是可以被变量覆盖的，如 var undefined = 0
// 使用 void 可以确保返回值是 undefined
let noReturn = () => {}

// any，不指定变量类型，就是默认的 any 类型。any 类型就和 js 中没有区别，可以赋值任意类型
let x
// x = 1
// x= []
// x = ""

// never 永远不会有返回值的类型
let error = () => {
    throw new Error('error')
}

let endless = () => {
    while(true) {}
}