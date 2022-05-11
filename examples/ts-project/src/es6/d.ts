// ts 提供的一种兼容 commonjs 的语法
// 下面这个相当于 module.exports = ... 是顶级导出
export = function () {
    console.log("I'm default")
}

// export let a = 3 // An export assignment cannot be used in a module with other exported elements.ts(2309)
// 如果有多个成员需要导出，就合并到一个对象