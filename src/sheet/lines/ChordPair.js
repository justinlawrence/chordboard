import {h} from "preact";

export default ( { chords, text } ) => {

	let WORD_INDEX = /\b[A-G]/g;
	let result;
	let chordString = chords.replace( /\s+/g, " " ).split( " " );

	let indices = [];
	while ( (result = WORD_INDEX.exec( chordString )) ) {

		indices.push( result.index );

	}

	// If the first index is not zero, then the first chord starts in the
	// middle of the line. So prepend a zero to keep text structure.
	if ( indices[ 0 ] !== 0 ) {

		indices.unshift( 0 );

	}

	let children = [];

	for ( let i = 0; i < indices.length; i++ ) {

		let index = indices[ i ];
		let nextIndex = indices[ i + 1 ] || Infinity;
		let slice = text.slice( index, nextIndex );

		children.push(
			<span class="text-line" data-content={chordString[ i ]}>{slice}</span> );

	}

	return (
		<div class="chord-pair">
			{children}
		</div>
	);

};