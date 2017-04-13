function buildConfig( env ) {

	return require( './config/webpack.' + env + '.js' )( env );

}

module.exports = buildConfig;
