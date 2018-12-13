import { createActions } from 'redux-actions'

export const ADD_SET = 'ADD_SET'
export const MERGE_SETS = 'MERGE_SETS'

export const { addSet, mergeSets } = createActions({}, ADD_SET, MERGE_SETS)
