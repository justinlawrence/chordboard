import React from 'react';
import { styled } from '@material-ui/core/styles';
import { range } from "lodash";

import withStyles from '@mui/styles/withStyles';

const PREFIX = 'ChordLine';

const classes = {
    text: `${PREFIX}-text`
};

const Root = styled('div')((
    {
        theme
    }
) => ({
    [`& .${classes.text}`]: {
		display: 'inline-block',
		height: 0,
		lineHeight: theme.spacing(3),
		marginRight: '.75em',
		marginTop: theme.spacing(3),
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
}));

const ChordLine = ({ chords, chordSize,  wordSize }) => {

	const children = [];

	chords._sort.forEach((index, i) => {

		const nextIndex = chords._sort[i + 1] || Infinity;
		let slice = "";

		// Pad the sliced text with spaces so overhanging chords will be
		// positioned correctly.
		if (slice.length < nextIndex - index && nextIndex - index !== Infinity) {

			range((nextIndex - index) - slice.length).forEach(() => {

				slice += " ";

			});

		}

		children.push(
			<span
				className={classes.text}
				key={`chord-${i}`}
				data-content={chords[index]}
			>
				{chords[index]}
			</span>
		);

	});


	return (
        <Root style={{ fontSize: `${wordSize}px` }}>
			{children}
		</Root>
    );

};

export default (ChordLine);