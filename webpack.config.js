const path = require('path'),
    htmlWebpackPlugin = require('html-webpack-plugin'),
    webpack = require('webpack'),
    merge = require('webpack-merge'),
    parts = require ('./webpack.parts.js')

const PATHS = {
    app: path.resolve(__dirname, 'app'),
    build: path.resolve(__dirname, 'build')
}

const common = merge([
    {
        entry: {
            app: PATHS.app
        },
        output: {
            path: PATHS.build,
            filename: '[name].js'
        },
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader']
              }
            ]
        },
        plugins: [
            new htmlWebpackPlugin({
                template: 'app/index.html'
            })
        ]
    }
])

module.exports = function (env) {
    if (env === 'production') {
        return common;
    }
    return merge ([
        common, {
            plugins: [
                new webpack.NamedModulesPlugin ()
            ]
        },
        parts.devServer
    ])
}