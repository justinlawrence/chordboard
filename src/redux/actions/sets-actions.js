import { createActions } from 'redux-actions'

export const ADD_SET = 'ADD_SET'
export const MERGE_SETS = 'MERGE_SETS'
export const REMOVE_SET = 'REMOVE_SET'
export const REMOVE_SET_SONG = 'REMOVE_SET_SONG'
export const SET_SET_SONGS = 'SET_SET_SONGS'
export const UPDATE_SET = 'UPDATE_SET'

export const {
	addSet,
	mergeSets,
	removeSet,
	removeSetSong,
	setSetSongs,
	updateSet
} = createActions(
	{
		REMOVE_SET_SONG: (setId, songId) => ({ setId, songId }),
		SET_SET_SONGS: (setId, songs) => ({ setId, songs })
	},
	ADD_SET,
	REMOVE_SET,
	MERGE_SETS,
	UPDATE_SET
)
