const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const development = process.env.NODE_ENV !== 'production' ? true : false;
const styles = 'style-loader!css-loader?modules!sass';

module.exports = {
	devtool: development ? 'eval' : 'cheap-module-source-map',
	entry: {
		app: './src/index.js'
	},
	output: {
		path: path.join(__dirname, 'build'),
		filename: 'goldfish.min.js',
		publicPath: 'http://localhost:3001/',
	},
	externals: {
		'jsdom': 'window',
		'cheerio': 'window',
		'react/lib/ExecutionEnvironment': true,
		'react/lib/ReactContext': true,
	},
	resolve: {
		root: [
			// allows us to import modules as if /src was the root.
			// so I can do: import Comment from 'components/Foo'
			// instead of:  import Comment from '../components/Foo' or whatever relative path would be
			path.resolve(__dirname)
		],
		extensions: ['','.jsx', '.scss', '.js', '.json'],
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
					 presets:['es2015','stage-0','react']
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
		    'process.env': {
		      'NODE_ENV': JSON.stringify('production')
		    }
		}),
        new webpack.optimize.DedupePlugin(),
		new ExtractTextPlugin('goldfish.min.css',
			{
				allChunks: true
			}
		),
		new webpack.optimize.UglifyJsPlugin({
			comments: false,
			compress: {
				warnings: false
			}
		})
	]
};