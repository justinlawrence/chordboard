import { put, select, takeLatest } from 'redux-saga/effects'
import first from 'lodash/first'
import findIndex from 'lodash/findIndex'
import last from 'lodash/last'

//import { db } from '../../firebase'
import {
	GO_TO_NEXT_SONG,
	GO_TO_PREVIOUS_SONG,
	changeRoute,
	setCurrentSongId,
} from '../actions'

export function* liveBarSaga() {
	yield takeLatest(GO_TO_NEXT_SONG, handleGoToNextSong)
	yield takeLatest(GO_TO_PREVIOUS_SONG, handleGoToPreviousSong)
}

function* handleGoToNextSong() {
	const state = yield select()
	const currentSet = state.sets.byId[state.currentSet.id]
	const currentSongId = state.currentSong.id
		? state.currentSong.id
		: first(currentSet.songs).id
	const currentSong = state.songs.byId[currentSongId]
	if (currentSet) {
		const index = findIndex(currentSet.songs, { id: currentSong.id })
		const nextSong = currentSet.songs[index + 1]
		if (nextSong) {
			yield put(setCurrentSongId(nextSong.id))
			yield put(
				changeRoute(`/sets/${currentSet.id}/songs/${nextSong.id}`)
			)
		} else {
			console.log('no next song')
		}
	}
}

function* handleGoToPreviousSong() {
	const state = yield select()
	const currentSet = state.sets.byId[state.currentSet.id]
	const currentSongId = state.currentSong.id
		? state.currentSong.id
		: last(currentSet.songs).id
	const currentSong = state.songs.byId[currentSongId]
	const index = findIndex(currentSet.songs, { id: currentSong.id })
	const prevSong = currentSet.songs[index - 1]
	if (prevSong) {
		yield put(setCurrentSongId(prevSong.id))
		yield put(changeRoute(`/sets/${currentSet.id}/songs/${prevSong.id}`))
	} else {
		console.log('no previous song')
	}
}
