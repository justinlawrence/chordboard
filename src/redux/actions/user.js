export const SET_CURRENT_USER = 'SET_CURRENT_USER'

const nullUser = {
	id: null,
	name: ''
};

export const setCurrentUser = user => ({
	type: SET_CURRENT_USER,
	user: user || nullUser
});