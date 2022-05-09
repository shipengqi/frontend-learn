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