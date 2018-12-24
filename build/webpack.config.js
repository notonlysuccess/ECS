const path = require('path')

module.exports = {
  entry: path.join(__dirname, '../src/index'),
  output: {
    // path: path.join(__dirname, '../dist'),
    path: path.join(__dirname, '../../geometry-battle/vendor'),
    filename: 'ECS.js',
    library: 'ECS',
    libraryTarget: 'umd'
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
