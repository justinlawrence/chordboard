import { SET_CURRENT_SONG } from '../actions'

const initialState = {
	id: null,
	lines: []
}

export const currentSong = (state = initialState, action = {}) => {
	switch (action.type) {
	case SET_CURRENT_SONG:
		return {
			...state,
			...action.song
		}

	default:
		return state
	}
}
