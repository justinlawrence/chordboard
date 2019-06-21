import { combineReducers } from 'redux'
import { handleActions } from 'redux-actions'
import isEqual from 'lodash/fp/isEqual'
import merge from 'lodash/fp/merge'
import omit from 'lodash/fp/omit'
import reduce from 'lodash/fp/reduce'

const initialState = {
	byId: {}
}

const byId = handleActions(
	{
		MERGE_SETS: (state, action) =>
			reduce((acc, set) => {
				if (acc[set.id]) {
					if (!isEqual(acc[set.id])(set)) {
						acc[set.id] = reduce(merge, {}, [acc[set.id], set])
					}
				} else {
					acc[set.id] = set
				}
				return acc
			})({ ...state })(action.payload),
		REMOVE_SET: (state, action) => omit(action.payload)({ ...state }),
		SET_SET_SONGS: (state, action) => {
			const newState = {
				...state,
				[action.payload.setId]: {
					...state[action.payload.setId],
					songs: action.payload.songs
				}
			}
			return newState
		}
	},
	initialState.byId
)

export const sets = combineReducers({
	byId
})
