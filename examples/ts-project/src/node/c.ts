let c1 = require('./a')
let c2 = require('./b')

// 不要混用 commonjs 和 es6 的导入导出，例如下面用 es6 的 export default，和 commonjs 的 require
let c3 = require('../es6/a')

// 使用这种方式可以导入 es6 模块
// import c4 = require('../es6/d') // Import may be converted to a default import.ts(80003)
// 也可以使用下面 es6 的方式直接导入
import c4 from '../es6/a'

console.log(c1)
console.log(c2)
// c3() 直接运行会报错 c3 is not a fucntion
console.log(c3) // {a: 1, b: 2, c: 3, f: ƒ, G: ƒ, …} c3 是一个对象
c3.default() // I'm default

c4() // I'm default