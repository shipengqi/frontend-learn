// 数字枚举

enum Role {
    Repoter = 1,
    Developer,
    Maintainer,
    Owner,
    Guest
}
// 会被编译成下面的 js
// "use strict";
// var Role;
// (function (Role) {
//     Role[Role["Repoter"] = 1] = "Repoter";
//     Role[Role["Developer"] = 2] = "Developer";
//     Role[Role["Maintainer"] = 3] = "Maintainer";
//     Role[Role["Owner"] = 4] = "Owner";
//     Role[Role["Guest"] = 5] = "Guest";
// })(Role || (Role = {}));
// 这是一个双向映射

console.log(Role.Repoter) // 1
console.log(Role)
// {
//    "1": "Repoter",
//    "2": "Developer",
//    "3": "Maintainer",
//    "4": "Owner",
//    "5": "Guest",
//    "Repoter": 1,
//    "Developer": 2,
//    "Maintainer": 3,
//    "Owner": 4,
//    "Guest": 5
// }
// 枚举是被编译成了一个对象，枚举对象既可以使用枚举成员的名来索引，也可以用值来索引
console.log(Role[1]) // Repoter


// 字符串枚举
enum Message {
    Success = '成功了',
    Fail = '失败了'
}
// "use strict";
// var Message;
// (function (Message) {
//     Message["Success"] = "\u6210\u529F\u4E86";
//     Message["Fail"] = "\u5931\u8D25\u4E86";
// })(Message || (Message = {}));
// 只有枚举成员的名称作为了 key，没有进行反向映射

// 异构枚举
enum Answer {
    N,
    Y = 'Yes'
}

// 枚举成员

// Role.Repoter = 2 // Cannot assign to 'Repoter' because it is a read-only property.ts(2540)
// 枚举成员的值是只读的

// 枚举成员有三种类型
// 1. const 常量类型，会在编译时计算结果，运行时以常量形式出现
// 2. computed 计算类型，非常量的表达式，在运行时计算
enum Char {
    a, // const
    b = Char.a, // const 对已有常量成员的引用
    c = 1 + 3, // const 常量表达式
    d = Math.random(), // computed
    e = '123'.length, // computed
    // f, Enum member must have initializer.ts(1061)
    f2 = 4
}
// "use strict";
// var Char;
// (function (Char) {
//     Char[Char["a"] = 0] = "a";
//     Char[Char["b"] = 0] = "b";
//     Char[Char["c"] = 4] = "c";
//     Char[Char["d"] = Math.random()] = "d";
//     Char[Char["e"] = '123'.length] = "e";
// })(Char || (Char = {}));

// 常量枚举 用 const 声明的枚举
const enum Month {
    Jan,
    Feb,
    Mar,
    Apr = Month.Mar + 1,
    // May = () => 5
}
// 常量枚举在编译阶段会被删除，下面是编译后的代码
// "use strict";

let mouth = [Month.Jan, Month.Feb]
// "use strict";
// let mouth = [0 /* Jan */, 1 /* Feb */];
// 枚举被直接替换成了常量


// 枚举类型 枚举和枚举成员可以作为单独的类型
enum E { a, b } // 成员没有初始值
enum F { a = 0, b = 1 } // 所有成员都是数值
enum G { a = 'apple', b = 'banana' } // 所有成员都是字符串

let e: E = 3
let f: F = 3
// console.log(e === f) This condition will always return 'false' since the types 'E' and 'F' have no overlap.ts(2367)
// 不同的枚举类型不能比较

let e1: E.a = 3
let e2: E.b = 3
let e3: E.a = 3
// console.log(e1 === e2) This condition will always return 'false' since the types 'E.a' and 'E.b' have no overlap.ts(2367)
// 不同的枚举成员不能比较
console.log(e1 === e3) // true

let f1: F.a = 3
let f2: F.b = 3
let f3: F.a = 3
console.log(f1 === f3)

// 字符串枚举的取值只能是枚举成员的类型
let g1: G = G.a
let g2: G.a = G.a