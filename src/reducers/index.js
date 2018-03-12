import { combineReducers } from 'redux';

import { currentSet } from './current-set';
import { syncState } from './sync-state.js';
import { user } from './user.js';

const reducer = combineReducers( {
	currentSet,
	syncState,
	user
} );

export default reducer;
