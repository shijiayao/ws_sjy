const path = require('path');
const ManifestPlugin = require('webpack-manifest-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  // 指定 webpack 的模式 生产环境
  mode: 'development',
  // 入口文件
  entry: {
    index: './src/javascript/index.js'
  },
  // 出口文件
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new ManifestPlugin(),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './src/page/index.html'
    })
  ],
  // 开启监视模式，监视文件内容的变化
  watch: true
};
