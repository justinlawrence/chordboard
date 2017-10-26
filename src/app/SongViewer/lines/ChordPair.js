import {range} from "lodash";
import cx from 'classnames';

const ChordPair = ( { chords, text } ) => {

	const children = [];

	chords._sort.forEach( ( index, i ) => {

		const nextIndex = chords._sort[ i + 1 ] || Infinity;
		let slice = text.slice( index, nextIndex );

		children.push(
			<span
				className={cx(
					'text-line',
					{ 'text-line_empty': !slice.trim() }
				)}
				data-content={chords[ index ]}
			>
				{slice}
			</span>
		);

	} );

	return (
		<div class="chord-pair">{children}</div>
	);

};

export default ChordPair;