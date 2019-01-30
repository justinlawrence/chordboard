import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { forEach } from 'lodash'

import { withStyles } from '@material-ui/core/styles'

import ChordLine from './ChordLine'
import ChordPair from './ChordPair'
import Line from './Line'
import Typography from '@material-ui/core/Typography'

const sectionData = [
	{ abbreviation: 'BR', color: '#03a9f4', title: 'Bridge' },
	{ abbreviation: 'CH', color: '#ff5252', title: 'Chorus' },
	{ abbreviation: 'CH 2', color: '#ff5252', title: 'Chorus 2' },
	{ abbreviation: 'CH 3', color: '#ff5252', title: 'Chorus 3' },
	{ abbreviation: 'CH 4', color: '#ff5252', title: 'Chorus 4' },
	{ abbreviation: 'PC', color: '#ff9800', title: 'Pre-chorus' },
	{ abbreviation: 'PC', color: '#ff9800', title: 'Pre-Chorus' },
	{ abbreviation: 'PC', color: '#ff9800', title: 'Pre chorus' },
	{ abbreviation: 'PC', color: '#ff9800', title: 'Prechorus' },
	{ abbreviation: 'PC', color: '#ff9800', title: 'Pre-chorus' },
	{ abbreviation: 'IN', color: '#00bcd4', title: 'Intro' },
	{ abbreviation: 'OUT', color: '#444', title: 'Outtro' },
	{ abbreviation: 'OUT', color: '#444', title: 'Out' },
	{ abbreviation: 'INST', color: 'silver', title: 'Interlude' },
	{ abbreviation: 'INST', color: 'silver', title: 'Instrumental' },
	{ abbreviation: 'TAG', color: '#444', title: 'Tag' },
	{ abbreviation: 'HOOK', color: '#444', title: 'Hook' },
	{ abbreviation: 'V', color: '#444', title: 'Verse' },
	{ abbreviation: '1', color: '#444', title: 'Verse 1' },
	{ abbreviation: '2', color: '#444', title: 'Verse 2' },
	{ abbreviation: '3', color: '#444', title: 'Verse 3' },
	{ abbreviation: '4', color: '#444', title: 'Verse 4' },
	{ abbreviation: '5', color: '#444', title: 'Verse 5' },
	{ abbreviation: '6', color: '#444', title: 'Verse 6' },
	{ abbreviation: '7', color: '#444', title: 'Verse 7' },
	{ abbreviation: '8', color: '#444', title: 'Verse 8' },
	{ abbreviation: '9', color: '#444', title: 'Verse 9' },
	{ abbreviation: '10', color: '#444', title: 'Verse 10' },
	{ abbreviation: '10', color: '#444', title: 'Verse 11' }
]

const sectionStyles = {}
forEach(sectionData, item => {
	sectionStyles[`&[data-section*="${item.title}"]`] = {
		borderLeft: `4px solid ${item.color}`,
		'&:before': {
			content: `"${item.abbreviation}"`,
			backgroundColor: item.color
		}
	}
})

const styles = theme => ({
	section: {
		marginLeft: theme.spacing.keyline,
		marginTop: theme.spacing.unit,
		paddingBottom: 0,
		paddingTop: 0,
		paddingLeft: theme.spacing.unit * 2,
		position: 'relative',

		'&[data-section]:before': {
			backgroundColor: '#eee',
			borderRadius: theme.spacing.unit / 2,
			color: 'white',
			paddingBottom: theme.spacing.unit / 2,
			paddingLeft: theme.spacing.unit,
			paddingRight: theme.spacing.unit,
			paddingTop: theme.spacing.unit / 2,
			position: 'absolute',
			transform: 'translate(calc(-100% - 1em), 0)',
			transformOrigin: '0 0',
			textTransform: 'uppercase',
			zIndex: 1
		},
		...sectionStyles,

		'&@media print': {
			paddingLeft: theme.spacing.unit * 2,
			marginLeft: theme.spacing.unit * 6
		}
	}
})

class Song extends PureComponent {
	static defaultProps = {
		chordSize: 16,
		lines: [],
		wordSize: 20
	}

	static propTypes = {
		chordSize: PropTypes.number,
		classes: PropTypes.object,
		lines: PropTypes.array,
		wordSize: PropTypes.number
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
				children.push(<Line key={i} text={line.text} wordSize={wordSize} />)
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

		return <div>{result}</div>
	}
}

export default withStyles(styles)(Song)
