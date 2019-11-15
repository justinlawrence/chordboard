import { SET_CURRENT_USER, SET_FONT_SIZE } from '../actions'

let initialUser = {
	id: null,
	name: '',
	fontSize: 'medium',
}

try {
	const user = JSON.parse(localStorage.getItem('user'))
	if (user.name) {
		initialUser = user
	} else {
		localStorage.removeItem('user')
	}
} catch (err) {
	console.error('Could not get `user` from localStorage')
	localStorage.removeItem('user')
}

export const user = (state = initialUser, action = {}) => {
	switch (action.type) {
		case SET_CURRENT_USER:
			return {
				...state,
				...action.user,
			}

		case SET_FONT_SIZE:
			return {
				...state,
				fontSize: action.payload
			}

		default:
			return state
	}
}


export const getFontSize = state => state.user.fontSize