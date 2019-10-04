export const SET_FONT_SIZE = 'SET_FONT_SIZE'
export const SET_CURRENT_USER = 'SET_CURRENT_USER'

const nullUser = {
	id: null,
	name: '',
	fontSize: 'medium',
};

export const setCurrentUser = user => ({
	type: SET_CURRENT_USER,
	user: user || nullUser
});

export const setFontSize = fontSize => ({
	type: SET_FONT_SIZE,
	payload: fontSize
})