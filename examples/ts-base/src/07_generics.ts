function log<T>(value: T): T {
    console.log(value);
    return value;
}

// 调用泛型函数
log<string[]>(['a', 'b', 'c']) // ['a', 'b', 'c']
log(['a', 'b']) // ['a', 'b']

// 类型别名 定义泛型函数类型
type Log = <T>(value: T) => T
let myLog: Log = log

// 接口 定义泛型函数类型
interface Log2<T> {
    <T>(value: T): T
}

// let myLog2: Log2 = log // Generic type 'Log2<T>' requires 1 type argument(s).ts(2314)

let myLog2: Log2<number> = log

// 也可以不指定类型，在接口中指定默认类型
interface Log3<T = string> {
    <T>(value: T): T
}
let myLog3: Log3 = log

// 泛型类
class Log4<T> {
    // 泛型不能应用于类的静态成员
    // static run(value: T) { // Static members cannot reference class type parameters.
    //     console.log(value);
    //     return value;
    // }
    run(value: T) {
        console.log(value);
        return value;
    }
}

// 实例化泛型类，可以显示的传入 T 的类型
let log4 = new Log4<number>()
// run 的参数受到泛型的约束
// log4.run('a') // Argument of type 'string' is not assignable to parameter of type 'number'.ts(2345)
log4.run(5)

//  实例化泛型类，不传入 T 的类型，value 的类型就可以是任意类型
let log41 = new Log4()
log41.run(5)
log41.run('a')


// 泛型的类型约束
interface Length {
    length: number
}

// T 继承了 Length 接口，就不能传入任意类型，参数必须具有 length 属性
function log5<T extends Length>(value: T): T {
    console.log(value, value.length);
    return value;
}
// 数组 字符串 都具有 length 属性
log5([1])
log5('123')
log5({length: 1})