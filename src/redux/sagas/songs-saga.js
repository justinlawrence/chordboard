import { call, put, takeEvery } from 'redux-saga/effects'
import { eventChannel } from 'redux-saga'
import slugify from 'slugify'
import {
	collection,
	deleteDoc,
	doc,
	getDoc,
	onSnapshot,
	setDoc,
	updateDoc,
} from 'firebase/firestore'

import { db } from '../../firebase'
import {
	ADD_SONG,
	DELETE_SONG,
	FETCH_SONG,
	UPDATE_SONG,
	mergeSongs,
} from '../actions'

const songsCollection = collection(db, 'songs')

const songsChannel = () =>
	eventChannel(emitter => {
		return onSnapshot(songsCollection, querySnapshot => {
			const songs = []
			querySnapshot.forEach(doc => {
				songs.push({ id: doc.id, ...doc.data() })
			})
			emitter(songs)
		})
	})

export function* songsSaga() {
	//comment these out to test lazy loading
	const songsChan = yield call(songsChannel)
	yield takeEvery(songsChan, handleSongsEvent)
	//end

	yield takeEvery(ADD_SONG, handleAddSong)
	yield takeEvery(DELETE_SONG, handleDeleteSong)
	yield takeEvery(FETCH_SONG, handleFetchSong)
	yield takeEvery(UPDATE_SONG, handleUpdateSong)
}

function* handleAddSong({ payload: newSong }) {
	newSong.slug = slugify(newSong.title)

	const song = yield setDoc(songsCollection, newSong)
	yield put(
		mergeSongs([
			{
				...newSong,
				id: song.id,
			},
		])
	)
}

function* handleDeleteSong({ payload }) {
	yield deleteDoc(doc(songsCollection, payload))
}

function* handleFetchSong({ payload: songId }) {
	const song = yield getDoc(doc(songsCollection, songId))
	const songs = [
		{
			id: songId,
			...song.data(),
		},
	]
	yield put(mergeSongs(songs))
}

function* handleUpdateSong({ payload }) {
	const { songId, partial } = payload
	yield updateDoc(doc(songsCollection, songId), partial)
	yield put(
		mergeSongs([
			{
				id: songId,
				...partial,
			},
		])
	)
}

function* handleSongsEvent(songs) {
	yield put(mergeSongs(songs))
}
