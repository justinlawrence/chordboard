import React from 'react';
import { range } from "lodash";

import { withStyles } from '@material-ui/core/styles';

const styles = theme => ( {
	text: {
		display: 'inline-block',
		height: 0,
		lineHeight: `${theme.spacing.unit * 3}px`,
		marginRight: '.75em',
		marginTop: theme.spacing.unit * 3,
		position: 'relative',
		verticalAlign: 'middle',
		visibility: 'hidden',
		whiteSpace: 'pre',

		'&:before': {
			color: '#03a9f4',
			content: 'attr(data-content)',
			fontSize: '.8em',
			position: 'absolute',
			fontWeight: '600',
			top: '-18px',
			visibility: 'visible'
		}
	}
} );

const ChordLine = ( { chords, chordSize, classes, wordSize } ) => {

	const children = [];

	chords._sort.forEach( ( index, i ) => {

		const nextIndex = chords._sort[ i + 1 ] || Infinity;
		let slice = "";

		// Pad the sliced text with spaces so overhanging chords will be
		// positioned correctly.
		if ( slice.length < nextIndex - index && nextIndex - index !== Infinity ) {

			range( ( nextIndex - index ) - slice.length ).forEach( () => {

				slice += " ";

			} );

		}

		children.push(
			<span
				className={classes.text}
				key={`chord-${i}`}
				data-content={chords[ index ]}
			>
				{chords[ index ]}
			</span>
		);

	} );


	return (
		<div style={{ fontSize: `${wordSize}px` }}>
			{children}
		</div>
	);

};

export default withStyles( styles )( ChordLine );