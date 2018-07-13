export const FETCH_CURRENT_SET = 'FETCH_CURRENT_SET'
export const SET_CURRENT_SET = 'SET_CURRENT_SET'
export const SET_CURRENT_SET_SONG_KEY = 'SET_CURRENT_SET_SONG_KEY'

export const fetchCurrentSet = setId => ({
	type: FETCH_CURRENT_SET,
	setId
})

export const setCurrentSet = set => ({
	type: SET_CURRENT_SET,
	set
})

export const setCurrentSetSongKey = payload => ({
	type: SET_CURRENT_SET_SONG_KEY,
	payload
})