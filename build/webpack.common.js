const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin');

const utils = require('./utils');
const entries = utils.getEntry();

const pageExtractCssArray = []
entries.forEach(item => {
  pageExtractCssArray.push(
    new ExtractTextPlugin({
      filename: item + '/static/css/app.[md5:contenthash:hex:7].css',
    })
  )
})

let webpackConfig = {
  entry: utils.addEntry(),
  module: {
    rules: [
      { 
        test   : /.js$/,
        loader : 'babel-loader',
        query: {
          presets: ['es2015']
        }
      }
    ]
  },
  plugins: [
    ...pageExtractCssArray,
  ],
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name]/static/js/app.[hash:7].js',
    chunkFilename: '[name]/static/js/[id].[hash:7].js'
  }
};


entries.forEach((item, i) => {
  webpackConfig.plugins.push(new ExtractTextPlugin({
    filename: item + '/static/css/app.[md5:contenthash:hex:7].css',
  }));

  webpackConfig.module.rules.push({
    test: new RegExp('src' + '(\\\\|\/)' + item + '(\\\\|\/)' + 'css' + '(\\\\|\/)' + '.*\.(css|scss)$'),
    use: pageExtractCssArray[i].extract({
      fallback: 'style-loader',
      use: ['css-loader']
    })
  });

  webpackConfig.plugins.push(
    new HtmlWebpackPlugin({
      filename: item + '/index.html',
      chunks:[item],
      template: path.join(__dirname, '../src', item, 'index.html'),
      inject: true,
      minify: {
        removeComments: process.env.NODE_ENV === 'production',
        collapseWhitespace: process.env.NODE_ENV === 'production',
        removeAttributeQuotes: process.env.NODE_ENV === 'production'
      },
      chunksSortMode: 'dependency'
    })
  )

});


module.exports = webpackConfig;