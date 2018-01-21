const webpack = require('webpack');
const PROD = JSON.parse(process.env.PROD_ENV || '0');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const path = require('path');

const BUILD_DIR = path.resolve(__dirname, '../');
const APP_DIR = path.resolve(__dirname, 'base/');

const config = {
    devtool: PROD ? false: "inline-sourcemap",
    entry: {
        base: APP_DIR + "/init.js",
    },
    output: {
        path: BUILD_DIR,
        pathinfo: true,
        filename: '[name].js',
        publicPath: "/fonts/",
        // library: "gocms",
        // libraryTarget: 'umd',
        // umdNamedDefine: true
    },
    module: {
        loaders: [
            {
                // jsx (react)
                test: /\.js?/,
                include: [APP_DIR],
                loader: 'babel-loader',
                query: {
                    plugins: [
                        "syntax-dynamic-import",
                        [
                            "transform-runtime",
                            "transform-object-assign",
                            {polyfill: false, regenerator: true}
                        ],
                    ],
                    presets: [
                        ["es2015", {"modules": false}],
                        "stage-0",
                        "react"
                    ]
                }
            },
            {
                // scss
                test: /\.scss$/,
                loaders: ExtractTextPlugin.extract('css-loader!sass-loader')
            },
            {
                // fonts
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                loader: 'file-loader?name=/fonts/[name].[ext]'
            },
        ]
    },
    plugins: [
        new ExtractTextPlugin('[name].css', {
            allChunks: true
        }),
        new webpack.NamedModulesPlugin(),
        // this assumes your vendor imports exist in the node_modules directory
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            // async: true,
            minChunks: module => module.context && module.context.indexOf('node_modules') !== -1
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: "manifest",
        })

    ]
};

module.exports = config;