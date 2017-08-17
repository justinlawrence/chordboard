import Parser from '../parsers/song-parser.js';

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
		this.users = songDoc.users;
		this.author = songDoc.author;
		this.content = songDoc.content;

		songLines.forEach( ( line, i ) => {

			this.lines.push( line );

		} );

	}

	transpose( amount ) {

		// Save old state?

		// Iterate through all chords in song.
		this.lines.forEach( line => {

			if ( line.chords !== undefined ) {

				line.chords._sort.forEach( chordIndex => {

					console.log( "chord index:", chordIndex );
					console.log( "currentChord:", line.chords[ chordIndex ] );
					//console.log("transposing", currentChord,
					// transposeChord(currentChord, amount));

					line.chords[ chordIndex ] = transposeChord(
						line.chords[ chordIndex ], amount );

				} )

			}

		} );

	}
}

export default Song;


//--------------------------------------------------------------------------------

//shamelessly copied off
// https://stackoverflow.com/questions/7936843/how-do-i-transpose-music-chords-using-javascript

function transposeChord( chord, amount ) {

	var scale = [ "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#",
		"B" ];

	return chord.replace( /[CDEFGAB]#?/g, ( match ) => {

		var i = (scale.indexOf( match ) + amount) % scale.length;

		return scale[ i < 0 ? i + scale.length : i ];

	} );

}
