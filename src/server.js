const cors = require( 'cors' );
const bodyParser = require( 'body-parser' );
const express = require( 'express' );
const app = express();

app.use( bodyParser.json() );
app.use( cors() );

app.post( '/api/songs', function ( req, res ) {
	console.log( 'Song received', req.body );
	res.sendStatus(204);
} );

app.listen( 3000, function () {
	console.log( 'Example app listening on port 3000!' );
} );