# 复杂类型

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
