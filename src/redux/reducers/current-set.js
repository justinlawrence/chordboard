import { SET_CURRENT_SET, SET_CURRENT_SET_ID } from '../actions'

const initialState = {
	id: null,
	songs: []
}

export const currentSet = (state = initialState, action = {}) => {
	switch (action.type) {
	case SET_CURRENT_SET:
		return {
			...state,
			...action.set
		}

	case SET_CURRENT_SET_ID:
		return {
			id: action.payload
		}

	default:
		return state
	}
}
