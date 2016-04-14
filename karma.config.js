var path = require('path');

module.exports = function(config) {
	config.set({
		basePath: '',
		frameworks: ['jasmine'],
		files: [
			'test/**/*.js'
		],

		preprocessors: {
			// add webpack as preprocessor
			'test/**/*.js': ['webpack', 'sourcemap']
		},

		webpack: { //kind of a copy of your webpack config
			devtool: 'inline-source-map', //just do inline source maps instead of the default
			resolve: {
				extensions: ['','.jsx', '.scss', '.js', '.json'],
				root: path.resolve(__dirname, './src')
			},
			module: {
				loaders: [
					{
						test: /(\.js|\.jsx)$/,
						loader: 'babel',
						exclude: path.resolve(__dirname, 'node_modules'),
						query: {
							presets: ['airbnb']
						}
					},
					{
						test: /\.json$/,
						loader: 'json',
					},
					{
						test: /(\.scss|\.css)$/,
						loader: 'style-loader!css-loader?modules!sass',
						exclude: /\material.css/
					}
				]
			},
			externals: {
				'react/lib/ExecutionEnvironment': true,
				'react/lib/ReactContext': true
			}
		},

		webpackServer: {
			noInfo: true //please don't spam the console when running in karma!
		},

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
		singleRun: false,
	})
};