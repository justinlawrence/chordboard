import { octave } from './transpose-chord'

const getKeyDiff = (keyFrom, keyTo) => {
	if (!keyFrom || !keyTo) return 0

	const diff = octave.indexOf(keyTo) - octave.indexOf(keyFrom)

	//console.log(`getKeyDiff - from '${keyFrom}' to '${keyTo}'`, diff)

	return diff < 0 ? diff + octave.length : diff
}

export default getKeyDiff
