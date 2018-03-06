const path = require('path')
const glob = require('glob')
const webpack = require('webpack')

var testObject = glob.sync(path.join(__dirname, '../test/', '**/*.test.js')).reduce((object, file) => {
  const lastIndex = file.lastIndexOf('/')
  const fileName = file.substring(lastIndex + 1, file.length - 8)
  object[fileName] = 'mocha!' + file
  return object
}, {})

console.log(testObject)

module.exports = {
  entry: testObject,
  output: {
    path: path.join(__dirname, '../test_dist'),
    filename: '[name].js'
  },
  devtool: 'inline-source-map',
  module: {
    loaders: [
      {
        test: /\.js|jsx?$/,
        exclude: /(node_modules)/,
        loaders: [
          'babel-loader'
        ]
      }
    ]
  },
  resolve: {
    extensions: ['', '.js'],
    root: [
      path.join(__dirname, '../node_modules'),
      path.join(__dirname, '../src'),
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      chai: 'chai',
      spies: 'chai-spies',
    }),
  ]
}
