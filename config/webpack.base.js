const path = require( 'path' );
const CopyWebpackPlugin = require( "copy-webpack-plugin" );
const HtmlWebpackPlugin = require( 'html-webpack-plugin' );

module.exports = function () {

	return {
		context: path.resolve(),
		entry: [
			'babel-regenerator-runtime',
			path.resolve( 'src' )
		],
		resolve: {
			modules: [
				"node_modules",
				path.resolve( 'src' )
			]
		},
		output: {
			path: path.resolve( 'build' ),
			filename: '[name].js',
			publicPath: '/',
			sourceMapFilename: '[name].map'
		},
		module: {
			loaders: [
				{
					test: /\.js$/,
					exclude: /node_modules/,
					use: 'babel-loader'
				},
				{
					test: /(\.txt|\.onsong)$/,
					use: 'raw-loader'
				}/*,
				{
					test:    /\.(jpe?g|png|gif|svg)$/i,
					loaders: [
						'url?limit=8192',
						'img-loader'
					]
				}*/
			]
		},
		plugins: [
			new CopyWebpackPlugin( [
				{
					from: path.resolve( "src", "assets", "favicon.ico" ),
					to: "favicon.ico"
				},
				{
					from: path.resolve( "src", "assets" ),
					to: "assets"
				}
			] ),
			new HtmlWebpackPlugin( {
				chunkSortMode: 'dependency',
				filename: 'index.html',
				template: 'src/index.html'
			} )
		]
	};

};
