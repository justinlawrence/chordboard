import React from 'react'
import cx from 'classnames'

import { styled } from '@mui/styles'

const PREFIX = 'ChordPair'

const classes = {
	emptyLine: `${PREFIX}-emptyLine`,
	text: `${PREFIX}-text`,
	trailingChord: `${PREFIX}-trailingChord`,
}

const StyledChordPair = styled('div')(({ theme }) => ({
	[`& .${classes.text}`]: {
		display: 'inline',
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

	[`& .${classes.emptyLine}`]: {
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

	const isEmptyLine = !text

	chords._sort.forEach((index, i) => {
		const nextIndex = chords._sort[i + 1] || Infinity
		const slice = text.slice(index, nextIndex)

		const isTrailingChord = !isEmptyLine && !slice.trim()

		children.push(
			<span
				key={i}
				className={cx(classes.text, {
					[classes.trailingChord]: isTrailingChord,
					[classes.emptyLine]: isEmptyLine,
				})}
				data-content={chords[index]}
			>
				{isEmptyLine || isTrailingChord ? chords[index] : slice}
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
