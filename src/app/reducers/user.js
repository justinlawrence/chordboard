import {SET_USER} from 'app/constants/action-types';

const initialState = {
	name: localStorage.getItem( 'user' ) || ''
};

const user = ( state = initialState, action = {} ) => {

	switch ( action.type ) {

		case SET_USER:

			return { name: action.name };

		default:

			return state;

	}

};

export default user;
