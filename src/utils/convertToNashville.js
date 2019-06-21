import { parse, prettyPrint, transpose } from 'chord-magic'

import getKeyDiff from './getKeyDiff'

export const chordToNashville = (key, chord) => {
	const nashville = [
		1, // 'A',
		'A#', // 'A#',
		2, // 'B',
		'C', // 'C',
		3, // 'C#',
		4, // 'D',
		'D#', // 'D#',
		5, // 'E',
		'F', // 'F',
		6, // 'F#',
		'G', // 'G',
		7 // 'G#'
	]
	const distance = getKeyDiff(key, 'A')

	return prettyPrint(transpose(parse(chord), distance), { naming: nashville })
}

export const linesToNashville = (key, lines) => {
	const newLines = []

	lines.forEach(line => {
		const newLine = { ...line }

		if (line.chords) {
			const newChords = { ...line.chords }
			delete newChords._sort

			Object.keys(newChords).forEach(k => {
				if (line.chords[k]) {
					newChords[k] = chordToNashville(key, line.chords[k])
				}
			})

			newLine.chords = { ...newChords, _sort: line.chords._sort }
		}

		newLines.push(newLine)
	})

	return newLines
}
