import React from 'react'
import { styled } from '@material-ui/core/styles';
import cx from 'classnames'

import withStyles from '@mui/styles/withStyles';

const PREFIX = 'ChordPair';

const classes = {
    text: `${PREFIX}-text`,
    textEmpty: `${PREFIX}-textEmpty`
};

const Root = styled('div')((
    {
        theme
    }
) => ({
    [`& .${classes.text}`]: {
		display: 'inline-block',
		lineHeight: 1.5,
		marginTop: '1em',
		minHeight: theme.spacing(1),
		position: 'relative',
		verticalAlign: 'middle',
		whiteSpace: 'pre-wrap',

		'&:before': {
			color: '#03a9f4',
			content: 'attr(data-content)',
			fontSize: '.8em',
			fontWeight: '600',
			position: 'absolute',
			top: '-1em',
		},
	},

    [`& .${classes.textEmpty}`]: {
		marginLeft: '.75em',
		minWidth: '2em',
	}
}));

const ChordPair = ({ chords, chordSize,  text, wordSize }) => {
	const children = []

	chords._sort.forEach((index, i) => {
		const nextIndex = chords._sort[i + 1] || Infinity
		let slice = text.slice(index, nextIndex)

		children.push(
			<span
				key={i}
				className={cx(classes.text, {
					[classes.textEmpty]: !slice.trim(),
				})}
				data-content={chords[index]}
			>
				{slice}
			</span>
		)
	})

	return <Root style={{ fontSize: `${wordSize}px` }}>{children}</Root>;
}

export default (ChordPair)
