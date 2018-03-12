import { SET_CURRENT_USER } from 'actions';

const initialState = {
	name: localStorage.getItem( 'user' ) || ''
};

export const user = ( state = initialState, action = {} ) => {
	switch ( action.type ) {
		case SET_CURRENT_USER:
			return {
				...state,
				name: action.name
			};

		default:
			return state;
	}
};
