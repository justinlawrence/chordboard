import { put, takeLatest } from 'redux-saga/effects';

import { db } from 'database';
import {
	FETCH_CURRENT_SET,
	setCurrentSet
} from 'actions'

export function* currentSetSaga() {
	yield takeLatest( FETCH_CURRENT_SET, handleFetchSet )
}

function* handleFetchSet( { setId } ) {
	const set = yield db.get( setId );
	const keys = set.songs.map( song => song._id );
	const { rows } = yield db.allDocs( { include_docs: true, keys } );
	// Override song keys with values from the set.
	set.songs = rows.map( ( row, index ) => ({
		...row.doc,
		...set.songs[ index ]
	}) ).filter( song => !!song );
	yield put( setCurrentSet( set ) );
}