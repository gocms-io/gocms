const webpack = require('webpack');
const PROD = JSON.parse(process.env.PROD_ENV || '0');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const path = require('path');
// const glob = require('glob');

const BUILD_DIR = path.resolve(__dirname, '../');
const THEME_DIR = path.resolve(__dirname, './theme');

const config = {
    entry: {
        theme: [THEME_DIR + "/config/init.js"]
    },
    externals: [
        // babel
        /^babel-runtime/,
        /^lodash/,
        /^process/,
        // react
        {react: 'umd react'},
        'react-dom',
        'react-redux',
         'react-router',
        'react-addons-css-transition-group', 'redux-saga/effects',
        /^react-transition-group/,
        // gocms
        // /^gocms/,
        // plugins
        // /^contact-form.plugins.gocms.io/,
    ],
    output: {
        path: BUILD_DIR,
        filename: '[name].js',
        publicPath: "/fonts/",
        library: "theme",
        libraryTarget: 'umd',
        umdNamedDefine: true

    },
    module: {
        loaders: [
            {
                // jsx (react)
                test: /\.js?/,
                include: [THEME_DIR],
                // exclude: ["node_modules"],
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
            name: 'theme_vendor',
            minChunks: module => module.context && module.context.indexOf('node_modules') !== -1
        })
    ]
};

module.exports = config;