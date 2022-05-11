import { a, b, c } from './a'; // 批量导入
import { P } from './a';       // 导入接口
import { f as F } from './a';  // 导入时起别名
import * as All from './a';    // 导入模块中的所有成员，绑定在 All 上
import myFunction from './a';  // 不加{}，导入默认
import defaultName from './a'

console.log(a, b, c) // 1 2 3

let p: P = {
    x: 1,
    y: 1
}

console.log(All)

myFunction() // {a: 1, b: 2, c: 3, f: ƒ, G: ƒ, …}
defaultName() // I'm default