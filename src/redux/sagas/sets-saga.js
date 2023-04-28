import { call, put, select, takeEvery } from 'redux-saga/effects'
import { eventChannel } from 'redux-saga'
import slugify from 'slugify'
import { parseISO } from 'date-fns'
import map from 'lodash/fp/map'
import pick from 'lodash/fp/pick'
import filter from 'lodash/fp/filter'
import { db } from '../../firebase'
import {
	collection,
	deleteDoc,
	doc,
	onSnapshot,
	setDoc,
	updateDoc,
} from 'firebase/firestore'
import {
	ADD_SET,
	REMOVE_SET,
	REMOVE_SET_SONG,
	UPDATE_SET,
	mergeSets,
	removeSet,
	setSetSongs,
} from '../actions'

const setsCollection = collection(db, 'sets')

const setsChannel = () =>
	eventChannel(emitter => {
		onSnapshot(setsCollection, querySnapshot => {
			const sets = []
			querySnapshot.forEach(snapshot => {
				const data = snapshot.data()
				if (data.setDate) {
					if (typeof data.setDate === 'object') {
						data.setDate = new Date(data.setDate.seconds * 1000)
					} else {
						data.setDate = parseISO(data.setDate)
					}
				}
				sets.push({ id: snapshot.id, ...data })
			})
			emitter(sets)
		})
		return () => {}
	})

export function* setsSaga() {
	const setsChan = yield call(setsChannel)
	yield takeEvery(setsChan, handleSetsEvent)
	yield takeEvery(ADD_SET, handleAddSet)
	yield takeEvery(REMOVE_SET, handleRemoveSet)
	yield takeEvery(REMOVE_SET_SONG, handleRemoveSetSong)
	yield takeEvery(UPDATE_SET, handleUpdateSet)
}

function* handleAddSet({ payload: newSet }) {
	const state = yield select()
	newSet.author = newSet.author || state.user.name
	newSet.slug = slugify(newSet.title)
	newSet.songs = newSet.songs || []

	const set = yield setDoc(setsCollection, newSet)
	yield put(
		mergeSets([
			{
				...newSet,
				id: set.id,
			},
		])
	)
}

function* handleRemoveSet({ payload: setId }) {
	yield deleteDoc(doc(setsCollection, setId))
	yield put(removeSet(setId))
}

function* handleRemoveSetSong({ payload }) {
	const state = yield select()
	const set = state.sets.byId[payload.setId]
	const songs = filter(s => s.id !== payload.songId)(set.songs)
	set.songs = songs
	yield put(setSetSongs(payload.setId, songs))
	yield updateDoc(doc(setsCollection, payload.setId), { songs })
}

function* handleUpdateSet({ payload: set }) {
	if (set.title) {
		set.slug = slugify(set.title)
	}
	/* JL 30 Jun 2019: I've removed all the extra fields in 5 of the sets data manually via firebase
	if (set.date) {
		console.log('sets saga handleUpdateSet saving setDate as', set.date)
		set.setDate = set.date
	}
	*/

	yield put(mergeSets([set]))

	if (set.songs) {
		const setSongs = []
		for (let i = 0; i < set.songs.length; i++) {
			const song = set.songs[i]
			setSongs.push({
				id: song.id,
				key: song.key,
			})
		}

		set.songs = setSongs
	}

	console.log('set', set)

	yield updateDoc(doc(setsCollection, set.id), set)
}

function* handleSetsEvent(sets) {
	const formattedSets = map(set => {
		set.songs = map(song => pick(['id', 'key'])(song))(set.songs)
		return set
	})(sets)
	yield put(mergeSets(formattedSets))
}
