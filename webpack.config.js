var webpack = require('webpack');

var PROD = (process.env.NODE_ENV === 'production');

module.exports = {
    entry: {
        main: "./src/app/app.js",
    },
    output: {
        path: './public/js',
        filename: '[name].js',
    },
    module: {
        loaders: [{
            test: /\.jsx?$/,
            include: [
                /src/,
            ],
            loader: 'babel-loader',
            query: {
                presets: ['react', 'es2015', 'stage-1']
            }
        },
        ]
    },
    plugins: PROD ? [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ] : [],

    resolve: {
        modulesDirectories: ['src', 'node_modules'],
        extensions: ['', '.js', '.json'],
    },
    devtool: 'eval-source-map',
    devServer: {
        port: 11111,
        inline: true,
        historyApiFallback: true,
        contentBase: 'public',
    }
};
