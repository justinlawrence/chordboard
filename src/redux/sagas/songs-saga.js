import { call, put, takeEvery } from 'redux-saga/effects'
import { eventChannel } from 'redux-saga'
import slugify from 'slugify'

import { db } from '../../firebase'
import { ADD_SONG, DELETE_SONG, UPDATE_SONG, mergeSongs } from '../actions'

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
	yield takeEvery(songsChan, handleSongsEvent)
	yield takeEvery(ADD_SONG, handleAddSong)
	yield takeEvery(DELETE_SONG, handleDeleteSong)
	yield takeEvery(UPDATE_SONG, handleUpdateSong)
}

function* handleAddSong({ payload: newSong }) {
	newSong.slug = slugify(newSong.title)

	const song = yield songsCollection.add(newSong)
	yield put(
		mergeSongs([
			{
				id: song.id,
				...song.data()
			}
		])
	)
}

function* handleDeleteSong({ payload }) {
	yield songsCollection.doc(payload).delete()
}

function* handleUpdateSong({ payload }) {
	const { songId, partial } = payload
	yield songsCollection.doc(songId).update(partial)
	yield put(
		mergeSongs([
			{
				id: songId,
				...partial
			}
		])
	)
}

function* handleSongsEvent(songs) {
	yield put(mergeSongs(songs))
}
