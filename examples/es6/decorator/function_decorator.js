// 装饰器不能用于函数
// 因为存在函数提升

var counter = 0;

var add = function () {
    counter++;
};

@add
function foo() {
}

// 意图是执行后 counter 等于 1，但是实际上结果是 counter 等于 0

// 因为函数提升，使得实际执行的代码是下面这样
// var counter;
// var add;
//
// @add
// function foo() {
// }
//
// counter = 0;
//
// add = function () {
//   counter++;
// };
