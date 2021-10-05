import { isChords } from '../data-types'

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
	['C7', true],
	['A7sus', true],
	['A7sus4', true],
	['Gmaj7', true],
	['Dmaj7', true],
	['G2', true],
	['Dsus', true],
]

test.each(tests)('chord %s should be %s', (chord, result) => {
	expect(isChords(chord)).toBe(result)
})
