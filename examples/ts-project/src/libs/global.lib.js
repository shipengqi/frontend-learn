function globalLib(options) {
    console.log(options);
}

globalLib.version = '1.0.0';

globalLib.doSomething = function() {
    console.log('globalLib do something');
};

// 全局类库要使用，先在 index.html 中引用
// 要在 ts 中使用还需要编写声明文件