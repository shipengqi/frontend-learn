const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
    plugins: [
        new CleanWebpackPlugin() // 成功构建之后清空 dist 目录
    ]
}