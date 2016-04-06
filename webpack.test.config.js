const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const development = process.env.NODE_ENV !== 'production' ? true : false;
const styles = 'style-loader!css?modules!postcss!sass';

module.exports = {
  context: __dirname,
  devtool: development ? 'eval' : 'source-map',
  entry: {
	    app: './src/index.js'
  },
  output: {
      path: path.join(__dirname, 'build'),
      filename: 'goldfish.min.js',
      publicPath: '/static/'
  },
  resolve: {
      extensions: ['', '.jsx', '.scss', '.js', '.json'],
      modulesDirectories: [
        'node_modules',
        path.resolve(__dirname, './node_modules')
      ]
  },
  node: {
      fs: "empty"
  },
  module: {
    loaders: [
      {
        test: /(\.js|\.jsx)$/,
        loaders: ['react-hot', 'babel'],
        include: path.join(__dirname, 'src'),
      },
      {
        test: /(\.scss|\.css)$/,
        loader: development ? styles : ExtractTextPlugin.extract('style', 'css?sourceMap&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss!sass?sourceMap!toolbox'),
        exclude: /\material.css/
      }
    ]
  },
  toolbox: {
    theme: path.join(__dirname, 'toolbox/toolbox-theme.scss')
  },
  postcss: [autoprefixer],
  plugins: [
    new ExtractTextPlugin('peoplesearch.min.css',
      {
        allChunks: true
      }
    ),
    new webpack.optimize.UglifyJsPlugin({
      output: { comments: false },
      sourceMap: false,
      mangle: false
    }),
    new webpack.DefinePlugin(
      {
        'process.env.NODE_ENV': JSON.stringify('production')
      }
    )
  ]
};
