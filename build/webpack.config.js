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
  },
  //eslint: {
    //configFile: path.join(__dirname, '../.eslintrc'),
    //formatter: require('eslint-friendly-formatter')
  //},
  //resolve: {
    //extensions: ['', '.js'],
    //root: [
      //path.join(__dirname, '../node_modules'),
    //]
  //}
}
