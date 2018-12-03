import { put, select, takeLatest } from 'redux-saga/effects'

import { db } from '../firebase'
import {
	FETCH_CURRENT_SET,
	SET_CURRENT_SET_SONG_KEY,
	setCurrentSet,
	setCurrentSong
} from '../actions'

const setsCollection = db.collection('sets')

export function* currentSetSaga() {
	yield takeLatest(FETCH_CURRENT_SET, handleFetchSet)
	//yield takeLatest( SET_CURRENT_SET_SONG_KEY, updateCurrentSetKey );
}

function* handleFetchSet({ setId }) {
	try {
		const setQuery = yield setsCollection.doc(setId).get()
		const set = {
			id: setQuery.id,
			...setQuery.data()
		}

		for (let i = 0; i < set.songs.length; i++) {
			const ref = set.songs[i].ref
			const songQuery = yield ref.get()
			set.songs[i] = {
				id: songQuery.id,
				...songQuery.data(),
				// Override song keys with values from the set.
				key: set.songs[i].key
			}
		}

		yield put(setCurrentSet(set))
	} catch (e) {
		console.error('currentSetSaga', e)
	}
}

function* updateCurrentSetKey({ payload }) {
	const { currentSet } = yield select()
	const key = payload.key
	const song = payload.song

	const songs = [...currentSet.songs].filter(u => typeof u === 'object')
	const setSong = songs.find(s => s._id === song._id)

	songs.splice(songs.indexOf(setSong), 1, {
		...setSong,
		key
	})

	yield put(setCurrentSet({ ...currentSet, songs }))

	const set = yield db.get(currentSet._id)
	set.songs = songs
	yield db.put(set)
}
