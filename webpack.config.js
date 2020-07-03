const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const javascript = {
  target: 'web',
  // 指定 webpack 的模式 生产环境
  mode: 'production',
  // 入口文件
  entry: {
    index: './src/javascript/index.js'
  },
  // 出口文件
  output: {
    filename: 'dist/javascript/[name].[hash].js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './src/page/index.html',
      filename: 'page/index.html'
    })
  ]
};

module.exports = [javascript];
