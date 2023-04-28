import { put, select, takeEvery } from 'redux-saga/effects'
//import { eventChannel } from 'redux-saga'
import { collection, doc, getDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import {
	SET_CURRENT_SONG_ID,
	SET_CURRENT_SONG_USER_KEY,
	setCurrentSong,
	//setSong
} from '../actions'

const songsCollection = collection(db, 'songs')

export function* currentSongSaga() {
	yield takeEvery(SET_CURRENT_SONG_ID, updateCurrentSongById)
	yield takeEvery(SET_CURRENT_SONG_USER_KEY, updateUserKeyForCurrentSong)
}

function* updateCurrentSongById({ payload }) {
	const songDoc = yield getDoc(doc(songsCollection, payload.id))
	if (songDoc.exists) {
		yield put(
			setCurrentSong({
				id: songDoc.id,
				...songDoc.data(),
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

	//const song = yield getDoc(doc(songsCollection, currentSong.id))
	//song.users = users
	//yield db.put(song)
}
