## 命名空间

命名空间可以避免全局污染。在引入一些全局的类库时，可以通过命名空间来解决全局污染的问题。

命名空间不要和模块混用。命名空间最好在一个全局环境中使用。


## 声明合并

声明合并是指把多个地方具有相同名称的声明合并到一起。例如在代码的多个地方定义了同样名称的接口，声明合并可以避免遗漏。

## 声明文件

声明文件是 ts 用来引入外部类库的。

对于引入的非 ts 类库，必须为其编写声明文件，暴露其 API。

有时候一些类库的源码中就已经包含了声明文件。但是有一些的类库的声明文件是单独提供的，需要另外安装。

大多数的类库声明文件，社区都有提供。可以安装一个类型声明包 `@types/<package>`，例如 `@types/jquery`。

开发中如果想要查找一个非 ts 类库的声明文件可以通过这个：[Type Search](https://www.typescriptlang.org/dt/search?search=)

如果没有，就需要自己去写声明文件。

`declare` 可以声明一个外部变量。

三种类库：`global`，`module`，`umd`


## tsconfig

### 文件相关的选项

```json
{
    "files": [
        // "src/a.ts"
    ], // 编译器需要编译的单个文件列表
    "include": [
        // "src" // 编译 src 目录及其子目录下的文件
        // "src/*" // 编译 src 一级子目录下的文件
        // "src/*/*" // 编译 src 二级子目录下的文件
    ], // 编译器需要编译的文件或者目录列表
    "exclude": [
        // "src/libs"
    ], // 编译器需要排除的文件或者目录列表
}
```


配置文件之间是可以继承的，可以把基础的配置抽取出来，然后通过 `extends` 来导入：

```json
{
    "extends": "./tsconfig.base.json",
    "exclude": [] // 这会覆盖基础文件中的配置选项
}
```


### 编译相关的选项

```json
{
    "compilerOptions": {
        // "incremental": true,                // 增量编译，在编译后生成存储编译信息的文件，下次编译时可以使用，来提高编译的效率
        // "tsBuildInfoFile": "./buildFile",   // 增量编译文件的存储位置
        // "diagnostics": true,                // 打印诊断信息
  
        // "target": "es5",           // 目标语言的版本
        // "module": "commonjs",      // 生成代码的模块标准
        // "outFile": "./app.js",     // 将多个相互依赖的文件生成一个文件，可以用在 AMD 模块中
  
        // "lib": [],                 // TS 需要引用的库，即声明文件，es5 默认 "dom", "es5", "scripthost"
  
        // "allowJs": true,           // 允许编译 JS 文件（js、jsx）
        // "checkJs": true,           // 允许在 JS 文件中报错，通常与 allowJS 一起使用
        // "outDir": "./out",         // 指定输出目录
        // "rootDir": "./",           // 指定输入文件目录（用于输出）
  
        // "declaration": true,         // 自动生成声明文件
        // "declarationDir": "./d",     // 声明文件输出的路径
        // "emitDeclarationOnly": true, // 只生成声明文件，不会生成 js 文件
        // "sourceMap": true,           // 生成目标文件的 sourceMap
        // "inlineSourceMap": true,     // 生成目标文件的 inline sourceMap
        // "declarationMap": true,      // 生成声明文件的 sourceMap
        // "typeRoots": [],             // 声明文件目录，默认 node_modules/@types
        // "types": [],                 // 指定需要加载的声明文件包，如果指定某一个包，就只会加载指定的这个包的声明文件
  
        // "removeComments": true,    // 删除注释
  
        // "noEmit": true,            // 不输出文件，相当于什么也没做
        // "noEmitOnError": true,     // 发生错误时不输出任何文件
  
        // "noEmitHelpers": true,     // 不生成 helper 函数（需额外安装 ts-helpers，可以使用 importHelpers 替代）
        // "importHelpers": true,     // 通过 tslib 引入 helper 函数，文件必须是模块
  
        // "downlevelIteration": true,    // 降级遍历器的实现（如果目标语言是 es3/5，遍历器会有一个比较低级的实现）
  
        // "strict": true,                        // 开启所有严格的类型检查，如果开启，下面所有 strcit 相关的选项都是 true
        // "alwaysStrict": false,                 // 在代码中注入 "use strict";
        // "noImplicitAny": false,                // 不允许隐式的 any 类型
        // "strictNullChecks": false,             // 不允许把 null、undefined 赋值给其他类型变量
        // "strictFunctionTypes": false,           // 不允许函数参数双向协变
        // "strictPropertyInitialization": false, // 类的实例属性必须初始化
        // "strictBindCallApply": false,          // 严格的 bind/call/apply 检查
        // "noImplicitThis": false,               // 不允许 this 有隐式的 any 类型
  
        // 下面四个是函数相关的，是 warning
        // "noUnusedLocals": true,                // 检查只声明，未使用的局部变量
        // "noUnusedParameters": true,            // 检查未使用的函数参数
        // "noFallthroughCasesInSwitch": true,    // 防止 switch 语句贯穿（语句贯穿是指：switch 语句的分支中，如果分支没有 break 语句，分支语句会一次执行）
        // "noImplicitReturns": true,             // 每个分支都要有返回值
  
        // "esModuleInterop": true,               // 允许 export = 导出，由 import from 导入
        // "allowUmdGlobalAccess": true,          // 允许在模块中访问 UMD 全局变量
        // "moduleResolution": "node",            // 模块解析策略，可选值还有 "classic"（对应 AMD，System，ES6）
        // "baseUrl": "./",                       // 解析非相对模块的基地址
        // "paths": {                             // 路径映射，相对于 baseUrl
        //   "jquery": ["node_modules/jquery/dist/jquery.slim.min.js"]
        // },
        // "rootDirs": ["src", "out"],            // 将多个目录放在一个虚拟目录下，用于运行时，编译器认为这多个目录在一个目录下
  
        // "listEmittedFiles": true,        // 打印输出的文件
        // "listFiles": true,               // 打印编译的文件（包括引用的声明文件）
    }
}
```

### 工程引用

有时候会在一个 repo 中，存放多个需要单独构建的工程。如 `ts-project/src/reference/old` 目录下有三个工程：`client` `server` `common`。

在 `old` 目录下运行编译命令：`tsc`。这个时候编译的结果是：

```bash
- dist
  - src
    - client
    - server
    - common
```

如果不想要 `src` 目录，可以加上 `include`：

```json
{
    "compilerOptions": {
      "target": "es2016",
      "module": "commonjs",
      "strict": true,
      "outDir": "./dist"
    },
    "include": ["src"]
}
```

生成的目录结构是：
```bash
- dist
  - client
  - server
  - common
```

上面的方式并不能单独构建 client 或者 server，工程引用可以解决上面的问题。如 `ts-project/src/reference/new`。

这个目录在每个工程下创建自己的 tsconfig。`new` 目录下的 tsconfig：

```json
{
  "compilerOptions": {
        "target": "es2016",
        "module": "commonjs",
        "strict": true,
        "composite": true, // 表示工程可以被引用，支持增量编译
        "declaration": true,
        // "outDir": "./dist" // 去掉 outDir 又各个工程自己指定
  }
}
```

`client` 目录下的 tsconfig：

```json
{
    "extends": "../../tsconfig.json", // 继承了基础的 tsconfig
    "compilerOptions": {
        "outDir": "../../dist/client", // 指定了输出目录
    },
    "references": [ // 配置依赖的工程
        { "path": "../common" }
    ]
}
```

单独构建 server 工程： `tsc --build src/server --verbose`
单独构建 client 工程： `tsc --build src/client --verbose`


## 编译工具