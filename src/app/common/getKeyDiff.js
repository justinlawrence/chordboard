import {octave} from 'app/common/transpose-chord';

const getKeyDiff = ( keyFrom, keyTo ) => {

	return octave.indexOf( keyTo ) - octave.indexOf( keyFrom );

};

export default getKeyDiff;