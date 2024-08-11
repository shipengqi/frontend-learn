# 静态语言和动态语言

静态语言在编译阶段确定所有变量的类型，动态语言在运行阶段确定变量的类型。

从内存分配的角度，以 js 和 c++ 为例：

```javascript
Class C {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
```

```c
class C {
    public:
    int x;
    int y;
}
```

Javascript：

- 在程序运行时，动态计算属性的偏移量
- 需要额外的空间存储属性名
- 所有对象的偏移量信息各存一份

C++：

- 编译阶段确定属性偏移量
- 用偏移量访问代替属性访问
- 偏移量信息共享
