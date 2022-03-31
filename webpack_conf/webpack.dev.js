// webpack.dev.js
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const common = require('./webpack.common');
const { merge } = require('webpack-merge');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  watch: true,
  plugins: [
     new HtmlWebpackPlugin({ 
       /* was called 'template.html in 6.1.5 example, got renamed to main.html in repo */
       filename: 'main.html', /* Left fr RArepo */
       /* Below: fr RArepo */
       template: path.resolve(__dirname, '..', 'src', 'main.html'),
      /* template: './src/template.html' */
      }),
  ].filter(Boolean),
  module: {
    rules: [
            {
        test: /\.(js|mjs|jsx)$/, // regex to see which files to run babel on
        exclude: /node_modules/,
        use: {
          loader: require.resolve('babel-loader'),
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
});