const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); // 清理输出目录下的文件

console.log(JSON.stringify(process.env.NODE_ENV));
console.log(process.mode);

module.exports = {
  mode: 'production',

  entry: {
    index: path.resolve(__dirname, 'src/javascript/index/index.js')
    // jquery: 'jq'
  },

  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      // title: 'xxxx',
      chunks: ['index'], // 按需引入对应名字的js文件
      template: './src/page/index.html'
    }),
    new CleanWebpackPlugin({ verbose: true, protectWebpackAssets: false })
  ],

  output: {
    filename: './javascript/[name]/[name].[hash].js',
    chunkFilename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};
