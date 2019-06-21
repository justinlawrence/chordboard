import { SET_CURRENT_USER } from '../actions'

let initialUser = {
	id: null,
	name: ''
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
			...action.user
		}

	default:
		return state
	}
}
