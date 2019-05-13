import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { forEach } from 'lodash'

import { withStyles } from '@material-ui/core/styles'

import { sectionData } from '../utils/getSongSections'
import ChordLine from './ChordLine'
import ChordPair from './ChordPair'
import Line from './Line'

const sectionStyles = {}
forEach(sectionData, item => {
	sectionStyles[`&[data-section*="${item.title}"]`] = {
		borderLeft: `4px solid ${item.color}`,
		'&:before': {
			content: `"${item.abbreviation}"`,
			backgroundColor: item.color,
		},
	}
})

const styles = theme => ({
	root: {
		paddingBottom: theme.spacing.unit * 3,
	},
	section: {
		borderLeft: '4px solid #444',
		marginLeft: theme.spacing.keyline,
		marginTop: theme.spacing.unit,
		paddingBottom: 0,
		paddingTop: 0,
		paddingLeft: theme.spacing.unit * 2,
		position: 'relative',

		'&[data-section]:before': {
			backgroundColor: '#444',
			borderRadius: theme.spacing.unit / 2,
			color: 'white',
			paddingBottom: theme.spacing.unit / 2,
			paddingLeft: theme.spacing.unit,
			paddingRight: theme.spacing.unit,
			paddingTop: theme.spacing.unit / 2,
			position: 'absolute',
			transform: 'translate(calc(-100% - 1em - 2px), 0)',
			transformOrigin: '0 0',
			textTransform: 'uppercase',
			zIndex: 1,
		},
		...sectionStyles,

		[theme.breakpoints.down('xs')]: {
			marginLeft: 0,
		},

		'@media print': {
			marginLeft: theme.spacing.unit * 6,
		},
	},
})

class Song extends PureComponent {
	static defaultProps = {
		chordSize: 16,
		lines: [],
		wordSize: 20,
	}

	static propTypes = {
		chordSize: PropTypes.number,
		classes: PropTypes.object,
		lines: PropTypes.array,
		wordSize: PropTypes.number,
	}

	render() {
		const { chordSize, classes, lines, wordSize } = this.props

		let children = []
		let result = []
		let section = ''
		let sectionIndex = 0

		forEach(lines, (line, i) => {
			switch (line.type) {
			case 'chord-line':
				children.push(
					<ChordLine
						key={i}
						chords={line.chords}
						chordSize={chordSize}
						wordSize={wordSize}
					/>
				)
				break

			case 'chord-pair':
				children.push(
					<ChordPair
						key={i}
						chords={line.chords}
						chordSize={chordSize}
						text={line.text}
						wordSize={wordSize}
					/>
				)
				break

			case 'empty':
				children.push(<div key={i} className="empty-line" />)
				break

			case 'line':
				children.push(
					<Line key={i} text={line.text} wordSize={wordSize} />
				)
				break

			case 'section':
				if (section) {
					// Finish off last section
					result.push(
						<section
							id={`section-${sectionIndex}`}
							key={`section-${sectionIndex}`}
							className={classes.section}
							data-section={section}
						>
							{children}
						</section>
					)
					children = []
				} else {
					result = result.concat(children)
				}

				section = line.text
				//sections.push( { title: line.text, index: sectionIndex } );

				sectionIndex++

				break
			}
		})

		if (section) {
			result.push(
				<section
					id={`section-${sectionIndex}`}
					key={`section-${sectionIndex}`}
					className={classes.section}
					data-section={section}
				>
					{children}
				</section>
			)
		}

		if (children.length && !section) {
			result = result.concat(children)
		}

		return <div className={classes.root}>{result}</div>
	}
}

export default withStyles(styles)(Song)
