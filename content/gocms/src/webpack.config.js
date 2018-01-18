const webpack = require('webpack');
const PROD = JSON.parse(process.env.PROD_ENV || '0');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const path = require('path');
const glob = require('glob');

const BUILD_DIR = path.resolve(__dirname, '../');
const APP_DIR = path.resolve(__dirname, 'base/');
const ADMIN_DIR = path.resolve(__dirname, 'admin/');

const config = {
    entry: {
        base: [
            ...glob.sync(APP_DIR+"/**/*.js"),
            APP_DIR +"/styles/index.scss"
        ],
        admin: [ADMIN_DIR +'/init.js', ADMIN_DIR +"/config/styles/index.scss"],
    },
    output: {
        path: BUILD_DIR,
        filename: '[name].js',
        // filename: 'gocms.[name].js',
        publicPath: "/fonts/",
        // library: ["gocms", "[name]"],
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    module: {
        loaders: [
            {
                // jsx (react)
                test: /\.js?/,
                include: [APP_DIR,ADMIN_DIR],
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
        // this assumes your vendor imports exist in the node_modules directory
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: module => module.context && module.context.indexOf('node_modules') !== -1
        }),
        // this assumes your vendor imports exist in the node_modules directory
        new webpack.optimize.CommonsChunkPlugin({
            name: 'base',
            chunks: ["admin", "base"],
            minChunks: Infinity,
        }),
    ]
};

module.exports = config;