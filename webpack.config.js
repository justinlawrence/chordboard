const path = require( 'path' );
const webpack = require( 'webpack' );
const ExtractTextPlugin = require( 'extract-text-webpack-plugin' );

module.exports = {
	devtool: 'eval-source-map',
	entry:   './src/main.js',
	output:  {
		path: path.resolve( __dirname, 'build', 'assets' ),
		filename:   'main.js',
		publicPath: '/static/'
	},
	module:  {
		loaders: [
			{
				test:    /\.js$/,
				exclude: /node_modules/,
				use:     'babel-loader'
			},
			{
				test:   /\.txt$/,
				loader: 'raw-loader'
			},
			{
				test: /\.css$/,
				use:  ExtractTextPlugin.extract( {
					fallback: 'style-loader?sourceMap',
					use:      'css-loader?sourceMap'
				} )
			},
			{
				test: /\.scss$/,
				use:  ExtractTextPlugin.extract( {
					fallbackLoader: 'style-loader?sourceMap',
					loader:         [
						{
							loader:  'css-loader',
							options: {
								sourceMap: true
							}
						},
						{
							loader:  'postcss-loader',
							options: {
								sourceMap: 'inline',
								plugins: function () {
									return [
										require( 'autoprefixer' )
									];
								}
							}
						},
						{
							loader:  'sass-loader',
							options: {
								sourceMap: true
							}
						}
					]
				} )
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
		new ExtractTextPlugin( '[name].css' )
	]
};
