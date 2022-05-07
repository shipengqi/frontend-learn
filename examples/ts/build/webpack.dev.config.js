// cheap: 忽略文件的列信息，module: 定位到 ts 源码，eval-source-map: 打包 source-map 文件
// https://webpack.js.org/configuration/devtool/
module.exports = {
    devtool: 'eval-cheap-module-source-map'
}