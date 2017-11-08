const path = require('path');
const utils = require('./utils');
const vueLoaderConfig = require('./vue-loader.conf');
const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  entry: {
    app: './client/src/main.js'
  },
  output: {
    path: path.join(__dirname, '..', 'dist'),
    filename: '[name].js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': path.join(__dirname, '..', 'src')
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: utils.cssLoaders({
            // CSS Sourcemaps off by default because relative paths are "buggy"
            // with this option, according to the CSS-Loader README
            // (https://github.com/webpack/css-loader#sourcemaps)
            // In our experience, they generally work as expected,
            // just be aware of this issue when enabling this option.
            sourceMap: isProduction,
            extract: isProduction
          })
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        options: { 
          comments: false
        },
        include: [path.join(__dirname, '..', 'src')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'img/[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'fonts/[name].[hash:7].[ext]'
        }
      }
    ]
  }
};
