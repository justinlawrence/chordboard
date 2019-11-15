import React from 'react'
import { range } from 'lodash'
import cx from 'classnames'

import { withStyles } from '@material-ui/styles'

const styles = theme => ({
	text: {
		display: 'inline-block',
		lineHeight: 1.5,
		marginTop: theme.spacing(3),
		minHeight: theme.spacing(3),
		position: 'relative',
		verticalAlign: 'middle',
		whiteSpace: 'pre-wrap',

		'&:before': {
			color: '#03a9f4',
			content: 'attr(data-content)',
			fontSize: '.8em',
			fontWeight: '600',
			position: 'absolute',
			top: '-18px',
		},
	},
	textEmpty: {
		marginLeft: '.75em',
		minWidth: '2em',
	},
})

const ChordPair = ({ chords, chordSize, classes, text, wordSize }) => {
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

	return <div style={{ fontSize: `${wordSize}px` }}>{children}</div>
}

export default withStyles(styles)(ChordPair)
