// 原生模块
const path = require('path');
const fs = require('fs');
const os = require('os');
const http = require('http');
const https = require('https');

// 插件模块
const express = require('express'); // node.js Web 应用框架
const bodyParser = require('body-parser'); // 获取post请求的参数：`req.body`，`body-parser` 中间件；
const multer = require('multer'); // 用于处理 multipart/form-data 类型的表单数据 node.js 中间件，它主要用于上传文件。注意: Multer 不会处理任何非 multipart/form-data 类型的表单数据。
const mime = require('mime'); // 文件 mime 类型
const compression = require('compression'); // 服务端 GZip 压缩
const { createProxyMiddleware, Filter, Options, RequestHandler } = require('http-proxy-middleware'); // 代理服务

// 自定义模块
const UTIL = require('../../utils/util.js');

/**
 * 本地服务器构造函数
 * @param {Object} params             参数对象
 * {
 *    url:         [String]  [选填]    本地服务地址，默认为 127.0.0.1
 *    rootPath:    [String]  [选填]    本地服务的根目录，默认为 './'
 *    port:        [Number]  [必填]    端口号
 *    static:      [Object]  [选填]    静态资源目录配置，键值对，键为实际响应目录或文件，值为页面请求的目录或文件数组
 *    indexPage:   [Object]  [选填]    指定访问首页的功能
 *    page404:     [Object]  [选填]    重定向到 404 页面设置
 *    proxy:       [Array]   [选填]    代理服务设置
 * }
 */
class ServerApp {
  constructor(params) {
    // server 参数
    this.url = params.url || '127.0.0.1';
    this.localIP = ''; // 本机 IP
    this.rootPath = params.rootPath || './'; // 根目录路径
    this.port = params.port; // 要开启服务的端口号

    // 代理服务设置
    this.proxy = params.proxy || [];

    // 指定访问首页的功能
    this.indexPage = params.indexPage;

    // 静态资源参数
    this.static = params.static || {}; // 静态资源对象

    // 重定向到 404 页面，只对每个请求链接做重定向，不会导致整个页面重定向
    this.page404 = params.page404 || {};

    this.init();
  }

  init() {
    let _this = this;

    // 创建 express 服务
    _this.app = express();

    // 需要考虑执行顺序
    _this.compression();
    _this.setHeader();
    _this.proxyRequest();
    _this.staticResource();
    _this.postRequest();
    _this.responseFiles();
    _this.openServer();
  }

  // 在响应文件前使用服务端 GZip 压缩
  compression() {
    let _this = this;

    _this.app.use(compression());
  }

  // 设置响应头
  setHeader() {
    let _this = this;

    // headers 参数
    let RespnseHeadersConfig = {
      // 'Access-Control-Allow-Headers': 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With, yourHeaderFeild',
      // 'Access-Control-Allow-Methods': 'PUT, POST, GET, DELETE, OPTIONS',
      'Access-Control-Allow-Origin': '*'
    };

    // allow custom header and CORS
    _this.app.all('*', function (req, res, next) {
      for (const key in RespnseHeadersConfig) {
        res.header(key, RespnseHeadersConfig[key]);
      }

      let method = req.method.toLocaleUpperCase();

      if (method === 'OPTIONS') {
        res.sendStatus(200); /* 让 options 请求快速返回 */
      } else {
        next();
      }
    });
  }

  // 代理请求
  proxyRequest() {
    let _this = this;

    /**
     * proxyPath(匹配路径 / 精确路径) 路径和 options.pathRewrite(精确路径) 路径要对应
     * proxyMode 代理路径模式 matched: 匹配路径模式, precise: 精确路径模式
     */

    _this.proxy.forEach((element, index) => {
      if (element.enabled) {
        // proxy('**/*.json', {target: 'http://www.example.org:8000', changeOrigin: true});
        // proxy(['**/*.json'], {target: 'http://www.example.org:8000', changeOrigin: true});

        if (element.proxyMode === 'matched') {
          // 匹配路径模式
          _this.app.use('/', createProxyMiddleware(element.proxyPath, element.options));
        } else if (element.proxyMode === 'precise') {
          // 精确路径模式
          _this.app.use(
            '/',
            createProxyMiddleware(element.proxyPath, {
              target: element.options.target, // target host 'http://www.example.org'
              changeOrigin: element.options.target || true, // needed for virtual hosted sites
              ws: element.options.ws || true, // proxy websockets
              pathRewrite:
                element.options.pathRewrite ||
                {
                  // 代理路径规则
                  // 可以使用参数 pathRewrite 改写路径(前端请求 /api/old-path => 实际代理 /api/new-path)
                  // '^/api/old-path': '/api/new-path', // rewrite path 修改路径，重写路径
                  // '^/api/remove/path': '/path' // remove base path 删除路径
                },
              router:
                element.options.router ||
                {
                  // 代理地址规则
                  // when request.headers.host == 'dev.localhost:3000',
                  // override target 'http://www.example.org' to 'http://localhost:8000'
                  // 'dev.localhost:3000': 'http://localhost:8000'
                }
            })
          );
        }
      }
    });
  }

  // 静态资源配置
  staticResource() {
    let _this = this;

    /**
     * 配置静态资源，即使找不到也不会响应404，而是调用 next()
     * 也可以用来重定向资源，单独的子项目资源会读取根项目的资源时可以使用
     * //mini.eastday.com.local:9527/assets/
     * 根目录：D:\Code
     * 实际请求资源目录              实际响应资源目录
     * __dirname + /assets/ ====> path.join(__dirname, '/Project/eastday-pc/www-root/assets')
     */

    /**
     * 重定向html文件到某个固定html模板，或者在请求的参数中判断，然后响应固定页面
     * //mini.eastday.com.local:9527/Project/mini-pchongbaon/www-root/pchongbao/*.html
     * ==================================== ↓ 实际响应页面 ↓ ====================================
     * __dirname + /Project/mini-pchongbao/www-root/pchongbao/pchongbao181227135322453.html
     */

    for (const key in _this.static) {
      _this.static[key].forEach((element, index) => {
        _this.app.use(element, express.static(path.join(_this.rootPath, key)));
      });
    }
  }

  // post 请求处理
  postRequest() {
    let _this = this;

    // 使用 body-parser 中间件
    // body-parser 中间可以设置多个解析post请求的类型
    // extended:true 表示使用qs库来解析查询字符串
    // extended:false 表示使用querystring库来解析字符串
    _this.app.use(bodyParser.urlencoded({ limit: '100mb', extended: false }));

    // post 请求处理
    _this.app.post('/', (req, res) => {
      let data = req.body;

      for (const key in data) {
        try {
          data[key] = JSON.parse(data[key]);
        } catch (error) {}
      }

      res.json({ statusCode: 200, result: true, info: 'May the force be with you!' });
    });
  }

  // 其他所有请求处理
  responseFiles() {
    let _this = this;

    _this.app.use('/', (req, res) => {
      // 指定访问首页的功能
      if (_this.indexPage.enabled && _this.indexPage.indexUrl.some((element, index) => req.path === element)) {
        res.sendFile(path.join(_this.rootPath, _this.indexPage.indexPath));
      } else {
        // 404 页面功能
        res.sendFile(path.join(_this.rootPath, req.path), {}, function (error) {
          // 读取不到文件为 error 对象，否则为 undefined
          if (error) {
            if (error.statusCode === 404 && _this.page404.enabled && _this.page404.page404Type.test(req.path)) {
              // 重定向到 404 页面，只对每个请求链接做重定向，不会导致整个页面重定向
              res.redirect(302, _this.page404.page404Url);
            } else {
              // 响应 404 状态码
              res.status(404).send(`Not Found</br>${error}</br><script>let error404 = ${JSON.stringify(error)}</script>`);
            }
          }
        });
      }
    });
  }

  // 开启服务
  openServer() {
    let _this = this;

    // HTTP
    _this.server_http = http.createServer(_this.app).listen(_this.port, () => {
      console.log(`http | ${_this.localIP}:${_this.server_http.address().port} | http:${_this.url}:${_this.server_http.address().port}`);
    });
  }
}

module.exports = { ServerApp };
