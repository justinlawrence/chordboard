import { includes } from 'lodash';
import * as Chord from 'tonal-chord';
import * as Key from 'tonal-key';

export const chordToNashville = ( key, chord ) => {

	const keyTokens = Chord.tokenize( key );
	const keyNote = keyTokens[ 0 ] + ( keyTokens[ 1 ] === 'm' ? ' minor' : ' major' );

	const chordTokens = Chord.tokenize( chord );
	const chordIsMinor = chordTokens[ 1 ] === 'm';

	const scale = Key.scale( keyNote );

	let result = scale.indexOf( chordTokens[ 0 ] ) + 1;

	if ( chordIsMinor ) {

		result += 'm';

	}

	return String( result );

};

export const linesToNashville = ( key, lines ) => {

	const newLines = [];

	lines.forEach( line => {

		const newLine = { ...line };

		if ( line.chords ) {

			const newChords = { ...line.chords };
			delete newChords._sort;

			Object.keys( newChords ).forEach( k => {

				if ( line.chords[ k ] ) {

					newChords[ k ] = chordToNashville( key, line.chords[ k ] );

				}

			} );

			newLine.chords = { ...newChords, _sort: line.chords._sort };

		}

		newLines.push( newLine );

	} );

	return newLines;

};