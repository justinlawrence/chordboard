import { createActions } from 'redux-actions'

export const CHANGE_ROUTE = 'CHANGE_ROUTE'
export const GO_TO_NEXT_SONG = 'GO_TO_NEXT_SONG'
export const GO_TO_PREVIOUS_SONG = 'GO_TO_PREVIOUS_SONG'

export const { changeRoute, goToNextSong, goToPreviousSong } = createActions(
	{},
	CHANGE_ROUTE,
	GO_TO_NEXT_SONG,
	GO_TO_PREVIOUS_SONG
)
