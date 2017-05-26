
const ENDS_WITH_COLON = /:$/;

const artist = {
	type:      "artist",
	formatter: line => line.replace( /{(?:st|subtitle):\s?(.+?)}/g, "$1" ),
	test:      ( line, prevLine, i ) => i === 1
};

const chordLine = {
	type: "chord-line",
	test: line => isChords( line )
};

const chordMix = {
	type: "chord-mix",
	test: line => containsChords( line )
};

const chordPair = {
	type: "chord-pair",
	test: ( line, prevLine ) => {

		return prevLine && isChords( prevLine ) && !isChords( line );

	}
};

const empty = {
	type: "empty",
	test: line => line.trim() === ""
};

const line = {
	type: "line",
	test: line => !!line
};

const section = {
	type:      "section",
	formatter: line => line.replace( ENDS_WITH_COLON, "" ),
	test:      line => ENDS_WITH_COLON.test( line )
};

const title = {
	type:      "title",
	formatter: line => line.replace( /{(?:t|title):\s?(.+?)}/g, "$1" ),
	test:      ( line, prevLine, i ) => i === 0
};

class Parser {
	constructor() {

		this.checks = [
			empty,
			title,
			artist,
			chordPair,
			chordMix,
			section,
			chordLine,
			line
		];

	}

	clean( line ) {

		if ( !line ) { return ""; }

		// White-list a bunch of characters so we can clean out any invisible
		// characters.
		return line.replace(
			/[^a-zA-Z0-9+-._,:<>/?’'"+=%@#!$%*&();\s\r\n\t{}\[\]\\]/g, "" );

	}

	parseToObject( songText ) {

		let text = this.clean( songText );
		let lines = text.split( "\n" );

		lines.forEach( ( line, i ) => {

		} );

	}

	parse( file ) {

		let cleanFile = this.clean( file );
		let prevLine = null;
		let lines = cleanFile.split( "\n" );
		let output = [];

		lines.forEach( ( line, i ) => {

			for ( let j = 0, len = this.checks.length; j < len; j++ ) {

				let check = this.checks[ j ];

				if ( check.test( line, prevLine, i ) ) {

					let text = line;
					let chords = null;

					if ( check.formatter ) {

						text = check.formatter( text );

					}

					if ( check.type === "chord-pair" ) {

						output.pop();
						chords = prevLine;

					}

					if ( check.type === "chord-mix" ) {

						let chord = false;
						let chordLine = "";
						let textLine = "";

						for ( let i = 0, len = line.length; i < len; i++ ) {

							// Onsong specific.
							if ( line[ i ] === "[" ) {

								chord = true;

							} else if ( line[ i ] === "]" ) {

								chord = false;

							} else if ( chord ) {

								chordLine += line[ i ];

							} else {

								textLine += line[ i ];

								if ( textLine.length > chordLine.length ) {

									chordLine += " ";

								}

							}

						}

						chords = chordLine;
						text = textLine;

					}

					output.push( {
						chords,
						type: check.type,
						text
					} );

					break;

				}

			}

			prevLine = line;

		} );

		return output;

	}
}

export default Parser;

function containsChords( input ) {

	return /\[.*?\]/g.test( input );

}

function isChords( input ) {

	let output = input.replace(
		/(\s|[A-G](#|b)?m?|(sus|maj|min|aug|dim|add)\d?|\/|-|\|)/g, "" );

	return !(output);

}

//--------------------------------------------------------------------------------

//shamelessly copied off https://stackoverflow.com/questions/7936843/how-do-i-transpose-music-chords-using-javascript

function transposeChord(chord, amount) {
  var scale = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  return chord.replace(/[CDEFGAB]#?/g,
                       function(match) {
                         var i = (scale.indexOf(match) + amount) % scale.length;
                         return scale[ i < 0 ? i + scale.length : i ];
                       });
}

//--------------------------------------------------------------------------------

function returnSampleChordStructure() {

	/*

	https://en.wikipedia.org/wiki/Nashville_number_system

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

	return {
 "lines": [
  {
   "type": {
    "t": "title"
   },
   "content": " Hello world"
  },
  {
   "type": {
    "st": "subtitle"
   },
   "content": " Foo Bar"
  },
  {
   "type": {
    "b": "blank"
   }
  },
  {
   "type": {
    "c": "comment"
   },
   "content": " © 2015 FooBar Ltd"
  },
  {
   "type": {
    "b": "blank"
   }
  },
  {
   "type": {
    "v": "verse"
   },
   "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a diam lectus.",
   "chords": {
    "0": "G", //1
    "31": "D/F#", //5/7
    "69": "Em" //6
   }
  },
	"content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a diam lectus.",
	"chords": {
	 "0": "G",
	 "31": "D/F#",
	 "69": "Em"
 },
  {
   "type": {
    "v": "verse"
   },
   "content": "Sed sit amet ipsum mauris.",
   "chords": {
    "5": "G"
   }
  },
  {
   "type": {
    "v": "verse"
   },
   "content": "Maecenas congue ligula ac quam viverra nec consectetur ante hendrerit.",
   "chords": {
    "12": "G",
    "28": "D/F#",
    "64": "G"
   }
  },
  {
   "type": {
    "v": "verse"
   },
   "content": "Donec et mollis dolor.",
   "chords": {
    "27": "D/F#",
    "7": "Bm7"
   }
  }
 ]

}
