const path = require('path');

module.exports = {
  entry: './index.ts',
  mode: 'production',
  stats: {errorDetails: true},
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: [".ts", ".tsx", ".js", ".jsx"],
    // Add support for TypeScripts fully qualified ESM imports.
    extensionAlias: {
     ".js": [".js", ".ts"],
     ".cjs": [".cjs", ".cts"],
     ".mjs": [".mjs", ".mts"]
    }
  },
  module: {
    rules: [
      // all files with a `.ts`, `.cts`, `.mts` or `.tsx` extension will be handled by `ts-loader`
      { test: /\.([cm]?ts|tsx)$/, loader: "ts-loader" }
    ]
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