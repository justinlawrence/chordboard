const ENDS_WITH_COLON = /:$/
const SURROUNDED_BY_SQUARE_BRACKETS = /\]$/

const isChords = input =>
	/^(\s|([A-G]7?)(#|b)?(sus|maj|min|aug|dim|add|m)?|[0-9]|\/|-|\||[()]|}?x\d)+$/g.test(
		input
	)

const dataTypes = {
	chordLine: {
		type: 'chord-line',
		test: line => isChords(line),
	},
	chordPair: {
		type: 'chord-pair',
		test: (line, prevLine) => {
			return prevLine && isChords(prevLine) && !isChords(line)
		},
	},
	empty: {
		type: 'empty',
		test: line => line.replace(/(\s|\n|\\)/g, '') === '',
	},
	line: {
		type: 'line',
		test: line => !!line,
	},
	section: {
		type: 'section',
		formatter: line => line.replace(ENDS_WITH_COLON, ''),
		test: line => ENDS_WITH_COLON.test(line),
	},
	sectionbrackets: {
		type: 'section',
		formatter: line => line.replace(/(\[|:?\])/g, ''),
		test: line => SURROUNDED_BY_SQUARE_BRACKETS.test(line),
	},
}

export { dataTypes as default, isChords }
