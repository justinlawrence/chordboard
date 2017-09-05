const config = require( './../package.json' ).config;
const webpackMerge = require( 'webpack-merge' );
const commonConfig = require( './webpack.base.js' );

module.exports = function ( env ) {

	return webpackMerge( commonConfig(), {
		devtool:   'source-map',
		devServer: {
			compress: true,
			hot:      true,
			port:     config.port,

			// Serves /index.html in place of 404's on dev-server requests.
			// Therefore allowing the angular router to handle the request.
			historyApiFallback: {
				index: "/"
			}
		},
		module:    {
			loaders: [
				{
					test: /\.scss$/,
					use:  [
						'style-loader?sourceMap',
						'css-loader?importLoaders=1&sourceMap',
						{
							loader:  'postcss-loader',
							options: {
								sourceMap: 'inline',
								plugins:   function () {
									return [
										require( 'autoprefixer' )
									];
								}
							}
						},
						'sass-loader?sourceMap'
					]
				}
			]
		}
	} );

};
