# 原始类型

Javascript 声明变量：

```javascript
let num = 1;
```

TypeScript 语法与 JavaScript 语法的区别在于，可以在 TypeScript 中显式声明变量 `num` 是数字类型：

```typescript
// number 表示数字类型，: 用来分割变量和类型的分隔符
let num: number = 1;
```

## 原始类型

JavaScript 中，原始类型指的是非对象且没有方法的数据类型，它包括 `string`、`number`、`bigint`、`boolean`、`undefined` 和 `symbol` 六种。

`null` 是一个伪原始类型，它在 JavaScript 中实际上是一个对象，且所有的结构化类型都是通过 `null` 原型链派生而来。

JavaScript 和 TypeScript 中原始类型值是最底层的实现。

### 字符串

`string` 表示 JavaScript 中任意的字符串（包括模板字符串）

```typescript
let firstname: string = 'Captain'; // 字符串字面量
let familyname: string = String('S'); // 显式类型转换
let fullname: string = `my name is ${firstname}.${familyname}`; // 模板字符串
```

### 数字

`number` 类型表示十进制整数、浮点数，以及二进制数、八进制数、十六进制数：

```typescript
/** 十进制整数 */
let integer: number = 6;
/** 十进制整数 */
let integer2: number = Number(42);
/** 十进制浮点数 */
let decimal: number = 3.14;
/** 二进制整数 */
let binary: number = 0b1010;
/** 八进制整数 */
let octal: number = 0o744;
/** 十六进制整数 */
let hex: number = 0xf00d;
```

`bigint` 类型表示大整数：

```typescript
let big: bigint = 100n;
```

> 虽然 `number` 和 `bigint` 都表示数字，但是这两个类型不兼容。

### 布尔值

`boolean` 表示 True 或者 False

```typescript
let TypeScriptIsGreat: boolean = true;
```

### Symbol

TypeScript 开始支持 `Symbol` 原始类型，可以通过 `Symbol` 构造函数，创建一个独一无二的标记；同时，还可以使用 `symbol` 表示类型：

```typescript
let sym1: symbol = Symbol();
let sym2: symbol = Symbol('42');
```

**TypeScript 还包含 Number、String、Boolean、Symbol 等类型（注意区分大小写），别将它们和小写格式对应的 number、string、boolean、symbol 进行等价**。
