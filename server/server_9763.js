const { ServerApp } = require('./config/server_config/server_config.js');

let catalog = '/root/ws_sjy';

catalog = 'D:/Work/Project/ws_sjy';

let params = {
  name: '9763',
  url: '127.0.0.1',
  rootPath: '/',
  port: 9763,
  static: {
    // '实际响应的目录或文件': ['页面请求的目录或文件数组'],
    [`${catalog}/dist`]: ['/dist'],
    [`${catalog}/dist/page/index.html`]: ['/index.html'],
    [`${catalog}/dist/page/404.html`]: ['/404.html'],
    [`${catalog}/dist/page/note.html`]: ['/note.html'],
    [`${catalog}/dist/page/tssp.html`]: ['/tssp.html'],
    [`${catalog}/dist/page/test_info.html`]: ['/test_info.html']
  },
  indexPage: {
    enabled: true,
    indexUrl: ['/', '/index.html'],
    indexPath: `${catalog}/dist/page/index.html`
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
