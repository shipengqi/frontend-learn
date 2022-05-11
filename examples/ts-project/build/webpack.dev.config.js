const path = require("path");

// cheap: 忽略文件的列信息，module: 定位到 ts 源码，eval-source-map: 打包 source-map 文件
// https://webpack.js.org/configuration/devtool/
// console.log(path.resolve(__dirname, '../src/namespace'));
module.exports = {
    devtool: 'eval-cheap-module-source-map',
    // 这里需要配置一下静态文件目录，否则 index.html 中引用 js 文件时会报错 404 not found
    // https://webpack.docschina.org/configuration/dev-server/#directory
    devServer: {
        static: [
            {
                directory: path.resolve(__dirname, '../src/namespace')
            },
            {
                directory: path.resolve(__dirname, '../src/libs')
            },
        ]
    },
}