import { octave } from 'app/common/transpose-chord';

const getKeyDiff = ( keyFrom, keyTo ) => {

	const diff = octave.indexOf( keyTo ) - octave.indexOf( keyFrom );

	return diff < 0 ? diff + octave.length : diff;

};

export default getKeyDiff;