export const FETCH_CURRENT_SET = 'FETCH_CURRENT_SET'
export const SET_CURRENT_SET = 'SET_CURRENT_SET'

export const fetchCurrentSet = setId => ({
	type: FETCH_CURRENT_SET,
	setId
})

export const setCurrentSet = set => ({
	type: SET_CURRENT_SET,
	set
})
