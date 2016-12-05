var path = require( 'path' );

module.exports = {
	entry:   './sheet/sheet.js',
	output:  {
		path:       path.resolve( __dirname, "build" ),
		filename:   'bundle.js',
		publicPath: '/static/'
	},
	devtool: 'eval-source-map',
	module:  {
		loaders: [
			{
				test:   /\.txt$/,
				loader: 'raw-loader'
			},
			{
				test:   /\.less$/,
				loader: 'style-loader!css-loader!less-loader'
			},
			{
				test:    /\.(jpe?g|png|gif|svg)$/i,
				loaders: [
					'url?limit=8192',
					'img-loader'
				]
			}
		]
	}
};
