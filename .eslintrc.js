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
  // 继承 eslint 的默认配置和 prettier 的配置。
  extends: ['eslint:recommended', 'plugin:prettier/recommended' /* , 'plugin:vue/vue3-recommended' */],
  // 插件 eslint-plugin- 开头的插件
  plugins: ['prettier', 'html', 'vue'],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: 'babel-eslint', // 支持 babel 的使用
    sourceType: 'module',
    ecmaVersion: 2020
  },
  settings: {
    'html/report-bad-indent': 'error',
    'html/html-extensions': ['.html', '.we'],
    'html/xml-extensions': ['.html'],
    'html/javascript-mime-types': ['text/javascript', 'text/jsx']
  },
  // 自定义规则（优先级最高）
  rules: {
    'prettier/prettier': [
      'error',
      {
        singleQuote: true, // 使用单引号
        printWidth: 300, // 每行代码长度
        tabWidth: 2, // 缩进使用 2 个空格
        semi: true, // 句末加分号
        endOfLine: 'lf', // 行尾序列号
        useTabs: false, // 是否使用 tab 进行缩进，默认为 false，表示用空格进行缩减
        bracketSpacing: true, // 对象大括号直接是否有空格，默认为 true，效果：{ foo: bar }
        trailingComma: 'none' // 尽可能控制尾随逗号的输出。
      }
    ],
    'linebreak-style': [2, 'unix'], // 行尾符号，换行风格 unix - LF / Windows - CRLF
    'no-undef': 0, // 允许使用未定义的变量
    'no-unused-vars': 0, // 允许有声明后未被使用的变量或参数
    'no-empty': 0, // 允许有空的块语句
    'no-console': 'off', // 允许存在 console
    'no-useless-escape': 0, // 允许使用转义字符
    'no-unreachable': 0, // 检测到无法访问的代码。
    semi: [2, 'always'], // 行尾加分号
    quotes: [2, 'single', { avoidEscape: true, /* 字符串内有单引号时，允许外层为双引号 */ allowTemplateLiterals: true /* 允许字符串使用反引号 */ }], // 尽可能使用单引号
    indent: [2, 2, { SwitchCase: 1 }], // 缩进空格，解决 switch 缩进报错问题
    'comma-dangle': ['error', 'never'], // 不允许尾随逗号，IE8 中遇到尾随逗号时会引发错误。
    'vue/html-self-closing': 0 // 不对没有内容的元素标签自动关闭
  }
};
