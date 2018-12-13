import { call, put, select, takeEvery } from 'redux-saga/effects'
import { eventChannel } from 'redux-saga'
import slugify from 'slugify'
import map from 'lodash/fp/map'
import pick from 'lodash/fp/pick'

import { db } from '../../firebase'
import { ADD_SET, mergeSets } from '../actions'

const setsCollection = db.collection('sets')

const setsChannel = () =>
	eventChannel(emitter => {
		setsCollection.onSnapshot(querySnapshot => {
			const sets = []
			querySnapshot.forEach(doc => {
				sets.push({ id: doc.id, ...doc.data() })
			})
			emitter(sets)
		})
		return () => {}
	})

export function* setsSaga() {
	const setsChan = yield call(setsChannel)
	yield takeEvery(setsChan, handleSetsEvent)
	yield takeEvery(ADD_SET, handleAddSet)
}

function* handleAddSet({ payload: newSet }) {
	const state = yield select()
	newSet.author = state.user.name
	newSet.slug = slugify(newSet.title)
	newSet.songs = newSet.songs || []

	const set = yield setsCollection.add(newSet)
	yield put(
		mergeSets([
			{
				...newSet,
				id: set.id
			}
		])
	)
}

function* handleSetsEvent(sets) {
	const formattedSets = map(set => {
		set.songs = map(song => pick(['id', 'key'])(song))(set.songs)
		return set
	})(sets)
	yield put(mergeSets(formattedSets))
}
