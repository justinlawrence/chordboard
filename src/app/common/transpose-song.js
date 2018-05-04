import transposeChord from './transpose-chord';

const transposeSong = ( _song, amount ) => {

	if ( !_song ) { return null; }

	const song = {
		..._song,
		lines: [ ..._song.lines ]
	};

	song.key = transposeChord( song.key, amount );

	// Iterate through all chords in song.
	song.lines.forEach( line => {

		if ( line.chords !== undefined ) {

			line.chords._sort.forEach( chordIndex => {

				line.chords[ chordIndex ] =
					transposeChord( line.chords[ chordIndex ], amount );

			} )

		}

	} );

	return song;

};

export default transposeSong;

