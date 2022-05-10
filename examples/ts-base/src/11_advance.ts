interface DogInterface {
    run(): void
}
interface CatInterface {
    jump(): void
}

// 交叉类型 用 & 连接
let pet: DogInterface & CatInterface = {
    run() {},
    jump() {}
}


// 联合类型
let aa: number | string = 1
let aa2: number | string = 's'

// 字面量的联合类型 限定变量的值的范围
let ba: 'a' | 'b' | 'c'
let ca: 1 | 2 | 3

// 对象的联合类型
class DogA implements DogInterface {
    run() {}
    eat() {}
}

class CatA implements CatInterface {
    jump() {}
    eat() {}
}

enum Master { Boy, Girl }
function getPet(master: Master) {
    let pet = master === Master.Boy ? new DogA() : new CatA();
    // 联合类型只能访问类型共有的属性
    // pet.run()
    // pet.jump()
    pet.eat()
    return pet
}

// 可区分的联合类型
interface Square {
    kind: "square";
    size: number;
}
interface Rectangle {
    kind: "rectangle";
    width: number;
    height: number;
}
interface Circle {
    kind: "circle";
    radius: number;
}
type Shape = Square | Rectangle | Circle
function area(s: Shape) {
    // 利用共有属性，来做类型保护
    switch (s.kind) {
        case "square":
            return s.size * s.size;
        case "rectangle":
            return s.height * s.width;
        case 'circle':
            return Math.PI * s.radius ** 2
        default:
            // 添加 default 分支，下面的代码会检查是否有类型被遗漏，如果有则报错
            // 这个函数会检查 s 是否是 never 类型，如果是 never 类型，说明前面的分支已经覆盖了所有类型
            // default 分支，永远不会被触发，如果不是，说明有遗漏
            return ((e: never) => {throw new Error(e)})(s)
    }
}
console.log(area({kind: 'circle', radius: 1}))


// 索引类型
let objA = {
    a: 1,
    b: 2,
    c: 3
}

function getValues(obj: any, keys: string[]) {
    return keys.map(key => obj[key])
}

console.log(getValues(objA, ['a', 'b'])) // [1, 2]
// 这里遍历对象没有的属性时，ts 没有报错，可以通过索引类型来约束
console.log(getValues(objA, ['c', 'd'])) // [3, undefined]

// 索引类型查询操作符 keyof T
// keyof T 表示类型 T 的所有公共属性字面量的联合类型

interface ObjIA {
    a: number;
    b: string;
}

// 变量 key 的类型就是 "a" | "b" 
let key: keyof ObjIA

// 索引访问操作符 T[K]
// T[K] 表示对象 T 的 K 属性的类型

// ObjIA['a'] 的类型是 number，那么 value 就是 number 类型
let value: ObjIA['a']

// 泛型约束 T extends U

// K extends keyof T 表示 K 继承了 T 的公共属性的联合类型，这用 K 就可以用来约束字符串数组
function getValues2<T, K extends keyof T>(obj: T, keys: K[]): T[K][] {
    return keys.map(key => obj[key])
}

console.log(getValues2(objA, ['a', 'b'])) // [1, 2]
// console.log(getValues2(objA, ['c', 'd'])) // Type '"d"' is not assignable to type '"a" | "b" | "c"'

// 可以得出结论：索引类型可以实现对对象属性的查询和访问，再配合泛型约束，就可以建立对象，对象属性，属性值的约束关系。



// 映射类型 ts 内置了很多映射类型

interface ObjM {
    a: string;
    b: number;
    c: boolean;
}

// 把所有属性变为只读，可以直接使用内置的 Readonly 泛型接口
type ReadOnlyObj = Readonly<ObjM>
// 可以得到：
// type ReadOnlyObj = {
//     readonly a: string;
//     readonly b: number;
//     readonly c: boolean;
// }

// Readonly 泛型接口的实现
// type Readonly<T> = {
//     readonly [P in keyof T]: T[P];
// };

// 把所有属性变为可选，
type PartialObj = Partial<ObjM>
// 可以得到：
// type PartialObj = {
//     a?: string | undefined;
//     b?: number | undefined;
//     c?: boolean | undefined;
// }

// Partial 泛型接口的实现
// type Partial<T> = {
//     [P in keyof T]?: T[P];
// };

type PickObj = Pick<ObjM, 'a' | 'b'>
// 可以得到：
// type PickObj = {
//     a: string;
//     b: number;
// }

// Pick 泛型接口的实现
// type Pick<T, K extends keyof T> = {
//     [P in K]: T[P];
// };

type RecordObj = Record<'x' | 'y', ObjM>
// 可以得到：
// type RecordObj = {
//     x: ObjM;
//     y: ObjM;
// }

// Record 泛型接口的实现
// type Record<K extends keyof any, T> = {
//     [P in K]: T;
// };




// 条件类型
// T extends U ? X : Y

// TypeName 就是一个条件类型
type TypeName<T> =
    T extends string ? "string" :
    T extends number ? "number" :
    T extends boolean ? "boolean" :
    T extends undefined ? "undefined" :
    T extends Function ? "function" :
    "object";

type T1 = TypeName<string>   // type T1 = "string"
type T2 = TypeName<string[]> // type T2 = "object"

// 如果把 T 改成一个联合类型
// (A | B) extends U ? X : Y
// 可以拆解为
// (A extends U ? X : Y) | (B extends U ? X : Y)
type T3 = TypeName<string | string[]> // type T3 = "string" | "object"


// 实现类型过滤
// 从类型 T 中过滤掉可以赋值给类型 U 的类型
type Diff<T, U> = T extends U ? never : T

type T4 = Diff<'a' | 'b' | 'c', 'a' | 'e'> // type T4 = "b" | "c"

// 可以拆解为
// Diff<"a", "a" | "e"> | Diff<"b", "a" | "e"> | Diff<"c", "a" | "e">
// "a" 可以赋值给  "a" | "e" =>  never
// "b" 不可以赋值给  "a" | "e" =>  "b"
// "c" 不可以赋值给  "a" | "e" =>  "c"
// never | "b" | "c"
// "b" | "c"

// let aaa: 'a'
// let bbb: 'a' | 'e'

// aaa = bbb // Type '"a" | "e"' is not assignable to type '"a"'.
// bbb = aaa

// 基于 Diff 类型扩展，从类型中排除不需要的类型

type NotNull<T> = Diff<T, undefined | null>

type T5 = NotNull<string | null | number | undefined> // type T5 = string | number

// 上面这两种实现，ts 已经有内置的实现
// Exclude<T, U> 相当于 Diff
// NonNullable<T> 相当于 NotNull

// 还有一些其他的条件类型
// Extract<T, U> 和 Exclude<T, U> 的作用相反 从类型 T 中抽取出可以赋值给类型 U 的类型
type T6 = Extract<"a" | "b" | "c", "a" | "e"> // type T6 = "a"

// ReturnType<T> 可以获取函数返回值的类型
type T8 = ReturnType<() => string> // type T8 = string

// ReturnType<T> 的实现
// type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any;
// infer 表示待推断，要根据实际情况来推断