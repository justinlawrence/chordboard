import {SET_SYNC_STATE} from '../constants/action-types';

const initialState = {
	text: 'unknown'
};

const syncState = ( state = initialState, action = {} ) => {

	switch ( action.type ) {

		case SET_SYNC_STATE:

			return { text: action.text };

		default:

			return state;

	}

};

export default syncState;
