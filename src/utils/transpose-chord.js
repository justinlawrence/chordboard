export const octave = [
	'A',
	'Bb',
	'B',
	'C',
	'C#',
	'D',
	'Eb',
	'E',
	'F',
	'F#',
	'G',
	'G#',
]

const CHORD_PATTERN = '[A-Ga-g][#b]?([^)/]*)'
const SLASH_CHORD_PATTERN = `(\\(?)(${CHORD_PATTERN})\\/(${CHORD_PATTERN})(\\)?)`
const PARENTHESIS_PATTERN = `(\\()(${CHORD_PATTERN})(\\))`

export default function transposeChord(chord, amount) {
	//credit: https://codepen.io/Grilly86/pen/rwRYYM
	if (!chord) {
		chord = ''
	}

	const slashMatches = chord.match(new RegExp(SLASH_CHORD_PATTERN))
	const parenthesisMatches = chord.match(new RegExp(PARENTHESIS_PATTERN))
	if (slashMatches) {
		const firstChord = transposeChord(slashMatches[2], amount)
		const secondChord = transposeChord(slashMatches[4], amount)
		return (
			slashMatches[1] + firstChord + '/' + secondChord + slashMatches[6]
		)
	} else if (parenthesisMatches) {
		const chord = transposeChord(parenthesisMatches[2], amount)
		return parenthesisMatches[1] + chord + parenthesisMatches[4]
	}

	let matches = chord.match(new RegExp(CHORD_PATTERN))

	// Make chords uppercase
	let newChord = chord
		.toUpperCase()
		.replace(/([A-G])([BM])/g, (m, p1, p2) => p1 + p2.toLowerCase())

	let mod = ''

	if (newChord.length > 1) {
		mod = newChord.substr(1, 1)
		newChord = newChord.substr(0, 1)
	}

	let chordNr = parseInt(octave.indexOf(newChord))

	if (chordNr >= 0) {
		chordNr += parseInt(amount)

		if (mod === '#') {
			chordNr += 1
		}
		if (mod === 'b') {
			chordNr -= 1
		}

		if (chordNr < 0) {
			chordNr = chordNr + 12
		}
		if (chordNr >= 12) {
			chordNr = chordNr % 12
		}
	}

	if (octave[chordNr] === undefined) {
		console.warn(
			'ERROR octave does not contain chordNr',
			chordNr,
			'chord',
			newChord
		)
		return ''
	} else {
		return octave[chordNr] + (matches && matches[1] ? matches[1] : '')
	}
}

/*

	nashville number reference:

	https://en.wikipedia.org/wiki/Nashville_number_system

	sample structure:

	data types

	header

		title
		subtitle
		author
		copyright
		ccli
		key
		bpm
		highestnote
		recommendedKeys
		versions
		links (youtube, spotify etc.)
		comments
		fontSize
		similar

	detail

		line
			type
				section
				words
			content
			chords
				position
				chord /

//chord colours as assigned by Isaac Newton
Pitch	Solfège	Colour
C	do (or doh in tonic sol-fa)	Red
D	re	Orange
E	mi	Yellow
F	fa	Green
G	sol (or so in tonic sol-fa)	Blue
A	la	Indigo
Blue Violet
B	ti/si	Purple
Red Violet

*/
