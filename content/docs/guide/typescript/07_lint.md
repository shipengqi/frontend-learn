# TSLint 和 ESLint

ts 官方已经弃用 TSLint 而转向 ESLint。原因 ESLint 的性能刚好，社区支持的也更好。

ts 的编译器可以做类型检查和语言转换，检查语法错误。ESLint 可以检查语法错误和代码风格。两者在功能上有一点重合。

ESLint 对 ts 的语法并不兼容，要使用 ESLint，需要使用 `typescript-eslint`。这个包对 ESLint 提供了解释 ts 代码的编译器。

项目中需要安装三个依赖：

- `eslint`
- `@typescript-eslint/eslint-plugin` 是 eslint 识别 ts 的语法
- `@typescript-eslint/parser` 为 eslint 提供的解析器

配置文件：

```json
{
    "parser": "@typescript-eslint/parser",
    "plugins": ["@typescript-eslint"],
    "parserOptions": {
        "project": "./tsconfig.json" // 有些规则可以使用 tsconfig 里面的信息
    },
    "extends": [
      "plugin:@typescript-eslint/recommended" // 使用官方推荐的规则
    ],
    "rules": {
      // eslint 希望使用 ts 的类型推断，不声明变量类型，例如 let hello: string = 'hello'
      // 使用这个配置关闭 
      "@typescript-eslint/no-inferrable-types": "off"
    }
}
```

## ESLint 插件

vs code 可以安装 ESLint 插件来执行代码检查。还可以在保存文件时，自动修复代码。