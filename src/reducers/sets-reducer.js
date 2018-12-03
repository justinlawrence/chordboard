import { combineReducers } from 'redux'
import { handleActions } from 'redux-actions'
import merge from 'lodash/fp/merge'
import reduce from 'lodash/fp/reduce'

import { MERGE_SETS } from '../actions/sets-actions'
import { mergeSets } from '../actions/sets-actions'

const initialState = {
	byId: {},
}

const byId = handleActions(
	{
		MERGE_SETS: (state, action) =>
			reduce((acc, set) => {
				acc[set.id] = acc[set.id] ? merge(acc[set.id])(set)({}) : set
				return acc
			})({ ...state })(action.payload),
	},
	initialState.byId
)

export const sets = combineReducers({
	byId,
})
