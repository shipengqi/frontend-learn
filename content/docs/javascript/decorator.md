# 装饰器

装饰器是一种函数，写成@ + 函数名，可以用来装饰四种类型的值。

- 类
- 类的属性
- 类的方法
- 属性存取器（accessor）

装饰器是一个函数：

```javascript
type Decorator = (value: Input, context: {
  kind: string;
  name: string | symbol;
  access: {
    get?(): unknown;
    set?(value: unknown): void;
  };
  private?: boolean;
  static?: boolean;
  addInitializer?(initializer: () => void): void;
}) => Output | void;
```

装饰器函数有两个参数。运行时，JavaScript 引擎会提供这两个参数。

- `value`：所要装饰的值，某些情况下可能是 `undefined`（装饰属性时）。
- `context`：上下文信息对象。

**装饰器对类的行为的改变，是代码编译时发生的，而不是在运行时**。

## 类装饰器

```javascript
type ClassDecorator = (value: Function, context: {
  kind: "class";
  name: string | undefined;
  addInitializer(initializer: () => void): void;
}) => Function | void;
```

类装饰器的第一个参数，就是被装饰的类。第二个参数是上下文对象，如果被装饰的类是一个匿名类，`name` 属性就为 `undefined`。

类装饰器可以返回一个新的类，取代原来的类，也可以不返回任何值。如果返回的不是构造函数，就会报错。

```typescript
@testable
class MyTestableClass {
    // ...
}

function testable(target) {
    target.isTestable = true;
}

MyTestableClass.isTestable // true
```

`@testable` 为 `MyTestableClass` 这个类加上了静态属性 `isTestable`。函数的参数 `target` 是 `MyTestableClass` 类本身。

可以在装饰器外面再封装一层函数：
```typescript
function testable(isTestable) {
  return function(target) {
    // 添加静态属性
    target.isTestable = isTestable;

    // 添加实例属性
    target.prototype.isTestable = true;
  }
}

@testable(true)
class MyTestableClass {}
MyTestableClass.isTestable // true

@testable(false)
class MyClass {}
MyClass.isTestable // false
```

## 类方法装饰器

```typescript
function logged(value, { kind, name }) {
    if (kind === "method") {
        return function (...args) {
            console.log(`starting ${name} with arguments ${args.join(", ")}`);
            const ret = value.call(this, ...args);
            console.log(`ending ${name}`);
            return ret;
        };
    }
}

class C {
    @logged
    m(arg) {}
}

// 方法装饰器会修改类的方法
// 相当于
// C.prototype.m = logged(C.prototype.m, {
//     kind: "method",
//     name: "m",
//     static: false,
//     private: false,
// })

new C().m(1);
// starting m with arguments 1
// ending m
```

方法装饰器的第一个参数就是所要装饰的方法。

方法装饰器可以返回一个新函数，取代原来的方法，也可以不返回值，表示依然使用原来的方法。如果返回其他类型的值，就会报错。

```javascript
// replaceMethod 返回了一个新函数，取代了原来的 hello 方法
function replaceMethod() {
  return function () {
    return `How are you, ${this.name}?`;
  }
}

class Person {
  constructor(name) {
    this.name = name;
  }
  @replaceMethod
  hello() {
    return `Hi ${this.name}!`;
  }
}

const robin = new Person('Robin');

robin.hello(), 'How are you, Robin?'
```

装饰器修改属性的描述对象（descriptor），然后被修改的描述对象再用来定义属性。
```javascript
class Math {
  @log
  add(a, b) {
    return a + b;
  }
}

function log(target, name, descriptor) {
  var oldValue = descriptor.value;

  descriptor.value = function(arguments) {
    console.log(`Calling ${name} with`, arguments);
    return oldValue.apply(this, arguments);
  };

  return descriptor;
}

const math = new Math();

// passed parameters should get logged now
math.add(2, 4);
```

装饰器第一个参数是类的原型对象，上例是 `Person.prototype`，装饰器的本意是要“装饰”类的实例，但是这个时候实例还没生成，所以只能去装饰原型（这不同于类
的装饰，那种情况时 `target` 参数指的是类本身）；第二个参数是所要装饰的属性名，第三个参数是该属性的描述对象。

如果同一个方法有多个装饰器，会像剥洋葱一样，先从外到内进入，然后由内向外执行。

```javascript
function dec(id){
  console.log('evaluated', id);
  return (target, property, descriptor) => console.log('executed', id);
}

class Example {
    @dec(1)
    @dec(2)
    method(){}
}
// evaluated 1
// evaluated 2
// executed 2
// executed 1
```

## 属性装饰器

属性装饰器的第一个参数是undefined，即不输入值。用户可以选择让装饰器返回一个初始化函数，当该属性被赋值时，这个初始化函数会自动
运行，它会收到属性的初始值，然后返回一个新的初始值。属性装饰器也可以不返回任何值。除了这两种情况，返回其他类型的值都会报错。

```javascript
function logged(value, { kind, name }) {
  if (kind === "field") {
    return function (initialValue) {
      console.log(`initializing ${name} with value ${initialValue}`);
      return initialValue;
    };
  }

  // ...
}

class C {
  @logged x = 1;
}

new C();
// initializing x with value 1
```

## 为什么装饰器不能用于函数？

装饰器只能用于类和类的方法，不能用于函数，因为存在函数提升。

## getter 和 setter 装饰器

```javascript
function logged(value, { kind, name }) {
    if (kind === "method" || kind === "getter" || kind === "setter") {
        return function (...args) {
            console.log(`starting ${name} with arguments ${args.join(", ")}`);
            const ret = value.call(this, ...args);
            console.log(`ending ${name}`);
            return ret;
        };
    }
}

class C {
    @logged
    set x(arg) {}
}

new C().x = 1
// starting x with arguments 1
// ending x
```
