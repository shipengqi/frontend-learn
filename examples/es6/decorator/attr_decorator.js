function readonly(target, name, descriptor){
    // descriptor 对象原来的值如下
    // {
    //   value: specifiedFunction,
    //   enumerable: false,
    //   configurable: true,
    //   writable: true
    // };
    descriptor.writable = false;
    return descriptor;
}

// readonly(ExampleClassAttrDecorator.prototype, 'name', descriptor);
// 类似于
// Object.defineProperty(ExampleClassAttrDecorator.prototype, 'name', descriptor);
// 装饰器第一个参数是类的原型对象，上例是 ExampleClassAttrDecorator.prototype，装饰器的本意是要“装饰”类的实例，但是这个时候实例还没生成，所以只能去
// 装饰原型（这不同于类的装饰，那种情况时target参数指的是类本身）；第二个参数是所要装饰的属性名，第三个参数是该属性的描述对象。

function log(target, name, descriptor) {
    var oldValue = descriptor.value;

    descriptor.value = function() {
        console.log(`Calling ${name} with`, arguments);
        return oldValue.apply(this, arguments);
    };

    return descriptor;
}

class ExampleClassAttrDecorator {
    @readonly
    @log
    name() { return `${this.first} ${this.last}` }

    @log
    add(a, b) {
        return a + b;
    }
}

const attre = new ExampleClassAttrDecorator();

attre.name() // Calling name with [Arguments] {}
attre.add(2, 4); // Calling add with [Arguments] { '0': 2, '1': 4 }
