export const SET_CURRENT_USER = 'SET_CURRENT_USER'

export const setCurrentUser = ( { name } ) => ({
	type: SET_CURRENT_USER,
	name
});