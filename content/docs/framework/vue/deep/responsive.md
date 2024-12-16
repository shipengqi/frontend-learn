# Vue 响应式原理

Vue 响应式系统是基于`Object.defineProperty`实现的，我们先了解一下`Object.defineProperty`。

## Object.defineProperty

`Vue`最核心的方法便是通过`Object.defineProperty()`实现对属性的劫持，监听数据变动。先了解一下`Object.defineProperty`。
`Object.defineProperty`方法允许通过属性描述对象，定义或修改一个属性，然后返回修改后的对象，用法：
```javascript
Object.defineProperty(object, propertyName, attributesObject)

//例子
var student = Object.defineProperty({}, 'name', {
  value: 'xiaoming',
  writable: false,
  enumerable: true,
  configurable: false
});

obj.name // 'xiaoming'

obj.name = 'xiaogang';
obj.name // 'xiaoming'
```
`Object.defineProperty`方法有三个参数：
- `object`：定义或修改属性的对象(`Object`)
- `propertyName`：属性名（`String`）
- `attributesObject`：属性描述对象(`Object`)
  - `value`：属性的值，默认是`undefined`
  - `writable`：(`Boolean`) 属性值是否可写，默认为`true`
  - `enumerable`：(`Boolean`) 属性是否可遍历，默认为`true`。如果设为`false`，会使得某些操作（比如`for...in`循环、`Object.keys()`）跳过该属性。
  - `configurable`：(`Boolean`) 是否可配置，默认为`true`。如果设为`false`，将阻止某些操作，比如无法删除该属性，也不得改变该属性的属性描述对象（`value`属性除外）。
  也就是说，`configurable`属性控制了属性描述对象的可写性。
  - `get`：是一个函数，表示该属性的取值函数（`getter`），默认为`undefined`。
  - `set`：是一个函数，表示该属性的存值函数（`setter`），默认为`undefined`。

> **注意，一旦定义了取值函数`get`（或存值函数`set`），就不能将`writable`属性设为`true`，或者同时定义`value`属性，否则会报错。**