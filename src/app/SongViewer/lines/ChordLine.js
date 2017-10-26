import {range} from "lodash";

export default ( { chords } ) => {

	const children = [];

	chords._sort.forEach( ( index, i ) => {

		const nextIndex = chords._sort[ i + 1 ] || Infinity;
		let slice = "";

		// Pad the sliced text with spaces so overhanging chords will be
		// positioned correctly.
		if ( slice.length < nextIndex - index && nextIndex - index !== Infinity ) {

			range( (nextIndex - index) - slice.length ).forEach( () => {

				slice += " ";

			} );

		}

		children.push(
			<span class="text-line" data-content={chords[ index ]}>
				{chords[ index ]}
			</span>
		);

	} );

	return <div class="chord-line">{ children }</div>;

};