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

					//BH wisdom required
					//somehow need to apply the JS from line 84
					//of https://codepen.io/Grilly86/pen/rwRYYM?editors=0010#0 here, i think

					line.chords[ chordIndex ] = transposeChord(	line.chords[ chordIndex ], amount );

				} )

			}

		} );

	}
}

export default Song;


//--------------------------------------------------------------------------------


//credit: https://codepen.io/Grilly86/pen/rwRYYM

function transposeChord( chord, transpose ) {

	var mod = "";
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

	console.log("chord was", chord);

	if (chord.length > 1) {
	 	mod = chord.substr(1,1);
	 	chord = chord.substr(0,1);
	}

	var chordNr = parseInt(octave.indexOf(chord));

	if (chordNr >= 0) {
		chordNr += parseInt(transpose);

		if (mod=="#") chordNr += 1;
		if (mod=="b") chordNr -= 1;

		if (chordNr < 0) chordNr = chordNr+12;
		if (chordNr >= 12) chordNr = chordNr%12;
	}

	console.log("transposed", chord + mod, "(" + transpose + ")", " => ", chordNr, octave[chordNr]);

	if ( octave[chordNr] === undefined ) {
		console.log("ERROR octave does not contain chordNr", chordNr, "chord", chord);
		return "";
	} else {
			return octave[chordNr];
	}

}

//--------------------------------------------------------------------------------
// credit: https://stackoverflow.com/questions/7936843/how-do-i-transpose-music-chords-using-javascript

function transposeChordUnused( chord, amount ) {

	var scale = [ "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#",
		"B" ];

	return chord.replace( /[CDEFGAB]#?/g, ( match ) => {

		var i = (scale.indexOf( match ) + amount) % scale.length;

		console.log("-- unused -- transposed", chord, "(" + amount + ")", " => ", scale[ i < 0 ? i + scale.length : i ]);

		return scale[ i < 0 ? i + scale.length : i ];

	} );

}

//--------------------------------------------------------------------------------
