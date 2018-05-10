import { combineReducers } from 'redux';

import { currentSet } from './current-set';
import { currentSong } from './current-song';
import { song } from './song.js';
import { syncState } from './sync-state.js';
import { user } from './user.js';

const reducer = combineReducers( {
	currentSet,
	currentSong,
	syncState,
	song,
	user
} );

export default reducer;
