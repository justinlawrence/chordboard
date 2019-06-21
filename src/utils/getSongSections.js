import Parser from '../parsers/song-parser'
import find from 'lodash/fp/find'
import forEach from 'lodash/fp/forEach'

export const sectionData = [
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
	{ abbreviation: 'END', color: '#444', title: 'End' },
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
	{ abbreviation: '10', color: '#444', title: 'Verse 11' },
]

const getSectionFromTitle = title => find({ title })(sectionData) || {}

const getSections = lines => {
	const sections = []
	let sectionIndex = 0

	forEach(line => {
		if (line.type === 'section') {
			const section = getSectionFromTitle(line.text)
			sections.push({
				abbreviation: section.abbreviation,
				color: section.color,
				title: line.text,
				index: sectionIndex,
			})
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
