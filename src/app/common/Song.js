import Parser from '../parsers/parser.js';

class Song {
	artist = '';
	contents = [];
	title = '';

	constructor( songText ) {

		let parser = new Parser();
		let songLines = parser.parse( songText );

		songLines.forEach( (line, i) => {

			if ( i > 1 && !this.artist ) {

				console.warn( "parseSong - expected an artist on line 2" );
				this.artist = "...";

			}

			if ( line.type === 'title' ) {

				this.title = line.text;

			} else if ( line.type === 'artist' ) {

				this.artist = line.text;

			} else {

				this.contents.push( line );

			}

		} );

	}
}

export default Song;