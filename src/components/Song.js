import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { clamp, forEach } from 'lodash'
import { withStyles } from '@material-ui/styles'

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
		paddingBottom: theme.spacing(14),
	},
	section: {
		borderLeft: '4px solid #444',
		marginLeft: theme.spacing(8),
		marginTop: theme.spacing(),
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
			marginLeft: theme.spacing(6),
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

	state = {
		scale: 1,
	}

	prevScale = 1

	handlePinch = event =>
		this.setState({ scale: clamp(event.scale * this.prevScale, 0.8, 1.2) })
	//this.setState({ scale: event.scale * this.prevScale })

	handlePinchEnd = event => (this.prevScale = this.state.scale)

	render() {
		const {
			chordSize: chordSizeProp,
			classes,
			lines,
			wordSize: wordSizeProp,
		} = this.props
		const { scale } = this.state

		const chordSize = chordSizeProp * scale
		const wordSize = wordSizeProp * scale

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
