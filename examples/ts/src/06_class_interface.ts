// 类与接口

// 定义一个接口来约束类的 公共属性
interface Human {
    name: string;
    eat(): void;
}

// implements 实现接口
// 类实现接口，必须实现接口的声明的所有属性
class Asian implements Human {
    constructor(name: string) {
        this.name = name;
    }
    name: string
    eat() {}
}

// 接口可以继承接口
interface Man extends Human {
    run(): void;
}

interface Child {
    cry(): void;
} 

// 继承多个接口
interface Boy extends Man, Child {

}

let boy: Boy = { // missing the following properties from type 'Boy': run, name, eat, cry
    name: '',
    run() {},
    eat() {},
    cry() {}
}

// 接口可以继承类，相当于把类的属性抽象了，只有类的属性结构，但是没有实现
// 注意 接口不仅抽离了类的公共属性，还抽离了私有属性和受保护属性
class Auto {
    state = 1
    // private state2 = 2 // Class 'C' incorrectly implements interface 'AutoInterface'. Property 'state2' is missing in type 'C' but required in type 'Auto'.ts(2420)
}

// 接口继承类，AutoInterface 就包含了 Auto 类的属性
interface AutoInterface extends Auto {

} 

// C 实现 AutoInterface，只需要包含 state 属性
class C implements AutoInterface {
    state = 1
}

// Auto 的子类也可以实现 AutoInterface 接口
// Bus 是 Auto 的子类，就不需要实现 state 属性，因为从父类 Auto 继承了
class Bus extends Auto implements AutoInterface {

}

