import { combineReducers } from 'redux'
import { handleActions } from 'redux-actions'
import { createSelector } from 'reselect'
import isEqual from 'lodash/isEqual'
import map from 'lodash/map'
import merge from 'lodash/merge'
import omit from 'lodash/omit'
import reduce from 'lodash/reduce'

const initialState = {
	byId: {},
}

const byId = handleActions(
	{
		MERGE_SETS: (state, action) =>
			reduce(
				action.payload,
				(acc, set) => {
					if (acc[set.id]) {
						if (!isEqual(set, acc[set.id])) {
							acc[set.id] = reduce([acc[set.id], set], merge, {})
						}
					} else {
						acc[set.id] = set
					}
					return acc
				},
				{ ...state }
			),
		REMOVE_SET: (state, action) => omit({ ...state }, action.payload),
		SET_SET_SONGS: (state, action) => {
			const newState = {
				...state,
				[action.payload.setId]: {
					...state[action.payload.setId],
					songs: action.payload.songs,
				},
			}
			return newState
		},
	},
	initialState.byId
)

export const sets = combineReducers({
	byId,
})

const getSetId = (state, props) => props.setId
const setsById = state => state.sets.byId
const setSelector = createSelector(
	[getSetId, setsById],
	(setId, byId) => byId[setId]
)

export const getSets = createSelector([setsById], byId => map(byId, set => set))
export const makeGetSet = () => setSelector
