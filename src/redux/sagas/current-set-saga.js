import { put, select, takeLatest } from 'redux-saga/effects'

import { db } from '../../firebase'
import {
	FETCH_CURRENT_SET,
	SET_CURRENT_SET_ID,
	SET_CURRENT_SET_SONG_KEY,
	changeRoute,
	setCurrentSetId,
	updateSet
} from '../actions'

const setsCollection = db.collection('sets')

export function* currentSetSaga() {
	yield takeLatest(FETCH_CURRENT_SET, handleFetchSet)
	yield takeLatest(SET_CURRENT_SET_ID, updateCurrentSetId)
	yield takeLatest(SET_CURRENT_SET_SONG_KEY, updateCurrentSetKey)
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
			try {
				const songQuery = yield ref.get()
				set.songs[i] = {
					id: songQuery.id,
					...songQuery.data(),
					// Override song keys with values from the set.
					key: set.songs[i].key
				}
			} catch (err) {
				console.warn('Song doesn\'t have a ref', set.songs[i])
			}
		}

		yield put(setCurrentSetId(set.id))
		yield put(updateSet(set))
	} catch (e) {
		console.error('currentSetSaga', e)
	}
}

function* updateCurrentSetId({ payload }) {
	if (payload === null) {
		yield put(changeRoute('/sets'))
	}
}

function* updateCurrentSetKey({ payload }) {
	const state = yield select()
	const currentSet = state.sets.byId[state.currentSet.id]
	const key = payload.key
	const song = payload.song

	const songs = [...currentSet.songs].filter(u => typeof u === 'object')
	const setSong = songs.find(s => s.id === song.id)

	songs.splice(songs.indexOf(setSong), 1, {
		...setSong,
		key
	})

	yield put(setCurrentSetId(currentSet.id))
	yield put(updateSet({ ...currentSet, songs }))
}
