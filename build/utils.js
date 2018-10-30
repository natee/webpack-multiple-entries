const glob = require("glob");
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin')

exports.getEntry = function () {
  let globPath = 'src/**/js/index.js'
  // (\/|\\\\) 这种写法是为了兼容 windows和 mac系统目录路径的不同写法
  let pathDir = 'src(\/|\\\\)(.*?)(\/|\\\\)js'
  let files = glob.sync(globPath)
  let dirname, entries = [];

  for (let i = 0; i < files.length; i++) {
    dirname = path.dirname(files[i])
    entries.push(dirname.replace(new RegExp('^' + pathDir), '$2'))
  }
  return entries
}

exports.addEntry = function () {
  let entryObj = {};
  let entries = exports.getEntry(); // get ['page-a','page-b']
  entries.forEach(item => {
    entryObj[item] = path.resolve(__dirname, '../src', item, 'js/index.js')
  });
  return entryObj
}
