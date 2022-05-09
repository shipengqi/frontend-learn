interface List {
    readonly id: number; // 只读属性，不可修改
    // id: number;
    name: string;
    age?: number; // 可选属性
}

interface Result {
    data: List[]
}

function render(result: Result) {
    result.data.forEach((value) => {
        console.log(value.id, value.name)
        // 1 'a'
        // 2 'b'
        if (value.age) { // 如果 List 不加上 age: number 会报错 Property 'age' does not exist on type 'List'.ts(2339)
            console.log(value.age)
        }
    })
}

let result = {
    data: [
        {id: 1, name: "a"},
        {id: 2, name: "b", age: 10},
        {id: 3, name: "c", sex: 'male'}, // 有多出的字段，不会报错
    ]
}

render(result)

// 如果直接传入对象字面量，ts 就会对对象进行检查
// render( {
//     data: [
//         {id: 1, name: "a"},
//         {id: 2, name: "b"},
//         {id: 3, name: "c", sex: 'male'}, // Type '{ id: number; name: string; sex: string; }' is not assignable to type 'List'. Object literal may only specify known properties, and 'sex' does not exist in type 'List'.ts(2322)
//     ]
// })
// 避免上面的问题 除了赋值给一个变量外，还可以使用类型断言，明确的告诉编译器传入的对象就是 Result 类型，编译器会跳过类型检查
render({
    data: [
        {id: 1, name: "a"},
        {id: 2, name: "b"},
        {id: 3, name: "c", sex: 'male'},
    ]
} as Result)
render(<Result>{ // 不建议 在 react 中会产生歧义
    data: [
        {id: 1, name: "a"},
        {id: 2, name: "b"},
        {id: 3, name: "c", sex: 'male'},
    ]
})
// 两种类型断言是等价的
// 第三种方法，使用字符串索引签名
interface List2 {
    id: number;
    name: string;
    [x: string]: any; // List 可以支持多个属性了
}
interface Result2 {
    data: List2[]
}
function render2(result: Result2) {
    result.data.forEach((value) => {
        console.log(value.id, value.name)
        // 1 'a'
        // 2 'b'
    })
}
render2({
    data: [
        {id: 1, name: "a"},
        {id: 2, name: "b"},
        {id: 3, name: "c", sex: 'male'},
    ]
})

interface StringArray {
    [index: number]: string;
}

let chars: StringArray = ['a', 'b']

interface Names {
    [x: string]: string;
    // number 成员就不能再声明
    // y: number; // Property 'y' of type 'number' is not assignable to string index type 'string'.ts(2411)
    [z: number]: string;
    // [z: number]: number; 不兼容
}

// 接口定义函数
// let add: (x: number, y: number) => number 等价于下面的接口
// interface Add {
//     (x: number, y: number): number
// }

// 也可以使用类型别名
type Add = (x: number, y: number) => number

let add3: Add = (a, b) => a + b

// 混合类型接口
interface Lib {
    (): void;
    version: string;
    doSometing(): void;
}

// let lib: Lib = () => {}
let lib: Lib = (() => {}) as Lib
// 添加缺少的属性，否则会报错 Type '() => void' is missing the following properties from type 'Lib': version, doSometingts(2739)
lib.version = '1.0.0';
lib.doSometing = () => {}
// 添加属性后，但是还是报错 Type '() => void' is missing the following properties from type 'Lib': version, doSometing
// 这个使用类型断言 as Lib

// 可以封装一个工厂函数
function NewLib() {
    let lib: Lib = (() => {}) as Lib
    lib.version = '1.0.0';
    lib.doSometing = () => {}
    return lib
}

let lib1 = NewLib();
lib1();
lib1.doSometing();