var webpack = require('webpack');

var PROD = (process.env.NODE_ENV === 'production');

module.exports = {
  devtool: !PROD ? 'inline-sourcemap' : false,
  entry: __dirname + '/src/index.js',
  output: {
    path: __dirname + '/public/js',
    filename: 'main.js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: [
          /src/,
        ],
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: [require('@babel/plugin-proposal-object-rest-spread'), require('@babel/plugin-proposal-class-properties')]
          }
        }
      }
    ]
  },
  plugins: !PROD ? [] : [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({mangle: false, sourcemap: false}),
  ],
  resolve: {
    modules: [
      'src',
      'node_modules'
    ],
  }
}
;
