import Parser from '../parsers/song-parser'
import forEach from 'lodash/fp/forEach'

const getSections = lines => {
	const sections = []
	let sectionIndex = 0

	forEach(line => {
		if (line.type === 'section') {
			sections.push({ title: line.text, index: sectionIndex })
			sectionIndex++
		}
	})(lines)

	return sections
}

const getSongSections = song => {
	if (!song) return []
	const parser = new Parser()
	const lines = parser.parse(song.content)
	return getSections(lines)
}

export default getSongSections
