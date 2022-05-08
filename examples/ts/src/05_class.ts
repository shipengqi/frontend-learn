// ts 和 es6 都是实例属性和实例方法
// 类的所有属性默认都是 public，也可以显示声明，如 public name: string
// 私有属性员只能被类的本身调用，不能被类的实例和子类调用
class Dog {
    constructor(name: string) {
        this.name = name
    }
    // 如果在 constructor 加 private，那么这个类不能被继承和实例化
    // Constructor of class 'Dog' is private and only accessible within the class declaration.ts(2673)
    // Cannot extend a class 'Dog'. Class constructor is marked as private.ts(2675)
    // private constructor(name: string) {
    //     this.name = name
    // }

    // 如果在 constructor 加 protected，那么这个类可以被继承，但是不能被实例化
    // Constructor of class 'Dog' is protected and only accessible within the class declaration.ts(2674)
    // protected constructor(name: string) {
    //     this.name = name
    // }

    public name: string // 实例的属性必须有初始值 否则会报错 Property 'name' has no initializer and is not definitely assigned in the constructor.ts(2564)
    // 可以在 constructor 中初始化，也可以使用下面的两种方式
    // name: string = 'dog'
    // name?: string = 'dog'
    run() {}
    private pri() {} // 私有属性 只能被类的本身调用，不能被类的实例和子类调用
    protected pro() {} // 受保护属性只能在类和子类中访问，不能被实例访问
    readonly legs: number = 4 // 只读属性，必须初始化
    static food: string = 'bones' // 静态属性, 只能通过类名来调用
}

console.log(Dog.prototype) // {constructor: ƒ, run: ƒ}
console.log(Dog.food) // bones

let dog = new Dog('wangwnag')
console.log(dog) // Dog {name: 'wangwnag'} name 属性在实例上

// 私有成员不能被类的实例调用
// dog.pri() // Property 'pri' is private and only accessible within class 'Dog'.ts(2341)
// 受保护成员只能在类和子类中访问，不能被实例访问
// dog.pro() // Property 'pro' is protected and only accessible within class 'Dog' and its subclasses.ts(2445)

// 类的继承
class Huskey extends Dog {
    // 在构造函数中的参数前添加修饰符，会将参数变成实例属性，不需要额外声明
    constructor(name: string, public color: string) { // Constructors for derived classes must contain a 'super' call.ts(2377)
        super(name)
        this.color = color;
        // 私有成员不能被类的子类调用
        // this.pri(); // Property 'pri' is private and only accessible within class 'Dog'.ts(2341)
        // 受保护成员可以在子类中访问
        this.pro();
    }

    // public color: string // 参数中的 color 添加了修饰符，因此这里不需要声明，否则报错 Duplicate identifier 'color'.ts(2300)
}

// 类的静态属性 可以被子类继承
console.log(Huskey.food) // bones

let huskey = new Huskey('wangwnag', 'black')


console.log(huskey) // Dog {name: 'wangwnag'} name 属性在实例上

// 抽象类和多态
// es6 中没有抽象类的概念，抽象类表示只能被继承不能被实例化的类
// 抽象类的好处是可以抽离一些代码的共性，有利于代码的复用和扩展
// 抽象类还可以实现多态，抽象方法由不同的子类实现，程序运行时不同的对象调用不同的方法

// 抽象类 Animal
abstract class Animal {
    eat() { // 抽象类中实现的方法，子类可以不用实现，这样可以实现方法的复用
        console.log('eating')
    }
    abstract sleep(): void // 抽象方法不需要实现，由子类实现
}

// 抽象类不能被实例化
// let animal = new Animal() // Cannot create an instance of an abstract class.ts(2511)

class Dog2 extends Animal {
    constructor(name: string) {
        super()
        this.name = name
    }
    name: string
    run() {}
    sleep() {
        console.log('sleeping')
    }
}

let dog2 = new Dog2('wangwang')
dog2.eat() // eating

class Cat extends Animal {
    sleep() {
        console.log('cat sleeping')
    }
}

let cat = new Cat()

// 多态的使用
let animals: Animal[] = [dog2, cat]

animals.forEach(i => {
    i.sleep()
})


// 链式调用
class WorkFlow {
    step1() {
        return this;
    }

    step2() {
        return this;
    }
}

new WorkFlow().step1().step2()

// this 可以调用子类和父类的属性
class SubFlow extends WorkFlow {
    next() {
        return this;
    }
}

new SubFlow().next().step1().next()