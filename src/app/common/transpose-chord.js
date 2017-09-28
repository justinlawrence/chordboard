//credit: https://codepen.io/Grilly86/pen/rwRYYM

export default function transposeChord( chord, transpose ) {

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
		.replace( /([A-G])([BM])/g, ( m, p1, p2 ) => p1 + p2.toLowerCase() );

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

	tests.forEach( ( test, i ) => {

		console.assert( test[ 0 ] === test[ 1 ], i + " - expected: " + test[ 1 ] + ", actual: " + test[ 0 ] );

	} );

}
