# ES6 和 CommonJs 的模块系统

Node.js 使用的是 CommonJs 模块系统

`node` 命令不能直接运行 ts 文件，可以把 ts 编译成 js 文件，也可以使用 `ts-node` 工具。

通过 `ts-node` 命令可以直接运行 ts 文件。如 `ts-node ./ts-project/src/node/c.ts`。

ts 对 ES6 和 CommonJs 的模块系统都可以支持。

生产环境中，如何处理两种模块系统？

在配置文件 `tsconfig.json` 中的配置选项：

- `compilerOptions.target` 需要编译成的目标语言的版本
- `compilerOptions.module` 需要把代码编译成的目标模块系统

也可以在命令行中指定这两个选项，如，`tsc ./ts-project/src/es6/a.ts -t es5`，`-t` 就是 `target`。

`tsc ./ts-project/src/es6/a.ts -m amd`，`-m` 就是 `module`。

## 顶级导出

### ES6 的顶级导出

`export default` 命令用于指定模块的默认输出（顶级导出）。显然，一个模块只能有一个默认输出，因此 `export default` 命令只能使用一次。所以，`import` 命令后面才不用加大括号，因为只可能唯一对应 `export default` 命令。

本质上，`export default` 就是输出一个叫做 `default` 的变量或方法，然后系统允许你为它取任意名字。

### CommonJs 的顶级导出

CommonJs 中一个模块只允许一个顶级导出，也就是 `module.exports`，如果一个模块有次级导出，就不能有顶级导出，否则顶级导出会覆盖次级导出。

例如文件 `b.js`：
```js
exoprts.c = 3
exports.d = 4

module.exports = {}
```

文件 `c.js`：
```js
let c2 = require('./b')
```

`c2` 是 `{}`