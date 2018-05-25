import { octave } from 'app/common/transpose-chord';

const getKeyDiff = ( keyFrom, keyTo ) => {

	const diff = octave.indexOf( keyTo ) - octave.indexOf( keyFrom );

	console.log("transposing from " + keyFrom + " to " + keyTo, diff);

	return diff < 0 ? diff + octave.length : diff;

};

export default getKeyDiff;
