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


### 枚举

枚举：一组有名字的常量集合。


### 接口

接口可以用来约束对象，函数，类的结构和类型，不能改变。

### 函数

### 类

ts 类覆盖了 es6 的类，同时引入了一些其他特性

- 类可以相互继承
- 类可以实现接口，接口只能约束类的 public 属性
- 接口可以相互继承
- 接口可以继承类，继承类时会抽离类的 public，private，protected 属性

## 泛型

比如一个打印函数：

```typescript
fucntion log(str: string): string {
    console.log(str);
    return value;
}
```

如果这时候想要这个函数可以接受一个字符串数组，应该怎么办？

一种方式是使用函数重载：

```typescript
fucntion log(value: string): string
fucntion log(value: string[]): string[]
fucntion log(value: any): any {
    console.log(value);
    return value;
}
```

还可以使用联合类型来实现：

```typescript
fucntion log(value: string | string[]): string | string[] {
    console.log(value);
    return value;
}
```

如果希望函数可以接受任意类型的参数，可以直接使用 any 类型：

```typescript
fucntion log(value: any): any {
    console.log(value);
    return value;
}
```

但是 any 类型没有类型约束，函数的参数和返回值的类型可以是不一致的，没有了约束。

那么我们可以利用泛型来实现：

```typescript
function log<T>(value: T): T {
    console.log(value);
    return value;
}
```

类型 T 不需要指定，相当于 any，但是又保证了参数和返回值的类型是一致的。

泛型的好处：

1. 函数和类可以很简单的支持多种类型，增强了扩展性
2. 不必谢多条函数重载
3. 灵活控制类型之间的约束

## 索引签名

`{[key: string]: string}` 语法是 TypeScript 中的索引签名，代表一个键值结构，当我们事先不知道类型属性的所有名称但知道值的类型时使用。 索引签名可以指定键和值的类型。

```typescript
// function returning index signature
// (a key-value structure with key and value strings)
function getObj(): { [key: string]: string } {
  return { name: 'Tom', country: 'Chile' };
}

// Interface using index signature
interface Person {
    [index: string]: string;
}

const p1: Person = { name: 'Tom', country: 'Chile' };

type Animal = {
    [index: string]: string;
};

const a1: Animal = { name: 'Alfred', type: 'dog' };
```

向不在联合中的类型添加属性会导致错误：
```typescript
interface Person {
  [index: string]: string | number;
  age: number;
  name: string;
  // ERROR: Property 'colors' of type 'string[]' is not assignable
  // to 'string' index type 'string | number'.ts(2411)
  colors: string[];
}
```

还可以将索引签名设置为 `readonly`：

```typescript
interface ReadonlyObj {
  readonly [index: string]: string;
}

const obj: ReadonlyObj = {
  name: 'Tom',
  country: 'Chile',
};

// Index signature in type 'ReadonlyObj'
// only permits reading.
obj.name = 'Alfred';
```
