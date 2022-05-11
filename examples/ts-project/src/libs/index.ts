// install @types/jquery，就不会报错 cannot find jquery
import $ from 'jquery'

$('#app').css('color', 'red')

globalLib({x: 1}) // {x: 1}
globalLib.doSomething() // globalLib do something

import moduleLib from './module.lib'
moduleLib({y: 2}) // {y: 2}
moduleLib.doSomething() // moduleLib do something


// import umdLib from './umd.lib' // 如果注释掉，会报错：'umdLib' refers to a UMD global, but the current file is a module. Consider adding an import
// 将 tsconfig 中的 "allowUmdGlobalAccess": true, 打开就不回报错了
// 然后可以再 index.html 中全局引用 <script src="umd.lib.js"></script>
// umdLib.doSomething() // umdLib do something

// 模块插件
// 可以给一些类库添加自定义的方法
import m from 'moment';
// 如果不声明会报错：Property 'myFunction' does not exist on type 'typeof moment'.ts(2339)
declare module 'moment' {
    export function myFunction(): void;
}
m.myFunction = () => {}

// 全局插件
// 给全局变量添加一些自定义方法，不过会对全局的命名空间造成污染
declare global {
    namespace globalLib {
        function doAnyting(): void
    }
}
globalLib.doAnyting = () => {}

// 如果一个类库很大，那么声明文件可能会根据模块划分多个文件
// 例如 @type/jquery 的 index.d.ts
// /// <reference types="sizzle" />   // types 是模块依赖，ts 会在 @types 目录下寻找模块
// /// <reference path="JQueryStatic.d.ts" /> // path 是路径依赖，相对路径
// /// <reference path="JQuery.d.ts" />
// /// <reference path="misc.d.ts" />
// /// <reference path="legacy.d.ts" />

// export = jQuery;