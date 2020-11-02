// 原生模块
const path = require('path');

const { ServerApp } = require('./server/config/server_config/server_config.js');

module.exports = (webpackParams) => {
  const rootPath = path.join(__dirname);
  const outPath = webpackParams.outPath;

  let params = {
    url: '127.0.0.1',
    rootPath: './',
    port: webpackParams.port || 9763,
    static: {
      // '实际响应的目录或文件': ['页面请求的目录或文件数组'],
      [`${rootPath}/${outPath}`]: [`/${outPath}`],
      [`${rootPath}/${outPath}/page`]: [`/page`],
      [`${rootPath}/${outPath}/page`]: ['/']
    },
    indexPage: {
      enabled: true,
      indexUrl: ['/', '/index.html'],
      indexPath: `${rootPath}/${outPath}/page/index.html`
    },
    page404: {
      enabled: true,
      page404Url: '/404.html',
      page404Type: /\.html/
    },
    proxy: [
      {
        enabled: false,
        proxyPath: ['**/*.json', '**/resources/**', '**/frames/404_iframe.html'],
        options: { target: 'http://test2.lieqinews.com', changeOrigin: true }
      }
    ]
  };

  const app = new ServerApp(params);
};
