const ENDS_WITH_COLON = /:$/
const SURROUNDED_BY_SQUARE_BRACKETS = /\]$/

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

export default dataTypes

function isChords(input) {
	return /^(\s|[A-G](#|b)?(sus|maj|min|aug|dim|add|m)?|[0-9]|\/|-|\||[()]|}x\d)+$/g.test(
		input
	)
}

// Test chords.
if (module.hot) {
	const tests = [
		['A', true],
		['B', true],
		['C', true],
		['D', true],
		['E', true],
		['F', true],
		['G', true],
		['H', false],
		['A#', true],
		['Ab', true],
		['Am', true],
		['A#m', true],
		['Abm', true],
		['Gmaj7', true],
		['Dmaj7', true],
		['G2', true],
		['Dsus', true],
	]

	tests.forEach((test, i) => {
		console.assert(
			isChords(test[0]) === test[1],
			`isChords(${test[0]}) - expected: ${test[1]}, actual: ${isChords(
				test[0]
			)}`
		)
	})
}
