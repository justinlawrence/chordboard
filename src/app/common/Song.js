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

					line.chords[ chordIndex ] =
						transposeChord(line.chords[ chordIndex ], amount );

				} )

			}

		} );

	}
}

export default Song;


//--------------------------------------------------------------------------------

//credit: https://codepen.io/Grilly86/pen/rwRYYM

function transposeChord( chord, transpose ) {

	const octave = [
		"A",
		"Bb",
		"B",
		"C",
		"C#",
		"D",
		"Eb",
		"E",
		"F",
		"F#",
		"G",
		"G#"
	];

	// Make chords uppercase
	let newChord = chord.toUpperCase()
		.replace( /([A-G])([BM])/g, (m, p1, p2) => p1 + p2.toLowerCase() );

	let mod = "";
	let isMinor = /[A-G]m/.test( newChord );

	if ( newChord.length > 1 ) {

		mod = newChord.substr( 1, 1 );
		newChord = newChord.substr( 0, 1 );

	}

	let chordNr = parseInt( octave.indexOf( newChord ) );

	if ( chordNr >= 0 ) {
		chordNr += parseInt( transpose );

		if ( mod === "#" ) {
			chordNr += 1;
		}
		if ( mod === "b" ) {
			chordNr -= 1;
		}

		if ( chordNr < 0 ) {
			chordNr = chordNr + 12;
		}
		if ( chordNr >= 12 ) {
			chordNr = chordNr % 12;
		}
	}

	if ( octave[ chordNr ] === undefined ) {

		console.warn( "ERROR octave does not contain chordNr", chordNr, "chord",
			newChord );
		return '';

	} else {

		return octave[ chordNr ] + (isMinor ? 'm' : '');

	}

}

// Test transposing.
if ( module.hot ) {

	const tests = [
		[ transposeChord( "A", 1 ), "Bb" ],
		[ transposeChord( "A", -1 ), "G#" ],
		[ transposeChord( "a", 1 ), "Bb" ],
		[ transposeChord( "a", -1 ), "G#" ],
		[ transposeChord( "bb", 1 ), "B" ],
		[ transposeChord( "bm", 1 ), "Cm" ],
	];

	tests.forEach( (test, i) => {

		console.assert( test[ 0 ] === test[ 1 ], i + " - expected: " + test[ 1 ] + ", actual: " + test[ 0 ] );

	} );

}