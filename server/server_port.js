const { ServerApp } = require('./config/server_config/server_config.js');

let params = {
  name: '9527',
  url: '127.0.0.1',
  rootPath: '/',
  port: 9527,
  static: {
    // '实际响应的目录或文件': ['页面请求的目录或文件数组'],
    'root/node_server/web_root/front_end/favicon.ico': ['/favicon.ico'],
    'root/node_server/web_root/front_end/assets': ['/assets'],
    'root/node_server/web_root/front_end/html/index.html': ['/index.html'],
    'root/node_server/web_root/front_end/html/404.html': ['/404.html'],
    'root/node_server/web_root/front_end/html/note.html': ['/note.html'],
    'root/node_server/web_root/front_end/html/tssp.html': ['/tssp.html'],
    'root/node_server/web_root/front_end/html/test_info.html': ['/test_info.html']
  },
  indexPage: {
    enabled: true,
    indexUrl: ['/', '/index.html'],
    indexPath: 'root/node_server/web_root/front_end/html/index.html'
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
