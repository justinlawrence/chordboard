import { call, put, select, take, takeEvery } from 'redux-saga/effects'
import { eventChannel } from 'redux-saga'
import map from 'lodash/fp/map'
import pick from 'lodash/fp/pick'

import { db } from '../../firebase'
import { mergeSets } from '../actions'

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
}

function* handleSetsEvent(sets) {
	const formattedSets = map(set => {
		set.songs = map(song => pick(['id', 'key'])(song))(set.songs)
		return set
	})(sets)
	yield put(mergeSets(formattedSets))
}
