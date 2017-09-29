import Parser from '../parsers/song-parser.js';
import transposeChord from './transpose-chord';

class Song {
	_id = null;
	_rev = null;
	author = '';
	content = '';
	lines = [];
	slug = '';
	title = '';
	type = 'song';

	constructor( songDoc ) {

		if ( !songDoc ) { songDoc = {}; }

		let parser = new Parser();
		let songLines = parser.parse( songDoc.content );

		this._id = songDoc._id;
		this._rev = songDoc._rev;
		this.slug = songDoc.slug;
		this.title = songDoc.title;
		this.key = songDoc.key;
		this.users = songDoc.users;
		this.author = songDoc.author;
		this.content = songDoc.content;

		songLines.forEach( ( line, i ) => {

			this.lines.push( line );

		} );

	}

	transpose( amount ) {

		// Save old state?

		this.key = transposeChord( this.key, amount );

		// Iterate through all chords in song.
		this.lines.forEach( line => {

			if ( line.chords !== undefined ) {

				line.chords._sort.forEach( chordIndex => {

					line.chords[ chordIndex ] =
						transposeChord(line.chords[ chordIndex ], amount );

				} )

			}

		} );

	}
}

export default Song;


//--------------------------------------------------------------------------------

