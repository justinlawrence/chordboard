const config = require( './../package.json' ).config;
const path = require( 'path' );
const webpack = require( 'webpack' );
const HtmlWebpackPlugin = require( 'html-webpack-plugin' );

module.exports = function () {

	return {
		entry:   './src/main.js',
		resolve: {
			modules: [
				path.resolve( "src" ),
				"node_modules"
			]
		},
		output:  {
			path: path.resolve( __dirname, '..', 'build' ),
			filename:          '[name].js',
			publicPath:        '/',
			sourceMapFilename: '[name].map'
		},
		module:  {
			loaders: [
				{
					test:    /\.js$/,
					exclude: /node_modules/,
					use:     'babel-loader'
				},
				{
					test: /(\.txt|\.onsong)$/,
					use:  'raw-loader'
				},
				{
					test:    /\.(jpe?g|png|gif|svg)$/i,
					loaders: [
						'url?limit=8192',
						'img-loader'
					]
				}
			]
		},
		plugins: [
			new HtmlWebpackPlugin( {
				chunkSortMode: 'dependency',
				filename:      'index.html',
				template:      'src/index.html'
			} ),
			new webpack.ProvidePlugin( {
				PreactComponent: path.resolve( 'src/globals/component.js' ),
				jsx:             path.resolve( 'src/globals/jsx.js' )
			} )
		]
	};

};
