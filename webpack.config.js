const path = require('path');
const webpack = require('webpack');

module.exports = {
   context: path.resolve(__dirname, './src'),
   entry: {
       app : './app.js',
   },
   output: {
       path: path.resolve(__dirname, './dist'),
       filename: 'app.js'
   },
   module: {
       rules: [{
           test: /\.js$/,
            exclude: /node_modules/,
           use: {
               loader: 'babel-loader',
               options: {
                   presets: [['es2015', { modules: false }]]
               }
           }
       }]
   }
};