// 在 namespace 声明的变量，只在当前 namespace 中可见，如果想要某个成员全局可见，就要使用 export 导出
var Shape;
(function (Shape) {
    var pi = Math.PI;
    function cricle(r) {
        return pi * Math.pow(r, 2);
    }
    Shape.cricle = cricle;
})(Shape || (Shape = {}));
