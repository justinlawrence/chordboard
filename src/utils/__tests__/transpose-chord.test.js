import transposeChord from '../transpose-chord'

const oracle = [
	[['A', 1], 'Bb'],
	[['A', -1], 'G#'],
	[['a', 1], 'Bb'],
	[['a', -1], 'G#'],
	[['Bb', 1], 'B'],
	[['Bm', 1], 'Cm'],
	[['C#m7', -2], 'Bm7'],
	[['Dadd2', 2], 'Eadd2'],
	[['Ddim2', 2], 'Edim2'],
	[['Dsus4', 2], 'Esus4'],
	[['Didontcare', -2], 'Cidontcare'],
	[['Bb7sus', 2], 'C7sus'],
	[['C/E', 2], 'D/F#'],
	[['Cmaj7/E', 2], 'Dmaj7/F#'],
	[['G2', 2], 'A2'],
	[['Gmaj7', 4], 'Bmaj7'],
	[['(G/B)', 3], '(Bb/D)'],
	[['(Gmaj7/B)', 3], '(Bbmaj7/D)'],
	[['(C)', 5], '(F)'],
]

test.each(oracle)('transposeChord(%s, %s)', (input, expected) => {
	expect(transposeChord(input[0], input[1])).toBe(expected)
})
