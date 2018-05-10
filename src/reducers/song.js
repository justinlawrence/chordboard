import { combineReducers } from 'redux';

import {
	SET_SONG
} from 'actions';


const byId = ( state = {}, action = {} ) => {
	switch ( action.type ) {
		case SET_SONG:
			return {
				...state,
				[ action.song._id ]: action.song
			};

		default:
			return state;
	}
};

export const song = combineReducers( {
	byId
} );
