import { combineReducers } from 'redux'

import { currentSet } from './current-set'
import { currentSong } from './current-song'
import { liveBar } from './live-bar'
import { sets } from './sets-reducer'
import { songs } from './songs'
import { theme } from './theme'
import { user } from './user'

const reducer = combineReducers({
	currentSet,
	currentSong,
	liveBar,
	sets,
	songs,
	theme,
	user
})

export default reducer
