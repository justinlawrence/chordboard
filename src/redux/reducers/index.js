import { combineReducers } from 'redux'

import { currentSet } from './current-set'
import { currentSong } from './current-song'
import { sets } from './sets-reducer'
import { song } from './songs'
import { user } from './user'

const reducer = combineReducers({
	currentSet,
	currentSong,
	sets,
	song,
	user
})

export default reducer
