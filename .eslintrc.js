module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'indent': 'off',
    'space-before-function-paren': 'off',//去除空格的报错，改变的时候必须重新运行程序
    'no-tabs': 'off',
    'func-call-spacing': 'off',
    'eol-last': 0  //文章结尾需要换行符
  }
}
