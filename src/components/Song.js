import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { forEach } from 'lodash'
import cx from 'classnames'

import { withStyles } from '@material-ui/core/styles'

import ChordLine from './ChordLine'
import ChordPair from './ChordPair'
import Line from './Line'

const styles = theme => ({
	root: {
		marginLeft: theme.spacing.keyline,
		marginTop: theme.spacing.unit,
		paddingBottom: 0,
		paddingTop: 0,
		paddingLeft: theme.spacing.unit * 2,
		position: 'relative'
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
							className={cx(classes.root, 'song-viewer__section')}
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
					className="song-viewer__section"
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
