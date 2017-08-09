import Parser from '../parsers/parser.js';

class Song {
	artist = '';
	contents = [];
	title = '';

	constructor( songText ) {

		let parser = new Parser();
		let songLines = parser.parse( songText );

		songLines.forEach( ( line, i ) => {

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

	transpose( amount ) {

		// Save old state?

		// Iterate through all chords in song.
		this.contents.forEach( line => {

			if ( line.chords !== undefined ) {

				line.chords._sort.forEach( chordIndex => {

					console.log("chord index:", chordIndex);
					console.log("currentChord:", line.chords[chordIndex]);
					//console.log("transposing", currentChord, transposeChord(currentChord, amount));

					line.chords[chordIndex] = transposeChord( line.chords[chordIndex], amount );

				})

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
