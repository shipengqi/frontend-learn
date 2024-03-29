## 类型检查

### 类型推断

不需要指定变量的类型或函数返回值的类型，ts 可以自动的推断出一个类型。

- 基础类型推断
- 最佳通用类型推断
- 上下文类型推断

### 类型兼容性

当一个类型 Y 可以被赋值为另一个类型 X 时，就可以说类型 X 兼容类型 Y。

### 类型保护

ts 能够在特定的区块中保证变量属于某种确定的类型。可以在此区块中放心的引用此类型的属性，或者方法。


## 交叉类型和联合类型

交叉类型就是指将多个类型合并为一个类型，新的类型具有所有的类型的特性。

## 索引类型

## 映射类型

映射类型 可以从一个旧的类型生成一个新的类型

映射类型 本质上就是预先定义的泛型接口，通常还会结合索引类型，获取对象的属性和属性值，从而映射成我们想要的结构。


## 条件类型

由条件表达式所决定的类型：`T extends U ? X : Y` 意思就是如果类型 T 可以被赋值给类型 U，那么得到的结果就是类型 X，否则就是类型 Y。

条件类型使类型不是唯一性的，增加了灵活性。


## ? 和 !

### 可选属性 `?`

`height?: number;` 等价于 `height: number | undefined;`

### 非空断言 `!`

`!` 表成员不会为 `null` 或 `undefined`
