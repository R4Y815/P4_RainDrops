const HtmlWebpackPlugin = require('html-webpack-plugin');
const { merge } = require('webpack-merge');
const path = require('path');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
    plugins: [
    new HtmlWebpackPlugin({
      // Name this file main so it does not get autosmatically requested as a static file
      filename: 'main.html',
      inject: true,
      template: path.resolve(__dirname, '..', 'src', 'index.html'),
      // a favicon can be included in the head. use this config to point to it
      // favicon: resolve(__dirname, '..', 'src', 'favicon.png'),
      alwaysWriteToDisk: true,
    }),
  ],

});