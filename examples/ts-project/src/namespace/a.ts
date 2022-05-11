// 在 namespace 声明的变量，只在当前 namespace 中可见，如果想要某个成员全局可见，就要使用 export 导出
// 注意 namespace 中导出的成员不能重复定义
namespace Shape {
    const pi = Math.PI
    export function cricle(r: number) {
        return pi * r ** 2
    }
    // 注意 namespace 中导出的成员不能重复定义
    // export function square(x: number) {
    //     return x * x
    // }
}