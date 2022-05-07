function testable(target) {
    target.testable = true;
}

@testable
class ExampleClassDecorator {}

// 等同于
// class ExampleClassDecorator {}
// ExampleClassDecorator = testable(ExampleClassDecorator) || ExampleClassDecorator;

console.log(ExampleClassDecorator.testable) // true

function testableWrap(isTestable) {
    return function(target) {
        target.testable = isTestable;
    }
}

@testableWrap(true)
class ExampleClassDecoratorWrap {}

console.log(ExampleClassDecoratorWrap.testable) // true

// 装饰器对类的行为的改变，是代码编译时发生的，而不是在运行时。这意味着，装饰器能在编译阶段运行代码。
// 装饰器本质就是编译时执行的函数。

// 前面的例子是为类添加一个静态属性，如果想添加实例属性，可以通过目标类的 prototype 对象操作

function testableInstance(target) {
    target.prototype.testable = true;
}

@testableInstance
class ExampleClassDecoratorInstance {}
let obj = new ExampleClassDecoratorInstance();

console.log(ExampleClassDecoratorInstance.testable) // undefined
console.log(obj.testable) // true
