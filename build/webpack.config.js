const path = require('path')

module.exports = {
  entry: path.join(__dirname, '../src/index'),
  output: {
    path: path.join(__dirname, '../dist'),
    filename: 'ECS.js',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: [
          'babel',
          'eslint-loader'
        ]
      }
    ]
  }
}
