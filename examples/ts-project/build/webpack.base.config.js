const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require("path");

module.exports = {
    entry: './src/index.ts', // 入口文件
    output: {
        filename: 'app.js',  // 输出文件
        path: path.resolve(__dirname, "../dist") // https://github.com/johnagan/clean-webpack-plugin/issues/194
    },
    resolve: {
        extensions: ['.js', '.ts', '.tsx']
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/i,
                use: [{
                    loader: 'ts-loader' // ts 文件的 loader
                }],
                exclude: /node_modules/ // 排除 node_modules 下的文件
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({ // 自动嵌入 app.js
            template: './src/tmpl/index.html'
        })
    ]
}