'use strict'

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  devServer: {
    compress: true,
    port: 8080,
    open: true
  },
  output: {
    filename: './bundle.js',
    path: path.resolve(__dirname,'../dist')
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.pug',
      filename: 'index.html',
      inject: true
    }),
    new MiniCssExtractPlugin({
      filename: "app.css",
      chunkFilename: "main.css"
    })
  ],
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader,'css-loader','sass-loader']
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.pug$/,
        use: ['raw-loader',{
          loader: 'pug-html-loader',
          options: {
            data: {
              myTitle: 'Hey?'
            }
          }
        }],
      }
    ]
  }
};
