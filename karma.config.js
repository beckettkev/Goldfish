//https://github.com/export-mike/react-redux-boilerplate
const path = require('path');
const webpack = require('webpack');
// See issues for details on parts of this config.
// https://github.com/airbnb/enzyme/issues/47
// had issues loading sinon as its a dep of enzyme
const argv = require('minimist')(process.argv.slice(2));

module.exports = (config) => {
	config.set({
		browsers: [ 'Chrome' ],
		singleRun: argv.watch ? false : true,
		frameworks: [ 'mocha' ],
		files: [
			'tests.webpack.js'
		],
		preprocessors: {
			'tests.webpack.js': ['webpack', 'sourcemap']
		},
		reporters: [ 'dots' ],
		webpack: { //kind of a copy of your webpack config
			devtool: 'inline-source-map', //just do inline source maps instead of the default
			module: {
				loaders: [
					{
						test: /(\.js|\.jsx)$/,
						loader: 'babel',
						exclude: path.resolve(__dirname, 'node_modules'),
						query: {
							 presets:['airbnb','es2015','stage-0','react']
						}
					},
					{
						test: /\.json$/,
						loader: 'json'
					},
					{
						test: /(\.css|\.scss)$/,
						loader: 'style!css?sourceMap&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!sass?sourceMap'
					},
					{
						test: /sinon\.js$/,
						loader: 'imports?define=>false,require=>false'
					}
				]
			},
			externals: {
				jsdom: 'window',
				cheerio: 'window',
				'react/lib/ExecutionEnvironment': true,
				'react/lib/ReactContext': 'window',
				'text-encoding': 'window'
			},
			resolve: {
				extensions: ['','.jsx', '.scss', '.js', '.json'],
				alias: {
					sinon: 'sinon/pkg/sinon'
				}
			}
		},
		webpackServer: {
			noInfo: true //please don't spam the console when running in karma!
		}/*,
		plugins: [
			'karma-webpack',
			'karma-jasmine',
			'karma-sourcemap-loader',
			'karma-chrome-launcher',
			'karma-phantomjs-launcher'
		],

		babelPreprocessor: {
			options: {
				presets: ['airbnb']
			}
		},
		reporters: ['progress'],
		port: 9876,
		colors: true,
		logLevel: config.LOG_INFO,
		autoWatch: true,
		browsers: ['Chrome'],
		singleRun: false,*/
	})
};
