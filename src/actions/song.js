export const ADD_SONG = 'ADD_SONG'
export const EDIT_SONG = 'EDIT_SONG'
export const REMOVE_SONG = 'REMOVE_SONG'
export const SET_CURRENT_SONG = 'SET_CURRENT_SONG'

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