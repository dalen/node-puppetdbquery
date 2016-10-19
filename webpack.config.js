const path = require('path');

module.exports = {
  devtool: 'source-map',
  entry: [
    path.resolve(__dirname, 'lib', 'main.js'),
  ],
  output: {
    filename: 'main.js',
    libraryTarget: 'commonjs',
  },
  node: {
    fs: 'empty',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015'],
        },
      },
      {
        test: /\.jison$/,
        loader: 'jison-loader',
      },
    ],
  },
};
