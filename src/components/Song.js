import React from 'react'
import { styled } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import { forEach } from 'lodash'

import * as actions from '../redux/actions'
import { getFontSize } from '../redux/reducers/user'
import { getSectionFromTitle, sectionData } from '../utils/getSongSections'
import ChordPair from './ChordPair'
import Line from './Line'

const PREFIX = 'Song'

const classes = {
	root: `${PREFIX}-root`,
	section: `${PREFIX}-section`,
	emptyLine: `${PREFIX}-emptyLine`,
}

const sectionStyles = {}
forEach(sectionData, section => {
	sectionStyles[`&[data-section="${section.title}"]`] = {
		borderLeft: `4px solid ${section.color}`,

		'&::before': {
			content: `"${section.abbreviation}"`,
			backgroundColor: section.color,
			'-webkit-print-color-adjust': 'exact',
		},
	}
})

const Root = styled('div')(({ theme }) => ({
	overflowWrap: 'break-word',
	whiteSpace: 'pre-wrap',

	[`& .${classes.section}`]: {
		borderLeft: '4px solid #444',
		marginLeft: theme.spacing(8),
		marginTop: theme.spacing(4),
		paddingBottom: 0,
		paddingTop: 0,
		paddingLeft: theme.spacing(2),
		position: 'relative',

		'&[data-section]:before': {
			backgroundColor: '#444',
			borderRadius: theme.spacing(0.5),
			color: 'white',
			paddingBottom: theme.spacing(0.5),
			paddingLeft: theme.spacing(),
			paddingRight: theme.spacing(),
			paddingTop: theme.spacing(0.5),
			position: 'absolute',
			transform: 'translate(calc(-100% - 1em), 0)',
			transformOrigin: '0 0',
			textTransform: 'uppercase',
			zIndex: 1,
		},
		...sectionStyles,

		[theme.breakpoints.down('sm')]: {
			marginLeft: 0,
		},

		'@media print': {
			marginLeft: theme.spacing(6),
		},
	},

	[`& .${classes.emptyLine}`]: {
		lineHeight: 1.5,
	},
}))

const Song = ({
	chordSize: chordSizeProp = 16,
	fontSize,
	lines = [],
	wordSize: wordSizeProp = 20,
}) => {
	let scale
	switch (fontSize) {
		case 'small':
			scale = 0.8
			break
		case 'medium':
		default:
			scale = 1
			break
		case 'large':
			scale = 1.5
			break
	}

	const chordSize = chordSizeProp * scale
	const wordSize = wordSizeProp * scale

	let children = []
	let result = []
	let sectionTitle = ''
	let sectionIndex = 0

	forEach(lines, (line, i) => {
		switch (line.type) {
			case 'chord-line':
			case 'chord-pair':
				children.push(
					<ChordPair
						key={i}
						line={line}
						chordSize={chordSize}
						wordSize={wordSize}
					/>
				)
				break

			case 'empty':
				children.push(
					<div key={i} className={classes.emptyLine}>
						{' '}
					</div>
				)
				break

			case 'line':
				children.push(
					<Line key={i} text={line.text} wordSize={wordSize} />
				)
				break

			case 'section':
				if (sectionTitle) {
					// Finish off last section
					result.push(
						<section
							id={`section-${sectionIndex}`}
							key={`section-${sectionIndex}`}
							className={classes.section}
							data-section={sectionTitle}
						>
							{children}
						</section>
					)
					children = []
				} else {
					result = result.concat(children)
				}

				const section = getSectionFromTitle(line.text)
				sectionTitle = section.title
				//sections.push( { title: line.text, index: sectionIndex } );

				sectionIndex++

				break

			default:
				break
		}
	})

	if (sectionTitle) {
		result.push(
			<section
				id={`section-${sectionIndex}`}
				key={`section-${sectionIndex}`}
				className={classes.section}
				data-section={sectionTitle}
			>
				{children}
			</section>
		)
	}

	if (children.length && !sectionTitle) {
		result = result.concat(children)
	}

	return <Root className={classes.root}>{result}</Root>
}

const mapStateToProps = state => ({
	fontSize: getFontSize(state),
})

export default connect(mapStateToProps, actions)(Song)
