import { SET_CURRENT_SET } from 'actions';

const initialState = {
	_id: null,
	songs: []
};

export const currentSet = ( state = initialState, action = {} ) => {
	switch ( action.type ) {
		case SET_CURRENT_SET:
			return {
				...state,
				...action.set
			};

		default:
			return state;
	}
};
