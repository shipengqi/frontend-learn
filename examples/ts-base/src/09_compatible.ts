/*
 * X（目标类型） = Y（源类型），X 兼容 Y
 * 源类型具有目标类型的必要属性，也就是属性少的，兼容属性多的
 */



let s: string = 'a'

// s = null // 把 tsconfig.json 中的 "strictNullChecks" 改为 false，那么 string 和 null 就可以兼容，
// null 是 string 的子类型

// 接口兼容性
interface X {
    a: any;
    b: any;
}
interface Y {
    a: any;
    b: any;
    c: any;
}
let x2: X = {a: 1, b: 2}
let y2: Y = {a: 1, b: 2, c: 3}

x2 = y2 // Y 接口具有 X 接口的所有属性，所以 X 可以兼容 Y 类型
// y2 = x2 // Property 'c' is missing in type 'X' but required in type 'Y'.ts(2741)

// 函数兼容性的条件
// 1. 参数个数
// 对于固定参数的函数：目标函数的参数个数，要多于源函数的参数个数
// 对于可选参数和 rest 参数：
//   固定参数可以兼容可选参数和 rest 参数
//   可选参数不兼容固定参数和 rest 参数
//   rest 参数可以兼容可选参数和固定参数
// 2. 参数类型
// 3. 返回值类型

type Handler = (a: number, b: number) => void
function hof(handler: Handler) {
    return handler
}

// 目标函数的参数个数，多于源函数的参数个数
let handler1 = (a: number) => {}

hof(handler1)

let handler2 = (a: number, b: number, c: number) => {}

// hof(handler2) // Argument of type '(a: number, b: number, c: number) => void' is not assignable to parameter of type 'Handler'.

// 可选参数和 rest 参数
let af = (p1: number, p2: number) => {}
let bf = (p1?: number, p2?: number) => {}
let cf = (...args: number[]) => {}

// 固定参数可以兼容可选参数和 rest 参数
af = cf
af = bf

// 可选参数不兼容固定参数和 rest 参数
// 把 tsconfig.json 中的 "strictFunctionTypes" 改为 false，就可以兼容了
// bf = af
// bf = cf

// rest 参数可以兼容可选参数和固定参数
cf = af
cf = bf

// 参数类型不兼容
let handler3 = (s: string) => {}

// hof(handler3) // Types of parameters 's' and 'a' are incompatible.


interface Point3D {
    x: number;
    y: number;
    z: number;
}
interface Point2D {
    x: number;
    y: number;
}

let p3d = (point: Point3D) => {}
let p2d = (point: Point2D) => {}

// 这里的接口的兼容性正好相反，接口是属性少的，兼容属性多的
// 这里可以把接口的属性看做函数的参数，那就是参数多的兼容参数少的，与函数的兼容性一致
p3d = p2d

// p2d = p3d // Property 'z' is missing in type 'Point2D' but required in type 'Point3D'.
// 把 tsconfig.json 中的 "strictFunctionTypes" 改为 false，就可以兼容了


// 返回值类型
let ff = () => ({name: 'Alice'})
let gf = () => ({name: 'Alice', location: 'Beijing'})

// 属性少的兼容属性多的
ff = gf
// gf = ff


// 函数重载
function overload(a: number, b: number): number
function overload(a: string, b: string): string
function overload(a: any, b: any): any {}

// 参数个数不兼容
// function overload(a: any): any {}
// function overload(a: any, b: any, c: any): any {}

// 参数返回值不兼容
// function overload(a: any, b: any) {}


// 枚举兼容性
enum Fruit { Apple, Banana }
enum Color { Red, Yellow }
// 枚举和 number 是可以相互兼容的
let fruit: Fruit.Apple = 1
let no: number = Fruit.Apple

// 枚举类型之间是不兼容的
// let color: Color.Red = Fruit.Apple // Type 'Fruit.Apple' is not assignable to type 'Color.Red'.

// 类的兼容性 和 接口的兼容性类似
// 不过类的构造函数和静态属性是不参与比较的
// 并且类中如果有私有属性，那么类也是不兼容的，除了父类和子类之间是兼容的
class AC {
    constructor(p: number, q: number) {}
    id: number = 1
    private name: string = ''
}
class BC {
    static s = 1
    constructor(p: number) {}
    id: number = 2
    private name: string = ''
}
class CC extends AC {}
let ac = new AC(1, 2)
let bc = new BC(1)
// ac = bc
// bc = ac

// 类中如果有私有属性，那么类也是不兼容的，除了父类和子类之间是兼容的
let cc = new CC(1, 2)
ac = cc
cc = ac



// 泛型兼容性
interface Empty<T> {
    // value: T
}
let objt1: Empty<number> = {};
let objt2: Empty<string> = {};

// 如果泛型接口没有属性，那么是兼容的
objt1 = objt2

// 泛型函数的兼容性
let log1 = <T>(x: T): T => {
    console.log('x')
    return x
}
let log2 = <U>(y: U): U => {
    console.log('y')
    return y
}

// 泛型函数如果定义相同，那么也是可以兼容的
log1 = log2

