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

## Array
## 元组类型（Tuple）
## any
## unknown
## void、undefined、null
## never
## object
## 类型断言

```typescript
const arrayNumber: number[] = [1, 2, 3, 4];
const greaterThan2: number = arrayNumber.find(num => num > 2); // 提示 ts(2322)
```