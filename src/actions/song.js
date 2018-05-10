export const ADD_SONG = 'ADD_SONG'
export const EDIT_SONG = 'EDIT_SONG'
export const REMOVE_SONG = 'REMOVE_SONG'
export const SET_CURRENT_SONG = 'SET_CURRENT_SONG'
export const SET_CURRENT_SONG_USER_KEY = 'SET_CURRENT_SONG_USER_KEY'
export const SET_SONG = 'SET_SONG'

export const addSong = ( { author, content, key, title } ) => ({
	type: ADD_SONG,
	author,
	content,
	key,
	title
});

export const setCurrentSong = song => ({
	type: SET_CURRENT_SONG,
	song
});

export const setCurrentSongUserKey = key => ({
	type: SET_CURRENT_SONG_USER_KEY,
	key
});

export const setSong = song => ({
	type: SET_SONG,
	song
});