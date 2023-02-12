import { put, select, takeEvery } from 'redux-saga/effects'
//import { eventChannel } from 'redux-saga'
import { db } from '../../firebase'
import {
	SET_CURRENT_SONG_ID,
	SET_CURRENT_SONG_USER_KEY,
	setCurrentSong,
	//setSong
} from '../actions'

const songsCollection = db.collection('songs')

export function* currentSongSaga() {
	yield takeEvery(SET_CURRENT_SONG_ID, updateCurrentSongById)
	yield takeEvery(SET_CURRENT_SONG_USER_KEY, updateUserKeyForCurrentSong)
}

function* updateCurrentSongById({ payload }) {
	const doc = yield songsCollection.doc(payload.id).get()
	if (doc.exists) {
		yield put(
			setCurrentSong({
				id: doc.id,
				...doc.data(),
			})
		)
	} else {
		console.error('Document does not exist')
	}
}

function* updateUserKeyForCurrentSong({ key }) {
	const { currentSong, user: currentUser } = yield select()
	currentSong.users = currentSong.users || []

	const users = [...currentSong.users].filter(u => typeof u === 'object')
	const user = users.find(u => u.id === currentUser.id)
	if (user) {
		user.key = key

		if (key === null) {
			users.splice(users.indexOf(user), 1)
		}
	} else {
		users.push({ id: currentUser.id, key })
	}

	yield put(setCurrentSong({ users }))

	//const song = yield songsCollection.doc(currentSong.id).get()
	//song.users = users
	//yield db.put(song)
}
