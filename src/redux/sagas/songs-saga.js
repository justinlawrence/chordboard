import { call, put, select, take, takeEvery } from 'redux-saga/effects'
import { eventChannel } from 'redux-saga'

import { db } from '../../firebase'
import { FETCH_SONGS_REQUEST, fetchSongsSuccess, mergeSongs } from '../actions'

const songsCollection = db.collection('songs')

const songsChannel = () =>
	eventChannel(emitter => {
		songsCollection.onSnapshot(querySnapshot => {
			const songs = []
			querySnapshot.forEach(doc => {
				songs.push({ id: doc.id, ...doc.data() })
			})
			emitter(songs)
		})
		return () => {}
	})

export function* songsSaga() {
	const songsChan = yield call(songsChannel)
	//yield takeEvery( FETCH_SONGS_REQUEST, fetchSongs );
	yield takeEvery(songsChan, handleSongsEvent)
}

function* fetchSongs() {
	const querySnapshot = yield songsCollection.get()

	const songs = []
	querySnapshot.forEach(doc => {
		songs.push(doc.data())
	})

	yield put(fetchSongsSuccess(songs))
}

function* handleSongsEvent(songs) {
	yield put(mergeSongs(songs))
}
