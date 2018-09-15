const path = require('path');

module.exports = {
  entry: './src/dapp_module_final.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  }
}
