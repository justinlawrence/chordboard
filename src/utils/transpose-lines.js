import transposeChord from './transpose-chord';

const transposeLines = ( songLines, amount ) => {

	if ( !songLines ) { return null; }

	const lines = [];

	// Iterate through all chords in song.
	songLines.forEach( line => {

		const newLine = { ...line };

		if ( line.chords !== undefined ) {

			newLine.chords = {
				_sort: [ ...line.chords._sort ]
			};

			line.chords._sort.forEach( chordIndex => {
				newLine.chords[ chordIndex ] =
					transposeChord( line.chords[ chordIndex ], amount );
			} )

		}

		lines.push( newLine )

	} );

	return lines;

};

export default transposeLines;

