const path = require('path');

module.exports = {
  entry: './index.ts',
  mode: 'development',
  stats: {errorDetails: true},
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  loader: {
    test: /\.ts?$/,
    loader: 'babel-loader',
    exclude: /node_modules/,
    query: {
        presets: ["es2015", "stage-0", "react"]
    }
},
};