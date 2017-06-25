/* globals process */
/* globals __dirname */

const webpack = require('webpack');
const path = require('path');
const CompressionPlugin = require('compression-webpack-plugin');

const ENV = process.env.NODE_ENV,
    isDev = ENV === 'dev';

const productionRules = [
    {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
            loader: 'babel-loader',
            options: {
                presets: ['env']
            }
        }
    }
];
const devPlugins = [];
const productionPlugins = devPlugins.concat([
    new webpack.optimize.UglifyJsPlugin({
        mangle: {
            except: []
        },
        sourceMap: true
    }),
    new CompressionPlugin({
        asset: '[path].gz[query]',
        algorithm: 'gzip',
        test: /\.(js|html|css)$/,
        threshold: 10240,
        minRatio: 0.8
    })
]);

module.exports = {
    entry: {
        'home-bundle': './script.js'
    },
    output: {
        filename: isDev ? '[name].js' : '[name].min.js',
        path: path.resolve(__dirname)
    },
    module: {
        rules: isDev ? [] : productionRules
    },
    plugins: isDev ? devPlugins : productionPlugins,
    watch: isDev
};
