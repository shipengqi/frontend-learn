declare function globalLib(options: globalLib.Options): void;

// 利用了命名空间的声明合并
declare namespace globalLib {
    const version: string;
    function doSomething(): void;
    // interface Options 可以不暴露给全局
    interface Options {
        [key: string]: any
    }
}