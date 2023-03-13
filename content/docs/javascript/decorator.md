# 装饰器

装饰器是一种函数，写成@ + 函数名，可以用来装饰四种类型的值。

- 类
- 类的属性
- 类的方法
- 属性存取器（accessor）

## 类装饰器
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

**装饰器函数的第一个参数，就是所要装饰的目标类。装饰器对类的行为的改变，是代码编译时发生的，而不是在运行时**。

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

```typescript
class Math {
  @log
  add(a, b) {
    return a + b;
  }
}

function log(target, name, descriptor) {
  var oldValue = descriptor.value;

  descriptor.value = function() {
    console.log(`Calling ${name} with`, arguments);
    return oldValue.apply(this, arguments);
  };

  return descriptor;
}

const math = new Math();

// passed parameters should get logged now
math.add(2, 4);
```
