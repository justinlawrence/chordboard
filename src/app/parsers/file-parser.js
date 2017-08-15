/**
 * File parser
 *
 * The focus of this parser is to convert raw song files into an easier to use
 * data structure.
 */
import dataTypes from './data-types.js';

const artist = {
	type:      "artist",
	formatter: line => line.replace( /{(?:st|subtitle):\s?(.+?)}/g, "$1" ),
	test:      ( line, prevLine, i ) => i === 1
};

const title = {
	type:      "title",
	formatter: line => line.replace( /{(?:t|title):\s?(.+?)}/g, "$1" ),
	test:      ( line, prevLine, i ) => i === 0
};

class Parser {
	constructor() {

		this.checks = [
			dataTypes.empty,
			title,
			artist,
			dataTypes.chordPair,
			dataTypes.section,
			dataTypes.sectionbrackets,
			dataTypes.chordLine,
			dataTypes.line
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

					if ( check.type === "chord-line" ) {

						chords = text.replace( /-/g, "" );
						text = "";

					}

					output.push( {
						chords: chordStringToObject( chords ),
						type:   check.type,
						text:   text
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

function chordStringToObject( chordString ) {

	if ( !chordString ) { return; }

	const WORD_INDEX = /(?:\b([A-G])\S*?\/[A-G]|\b([A-G]))/g;
	const chords = chordString.split( /\s+/g );
	const indices = [];

	let result;
	while ( (result = WORD_INDEX.exec( chordString )) ) {

		indices.push( result.index );

	}

	// If the first index is not zero, then the first chord starts in the
	// middle of the line. So prepend a zero to keep text structure.
	if ( indices[ 0 ] !== 0 ) {

		indices.unshift( 0 );

	}

	const chordObject = {};
	chords.forEach( ( chord, i ) => {

		chordObject._sort = indices;
		chordObject[ indices[ i ] ] = chord;

	} );

	//console.log( chordObject );

	return chordObject;

}

//--------------------------------------------------------------------------------

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
