import {h} from "preact";
import {range} from "lodash";

const ChordPair = ( { chords, text } ) => {

	const children = [];

	chords._sort.forEach( ( index, i ) => {

		const nextIndex = chords._sort[ i + 1 ] || Infinity;
		let slice = text.slice( index, nextIndex );

		// Pad the sliced text with spaces so overhanging chords will be
		// positioned correctly.
		if ( slice.length < nextIndex - index && nextIndex - index !== Infinity ) {

			range( (nextIndex - index) - slice.length ).forEach( () => {

				slice += " ";

			} );

		}

		children.push(
			<span class="text-line" data-content={chords[ index ]}>
				{slice}
			</span>
		);

	} );

	return (
		<div class="chord-pair">{children}</div>
	);

};

export default ChordPair;