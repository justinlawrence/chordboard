/**
 * Song parser
 *
 * Used for parsing user input on the fly in the SongEditor.
 */
import dataTypes from './data-types.js';

class Parser {
	constructor() {

		this.checks = [
			dataTypes.empty,
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

	return chordObject;

}
