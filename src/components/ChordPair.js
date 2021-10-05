import React from 'react'
import cx from 'classnames'

import { styled } from '@mui/styles'
import { Box } from '@mui/material'

const PREFIX = 'ChordPair'

const classes = {
	emptyLine: `${PREFIX}-emptyLine`,
	text: `${PREFIX}-text`,
	trailingChord: `${PREFIX}-textEmpty`,
}

const StyledChordPair = styled('div')(({ theme }) => ({
	[`& .${classes.text}`]: {
		display: 'inline-flex',
		lineHeight: 1.5,
		marginTop: '1em',
		minHeight: '1.5em',
		position: 'relative',
		verticalAlign: 'middle',
		whiteSpace: 'pre-wrap',

		'&::before': {
			color: '#03a9f4',
			content: 'attr(data-content)',
			fontSize: '.8em',
			fontWeight: '600',
			position: 'absolute',
			top: '-1em',
			visibility: 'visible',
		},
	},

	[`& .${classes.trailingChord}`]: {
		marginLeft: '.75em',
		minWidth: '2em',
	},

	[`& .${classes.emptyLine}`]: {
		height: 0,
		marginRight: '.75em',
		marginTop: '0.25em',
		minHeight: 0,
		visibility: 'hidden',
	},
}))

const ChordPair = ({ chords, chordSize, text, wordSize }) => {
	const children = []

	const isEmptyLine = !text

	chords._sort.forEach((index, i) => {
		const nextIndex = chords._sort[i + 1] || Infinity
		const slice = text.slice(index, nextIndex)

		children.push(
			<span
				key={i}
				className={cx(classes.text, {
					[classes.trailingChord]: !isEmptyLine && !slice.trim(),
					[classes.emptyLine]: isEmptyLine,
				})}
				data-content={chords[index]}
			>
				{isEmptyLine ? chords[index] : slice}
			</span>
		)
	})

	return (
		<StyledChordPair style={{ fontSize: `${wordSize}px` }}>
			{children}
		</StyledChordPair>
	)
}

export default ChordPair
