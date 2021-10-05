import React from 'react'
import cx from 'classnames'

import { styled } from '@mui/styles'

const PREFIX = 'ChordPair'

const classes = {
	justChords: `${PREFIX}-justChords`,
	text: `${PREFIX}-text`,
	trailingChord: `${PREFIX}-trailingChord`,
}

const StyledChordPair = styled('div')(({ theme }) => ({
	[`& .${classes.text}`]: {
		display: 'inline',
		fontWeight: '500',

		lineHeight: 2.25,
		position: 'relative',
		verticalAlign: 'middle',

		'&::before': {
			color: '#03a9f4',
			content: 'attr(data-content)',
			fontSize: '.8em',
			fontWeight: '600',
			position: 'absolute',
			top: '-1.5em',
			visibility: 'visible',
		},
	},

	[`& .${classes.trailingChord}`]: {
		display: 'inline',
		marginLeft: '.75em',
		minWidth: '2em',
		visibility: 'hidden',
	},

	[`& .${classes.justChords}`]: {
		height: 0,
		lineHeight: theme.spacing(3),
		marginRight: '.75em',
		marginTop: '2.25em',
		minHeight: 0,
		visibility: 'hidden',

		'&::before': {
			top: 0,
		},
	},
}))

const ChordPair = ({ chords, chordSize, text, wordSize }) => {
	const children = []

	const isJustChords = !text

	chords._sort.forEach((index, i) => {
		const nextIndex = chords._sort[i + 1] || Infinity
		const slice = text.slice(index, nextIndex)

		const isTrailingChord = !isJustChords && !slice.trim()

		children.push(
			<span
				key={i}
				className={cx(classes.text, {
					[classes.trailingChord]: isTrailingChord,
					[classes.justChords]: isJustChords,
				})}
				data-content={chords[index]}
			>
				{isJustChords || isTrailingChord ? chords[index] : slice}
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
