const path = require('path');
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin'); // 将单个文件或整个目录（已存在）复制到构建目录。
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // 分离 css 文件，通过 link 标签引入
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); // 清理输出目录下的文件
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin; // 一款分析 bundle 内容的插件及 CLI 工具，以便捷的、交互式、可缩放的树状图形式展现给用户。

// 使用 express 搭建的本地开发服务器
const serve = require('./webpack.serve');

module.exports = (env = {}, argv = {}) => {
  console.log(env.ENV, env.MODE, env);

  const environment = env.ENV || 'development'; // 环境变量
  const SC_Path = path.resolve(__dirname, 'src'); // 源代码目录路径
  const outPath = environment === 'production' ? 'dist' : 'develop'; // 输出目录 / 构建目录

  const webpackConfigObject = {
    mode: environment,

    entry: {
      index: entryFN('index'),
      note: entryFN('note'),
      ['404']: entryFN('404')
    },

    resolve: {
      // extensions: ['.js', '.vue', '.json'],
      alias: {
        vue$: 'vue/dist/vue.esm.js',
        '@': SC_Path
      }
    },

    plugins: [
      new CleanWebpackPlugin(),
      new CopyWebpackPlugin({
        patterns: [
          { from: 'src/vendor/flexible.js', to: `vendor/flexible.js` },
          { from: 'src/vendor/live2d_widget', to: `vendor/live2d_widget` }
        ]
      }),
      new MiniCssExtractPlugin({ filename: `css/[name].[hash].css`, chunkFilename: `css/[name].[hash].css` }),
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'windows.$': 'jquery',
        'windows.jQuery': 'jquery'
      }),
      HtmlWebpackPluginFN('index'),
      HtmlWebpackPluginFN('note'),
      HtmlWebpackPluginFN('404')
    ],

    module: {
      rules: [
        { test: /\.css$/, use: [MiniCssExtractPlugin.loader, { loader: 'css-loader', options: { sourceMap: true } }] },
        {
          test: /\.s[ac]ss$/i,
          use: [MiniCssExtractPlugin.loader, { loader: 'css-loader', options: { sourceMap: true } }, { loader: 'sass-loader', options: { implementation: require('sass'), sourceMap: true } }]
        },
        { test: /\.(eot|svg|ttf|woff|woff2|otf)$/, use: 'url-loader' },
        { test: /\.(jpg|jpeg|png|gif)$/, use: { loader: 'url-loader', options: { limit: 1024 * 2, name: `/assets/images/[hash].[ext]` } } }
      ]
    },

    optimization: {
      // 找到chunk中共享的模块,取出来生成单独的chunk
      splitChunks: {
        chunks: 'all', // async表示抽取异步模块，all表示对所有模块生效，initial表示对同步模块生效
        automaticNameDelimiter: '-',
        cacheGroups: {
          vendors: {
            name: 'common',
            minSize: 1,
            maxSize: 1024 * 1024, // 通过此配置将抽离的公共 Chunk 按照插件拆分为合适大小的文件（不一定会按照此配置严格执行）
            test: /[\\/]node_modules[\\/]/,
            priority: -10
          }
        }
      }
    },

    output: {
      filename: `javascript/[name].[hash].js`, // 输出资源根目录的 路径 + 文件名
      path: path.resolve(__dirname, outPath), // 输出资源根目录的位置
      publicPath: `/${outPath}`, // 在 HTML 文件中的资源根目录路径
      chunkFilename: `javascript/common/[name].[hash].js` // 拆分的 Chunk 路径 + 文件名
    }
  };

  if (environment === 'production') {
    // 生产环境
    // 添加依赖分析插件
    // webpackConfigObject.plugins.push(new BundleAnalyzerPlugin());
  } else if (environment === 'development') {
    // 开发环境

    // 监视文件变化
    webpackConfigObject.watch = true;
    webpackConfigObject.watchOptions = {
      ignored: /node_modules/
    };

    // 开发环境才有资源映射
    webpackConfigObject.devtool = 'inline-source-map';

    serve({
      outPath,
      port: 9763
    });
  }

  function entryFN(page) {
    return path.resolve(__dirname, `src/pages/${page}/index.js`);
  }

  function HtmlWebpackPluginFN(page) {
    return new HtmlWebpackPlugin({
      template: `src/pages/${page}/index.html`,
      filename: `page/${page}.html`,
      hash: true, // 页面上资源文件尾部带 hash
      favicon: `src/favicon.ico`,
      projectPath: `/${outPath}`, // 传递到 HTML 文件目录变量，用以替换那些不参与打包的文件路径
      scriptLoading: 'defer', // 现代浏览器支持非阻塞javascript加载（'defer'），以提高页面启动性能。
      inject: true, // 将打包好的 JavaScript 文件通过 script 标签引入 放在 body 标签的底部而不是 head 标签内
      chunks: [page] // // 提取注入html的js文件
    });
  }

  return webpackConfigObject;
};
