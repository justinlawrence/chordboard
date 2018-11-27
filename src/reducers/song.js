import { combineReducers } from 'redux';
import reduce from 'lodash/fp/reduce';

import {
	FETCH_SONGS_SUCCESS,
	MERGE_SONGS,
	SET_SONG
} from 'actions';


const byId = ( state = {}, action = {} ) => {
	switch ( action.type ) {
		case MERGE_SONGS:
			return reduce( (acc, song) => {
				acc[song.id] = acc[song.id] ? merge( acc[song.id] )( song ) : song;
				return acc;
			})( { ...state } )( action.payload.songs );

		case SET_SONG:
			return {
				...state,
				[ action.song._id ]: action.song
			};

		case FETCH_SONGS_SUCCESS:
			return reduce( (acc, song) => {
				acc[song.id] = song;
				return acc;
			})( { ...state } )( action.payload.songs );

		default:
			return state;
	}
};

export const song = combineReducers( {
	byId
} );
