const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const development = process.env.NODE_ENV !== 'production' ? true : false;
const styles = 'style-loader!css-loader?modules!sass';

module.exports = {
  //devtool: development ? 'eval' : 'source-map',
  devtool: 'source-map',
  entry: {
	    app: './src/index.js'
  },
  output: {
      path: path.join(__dirname, 'build'),
      filename: 'goldfish.demo.min.js',
      publicPath: '/static/'
  },
  resolve: {
      extensions: ['', '.jsx', '.scss', '.js', '.json'],
      modulesDirectories: [
        'node_modules',
        path.resolve(__dirname, './node_modules')
      ]
  },
  module: {
    loaders: [
      {
        test: /(\.js|\.jsx)$/,
        exclude: /(node_modules)/,
        loader: 'babel',
        query: {
           presets:['es2015','react']
        }
      },
      {
        test: /(\.scss|\.css)$/,
        loader: development ? styles : ExtractTextPlugin.extract('style', 'css-loader?sourceMap&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!sass?sourceMap!toolbox'),
        exclude: /\material.css/
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {NODE_ENV: '"production"'}
    }),
    new ExtractTextPlugin('Goldfish.min.css',
      {
        allChunks: true
      }
    ),
    new webpack.optimize.UglifyJsPlugin({
      comments: false
    })
  ]
};
