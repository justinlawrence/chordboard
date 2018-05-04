import { SET_SYNC_STATE } from '../actions';

const initialState = {
	text: 'unknown'
};

export const syncState = ( state = initialState, action = {} ) => {
	switch ( action.type ) {

		case SET_SYNC_STATE:
			return {
				...state,
				text: action.text
			};

		default:
			return state;

	}
};
