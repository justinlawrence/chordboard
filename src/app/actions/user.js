import {SET_USER} from 'app/constants/action-types';

export const setUser = ( { name } ) => {
	return {
		type: SET_USER,
		name
	};
};