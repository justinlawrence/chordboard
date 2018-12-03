const path = require('path')
const config = require('./../package.json').config
const webpackMerge = require('webpack-merge')
const commonConfig = require('./webpack.base.js')

module.exports = function(env) {
	return webpackMerge(commonConfig(), {
		mode: 'development',
		devtool: false,
		devServer: {
			compress: true,
			hot: true,
			port: config.port,

			// Serves /index.html in place of 404's on dev-server requests.
			// Therefore allowing the angular router to handle the request.
			historyApiFallback: {
				index: '/'
			}
		}
		// module: {
		// 	rules: [
		// 		{
		// 			test: /\.scss$/,
		// 			use: [
		// 				'style-loader',
		// 				'css-loader?importLoaders=1&sourceMap',
		// 				{
		// 					loader: 'postcss-loader',
		// 					options: {
		// 						config: {
		// 							path: path.resolve( 'postcss.config.js' )
		// 						},
		// 						sourceMap: true,
		// 					}
		// 				},
		// 				'sass-loader?sourceMap'
		// 			]
		// 		}
		// 	]
		// }
	})
}
