const join = require('path').join;

module.exports = {
  entry: './src/index.js',
  output: {
    path: join(__dirname, 'dist'),
    filename: 'redux-staged-state.js',
    library: true,
    libraryTarget: 'commonjs2',
  },
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel' },
    ],
  },
};
