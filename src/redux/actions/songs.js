import { createActions } from 'redux-actions'

export const ADD_SONG = 'ADD_SONG'
export const DELETE_SONG = 'DELETE_SONG'
export const EDIT_SONG = 'EDIT_SONG'
export const MERGE_SONGS = 'MERGE_SONGS'
export const REMOVE_SONG = 'REMOVE_SONG'
export const SET_CURRENT_SONG = 'SET_CURRENT_SONG'
export const SET_CURRENT_SONG_ID = 'SET_CURRENT_SONG_ID'
export const SET_CURRENT_SONG_USER_KEY = 'SET_CURRENT_SONG_USER_KEY'
export const SET_SONG = 'SET_SONG'
export const UPDATE_SONG = 'UPDATE_SONG'

export const { addSong, deleteSong, updateSong } = createActions(
	{
		ADD_SONG: ({ author, content, key, title }) => ({
			author,
			content,
			key,
			title
		}),
		UPDATE_SONG: (songId, partial) => ({
			songId,
			partial
		})
	},
	DELETE_SONG
)

export const mergeSongs = songs => ({
	type: MERGE_SONGS,
	payload: { songs }
})

export const setCurrentSongId = id => ({
	type: SET_CURRENT_SONG_ID,
	payload: { id }
})

export const setCurrentSong = song => ({
	type: SET_CURRENT_SONG,
	song
})

export const setCurrentSongUserKey = key => ({
	type: SET_CURRENT_SONG_USER_KEY,
	key
})

export const setSong = song => ({
	type: SET_SONG,
	payload: { song }
})
