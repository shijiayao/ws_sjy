module.exports = {
  root: true,
  // 环境配置（根据实际情况做取舍）
  env: {
    browser: true,
    node: true,
    commonjs: true,
    es6: true,
    jquery: true
  },
  // 添加项目使用到的全局变量，按需添加。
  globals: {},
  // 继承eslint的默认配置和prettier的配置。
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  // 支持babel的使用
  parser: 'babel-eslint',
  parserOptions: {
    // 支持es6模块语法
    sourceType: 'module'
  },
  // 使用插件，支持检查 HTML Vue 文件
  plugins: ['html', 'vue', 'prettier'],
  settings: {
    'html/report-bad-indent': 'error',
    'html/javascript-mime-types': ['text/javascript', 'text/jsx', '/^text\\/(javascript|jsx)$/'] // 还可以使用带有“text/jsx”类型属性的脚本标记
  },
  // 自定义规则（优先级最高）
  rules: {
    'prettier/prettier': [
      'error',
      {
        singleQuote: true, // 使用单引号
        printWidth: 300, // 每行代码长度
        tabWidth: 2, // 缩进使用2个空格
        semi: true, // 句末加分号
        endOfLine: 'lf', // 行尾序列号
        useTabs: false, // 是否使用tab进行缩进，默认为false，表示用空格进行缩减
        bracketSpacing: true, // 对象大括号直接是否有空格，默认为true，效果：{ foo: bar }
        trailingComma: 'none' // 尽可能控制尾随逗号的输出。
      }
    ],
    'linebreak-style': [2, 'unix'], // 行尾符号，换行风格 unix - LF / Windows - CRLF
    'no-undef': 0, // 允许使用未定义的变量
    'no-unused-vars': 0, // 允许有声明后未被使用的变量或参数
    'no-empty': 0, // 允许有空的块语句
    'no-console': 'off', // 允许存在 console
    'no-useless-escape': 0, // 允许使用转义字符
    semi: [2, 'always'], // 行尾加分号
    quotes: [2, 'single', { avoidEscape: true /* 字符串内有单引号时，允许外层为双引号 */ }], // 使用单引号
    indent: [2, 2, { SwitchCase: 1 }], // 缩进空格，解决 switch 缩进报错问题
    'comma-dangle': ['error', 'never'] // 不允许尾随逗号，IE8 中遇到尾随逗号时会引发错误。
  }
};
