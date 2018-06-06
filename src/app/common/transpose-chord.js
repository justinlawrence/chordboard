export const octave = [
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

export default function transposeChord( chord, amount ) {

	//credit: https://codepen.io/Grilly86/pen/rwRYYM

	const chords = chord.split( '/' );
	if ( chords.length > 1 ) {

		return chords.map( c => transposeChord( c, amount ) ).join( '/' );

	}

	let matches = chord.match( /[A-Ga-g][#b]?(.*)/ );

	// Make chords uppercase
	let newChord = chord.toUpperCase()
		.replace( /([A-G])([BM])/g, ( m, p1, p2 ) => p1 + p2.toLowerCase() );

	let mod = '';

	if ( newChord.length > 1 ) {

		mod = newChord.substr( 1, 1 );
		newChord = newChord.substr( 0, 1 );

	}

	let chordNr = parseInt( octave.indexOf( newChord ) );

	if ( chordNr >= 0 ) {
		chordNr += parseInt( amount );

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

		console.warn( "ERROR octave does not contain chordNr", chordNr, "chord", newChord );
		return '';

	} else {

		return octave[ chordNr ] + ( matches && matches[ 1 ] ? matches[ 1 ] : '' );

	}

}

// Test transposing.
if ( module.hot ) {

	const tests = [
		[ transposeChord( "A", 1 ), "Bb" ],
		[ transposeChord( "A", -1 ), "G#" ],
		[ transposeChord( "a", 1 ), "Bb" ],
		[ transposeChord( "a", -1 ), "G#" ],
		[ transposeChord( "Bb", 1 ), "B" ],
		[ transposeChord( "Bm", 1 ), "Cm" ],
		[ transposeChord( "C#m7", -2 ), "Bm7" ],
		[ transposeChord( "Dadd2", 2 ), "Eadd2" ],
		[ transposeChord( "Ddim2", 2 ), "Edim2" ],
		[ transposeChord( "Dsus4", 2 ), "Esus4" ],
		[ transposeChord( "Didontcare", -2 ), "Cidontcare" ],
		[ transposeChord( "Bb7sus", 2 ), "C7sus" ],
		[ transposeChord( "C/E", 2 ), "D/F#" ],
		[ transposeChord( "Cmaj7/E", 2 ), "Dmaj7/F#" ],
		[ transposeChord( "G2", 2 ), "A2" ],
		[ transposeChord( "Gmaj7", 4 ), "Bmaj7" ]
	];

	tests.forEach( ( test, i ) => {

		console.assert( test[ 0 ] === test[ 1 ], i + " - expected: " + test[ 1 ] + ", actual: " + test[ 0 ] );

	} );

}


/*

	nashville number reference:

	https://en.wikipedia.org/wiki/Nashville_number_system

	sample structure:

	data types

	header

		title
		subtitle
		author
		copyright
		ccli
		key
		bpm
		highestnote
		recommendedKeys
		versions
		links (youtube, spotify etc.)
		comments
		fontSize
		similar

	detail

		line
			type
				section
				words
			content
			chords
				position
				chord /

//chord colours as assigned by Isaac Newton
Pitch	Solfège	Colour
C	do (or doh in tonic sol-fa)	Red
D	re	Orange
E	mi	Yellow
F	fa	Green
G	sol (or so in tonic sol-fa)	Blue
A	la	Indigo
Blue Violet
B	ti/si	Purple
Red Violet

*/
