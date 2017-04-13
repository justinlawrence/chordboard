const config = require( './package.json' ).config;
const path = require( 'path' );
const webpack = require( 'webpack' );
const ExtractTextPlugin = require( 'extract-text-webpack-plugin' );

module.exports = {
	devtool:   'eval-source-map',
	devServer: {
		compress: true,
		hot:      true,
		inline:   true,

		// Serves /index.html in place of 404's on dev-server requests.
		// Therefore allowing the angular router to handle the request.
		historyApiFallback: {
			index: "/"
		},

		// The rest is terminal config.
		quiet:  false,
		noInfo: false,
		stats:  {
			colors:       true,
			chunkModules: false
		}
	},
	entry:     './src/main.js',
	output:    {
		path:       path.resolve( __dirname, 'build' ),
		filename:   'main.js',
		publicPath: '/build'
	},
	module:    {
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
				test: /\.css$/,
				use:  ExtractTextPlugin.extract( {
					fallback: 'style-loader?sourceMap',
					use:      'css-loader?sourceMap'
				} )
			},
			{
				test: /\.scss$/,
				use:  ExtractTextPlugin.extract( {
					fallback: 'style-loader?sourceMap',
					use:      [
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
								plugins:   function () {
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
	plugins:   [
		new ExtractTextPlugin( '[name].css' ),
		new webpack.ProvidePlugin( {
			PreactComponent: path.resolve( 'src/globals/component.js' ),
			jsx:             path.resolve( 'src/globals/jsx.js' )
		} )
	]
};
