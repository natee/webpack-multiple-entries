const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = require('./config')
const utils = require('./utils');
const entries = utils.getEntry();

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

const pageExtractCssArray = []
entries.forEach(item => {
  pageExtractCssArray.push(
    new ExtractTextPlugin({
      filename: utils.assetsPath(item + '/css/app.[md5:contenthash:hex:7].css'),
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
      },
      
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: path.join('media/[name].[hash:7].[ext]')
        }
      },
    ]
  },
  plugins: [
    ...pageExtractCssArray,
  ],
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: utils.assetsPath('[name]/js/app.[hash:7].js'),
    chunkFilename: utils.assetsPath('[name]/js/[id].[hash:7].js'),
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  }
};

// 对每个页面增加配置
entries.forEach((item, i) => {

  webpackConfig.module.rules.push({
    test: new RegExp('src' + '(\\\\|\/)' + item + '(\\\\|\/)' + 'css' + '(\\\\|\/)' + '.*\.(css|scss)$'),
    use: pageExtractCssArray[i].extract({
      fallback: 'style-loader',
      use: ['css-loader'],
    })
  });

  webpackConfig.module.rules.push(
    {
      test: new RegExp('src' + '(\\\\|\/)' + item + '(\\\\|\/)' + 'img' + '(\\\\|\/)' + '.*\.(png|jpe?g|gif|svg)$'),
      loader: 'url-loader',
      options: {
        limit: 10,
        name: utils.assetsPath(item + '/img/[name].[hash:7].[ext]'),
      }
    },
    {
      test: /\.html$/,
      use:'html-withimg-loader',
    }
  );

  webpackConfig.plugins.push(
    new HtmlWebpackPlugin({
      filename: item + '/index.html',
      chunks:[item],
      template: path.resolve(__dirname, '../src', item, 'index.html'),
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