const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin');

const utils = require('./utils');
const entries = utils.getEntry();

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

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
    filename: '[name]/static/js/app.[hash:7].js',
    chunkFilename: '[name]/static/js/[id].[hash:7].js'
  }
};

// 对每个页面增加配置
entries.forEach((item, i) => {

  webpackConfig.plugins.push(new ExtractTextPlugin({
    filename: item + '/static/css/app.[md5:contenthash:hex:7].css',
  }));

  webpackConfig.module.rules.push({
    test: new RegExp('src' + '(\\\\|\/)' + item + '(\\\\|\/)' + 'css' + '(\\\\|\/)' + '.*\.(css|scss)$'),
    use: pageExtractCssArray[i].extract({
      fallback: 'style-loader',
      use: ['css-loader'],

      // nginx指向 dist/ 
      // css中图片引入地址为rules中outputPath+name
      // 注意这里，使得可以正常访问到dist/xxx/static/img/xx.png
      publicPath: '../../../',
    })
  });

  webpackConfig.module.rules.push(
    {
      test: new RegExp('src' + '(\\\\|\/)' + item + '(\\\\|\/)' + 'img' + '(\\\\|\/)' + '.*\.(png|jpe?g|gif|svg)$'),
      loader: 'url-loader',
      options: {
        limit: 10000,
        name: 'img/[name].[hash:7].[ext]',
        outputPath: '../' + item + '/static',
        // name: '../' + item + '/static/img/[name].[hash:7].[ext]',
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