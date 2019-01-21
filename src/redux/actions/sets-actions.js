import { createActions } from 'redux-actions'

export const ADD_SET = 'ADD_SET'
export const MERGE_SETS = 'MERGE_SETS'
export const REMOVE_SET = 'REMOVE_SET'
export const UPDATE_SET = 'UPDATE_SET'

export const { addSet, mergeSets, removeSet, updateSet } = createActions(
	{},
	ADD_SET,
	REMOVE_SET,
	MERGE_SETS,
	UPDATE_SET
)
