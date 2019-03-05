import { put, select, takeLatest } from 'redux-saga/effects'
import findIndex from 'lodash/findIndex'

//import { db } from '../../firebase'
import {
	GO_TO_NEXT_SONG,
	GO_TO_PREVIOUS_SONG,
	changeRoute,
	setCurrentSongId
} from '../actions'

//const songsCollection = db.collection('songs')

export function* liveBarSaga() {
	yield takeLatest(GO_TO_NEXT_SONG, handleGoToNextSong)
	yield takeLatest(GO_TO_PREVIOUS_SONG, handleGoToPreviousSong)
}

function* handleGoToNextSong() {
	const state = yield select()
	const currentSet = state.sets.byId[state.currentSet.id]
	const currentSong = state.songs.byId[state.currentSong.id]
	if (currentSet) {
		const index = findIndex(currentSet.songs, { id: currentSong.id })
		const nextSong = currentSet.songs[index + 1]
		if (nextSong) {
			yield put(setCurrentSongId(nextSong.id))
			yield put(changeRoute(`/sets/${currentSet.id}/songs/${nextSong.id}`))
		} else {
			console.log('no next song')
		}
	}
}

function* handleGoToPreviousSong() {
	const state = yield select()
	const currentSet = state.sets.byId[state.currentSet.id]
	const currentSong = state.songs.byId[state.currentSong.id]
	const index = findIndex(currentSet.songs, { id: currentSong.id })
	const prevSong = currentSet.songs[index - 1]
	if (prevSong) {
		yield put(setCurrentSongId(prevSong.id))
		yield put(changeRoute(`/sets/${currentSet.id}/songs/${prevSong.id}`))
	} else {
		console.log('no previous song')
	}
}
