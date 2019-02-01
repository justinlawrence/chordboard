import { createActions } from 'redux-actions'

export const GO_TO_NEXT_SONG = 'GO_TO_NEXT_SONG'
export const GO_TO_PREVIOUS_SONG = 'GO_TO_PREVIOUS_SONG'

export const { goToNextSong, goToPreviousSong } = createActions(
	{},
	GO_TO_NEXT_SONG,
	GO_TO_PREVIOUS_SONG
)
