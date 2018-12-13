import { combineReducers } from 'redux'
import { handleActions } from 'redux-actions'
import isEqual from 'lodash/fp/isEqual'
import merge from 'lodash/fp/merge'
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
						acc[set.id] = merge({}, acc[set.id])(set)
					}
				} else {
					acc[set.id] = set
				}
				return acc
			})({ ...state })(action.payload)
	},
	initialState.byId
)

export const sets = combineReducers({
	byId
})
