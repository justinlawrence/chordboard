import { SET_CURRENT_SONG, SET_SONG } from 'actions';

const initialState = {
	_id: null,
	lines: []
};

export const currentSong = ( state = initialState, action = {} ) => {
	switch ( action.type ) {
		case SET_SONG:
			return action.song._id === state._id ? {
				...state,
				...action.song
			} : state;

		case SET_CURRENT_SONG:
			return {
				...state,
				...action.song
			};

		default:
			return state;
	}
};
