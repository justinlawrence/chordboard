import { combineReducers } from 'redux'
import merge from 'lodash/fp/merge'
import reduce from 'lodash/fp/reduce'

import { DELETE_SONG, MERGE_SONGS, SET_SONG } from '../actions'

const byId = (state = {}, action = {}) => {
	switch (action.type) {
	case DELETE_SONG:
		return reduce((acc, song) => {
			if (song.id !== action.payload) {
				acc[song.id] = song
			}
			return acc
		})({})(state)

	case MERGE_SONGS:
		return reduce((acc, song) => {
			acc[song.id] = acc[song.id] ? merge(acc[song.id])(song) : song
			return acc
		})({ ...state })(action.payload.songs)

	case SET_SONG:
		return {
			...state,
			[action.song.id]: action.song
		}

	default:
		return state
	}
}

export const songs = combineReducers({
	byId
})
