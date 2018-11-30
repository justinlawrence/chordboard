import { put, select, takeLatest } from 'redux-saga/effects';

import { db } from '../database';
import {
	FETCH_CURRENT_SET,
	SET_CURRENT_SET_SONG_KEY,
	setCurrentSet,
	setCurrentSong
} from '../actions'

export function* currentSetSaga() {
	//yield takeLatest( FETCH_CURRENT_SET, handleFetchSet )
	//yield takeLatest( SET_CURRENT_SET_SONG_KEY, updateCurrentSetKey );
}

function* handleFetchSet( { setId } ) {
	try {
		const set = yield db.get( setId );
		const keys = set.songs.map( song => song._id );
		const { rows } = yield db.allDocs( { include_docs: true, keys } );
		// Override song keys with values from the set.
		set.songs = rows.map( ( row, index ) => ( {
			...row.doc,
			...set.songs[ index ]
		} ) ).filter( song => !!song );
		yield put( setCurrentSet( set ) );
	} catch ( e ) {
		console.error( 'currentSetSaga', e );
	}
}

function* updateCurrentSetKey( { payload } ) {
	const { currentSet } = yield select();
	const key = payload.key;
	const song = payload.song;

	const songs = [ ...currentSet.songs ].filter( u => typeof u === 'object' );
	const setSong = songs.find( s => s._id === song._id );

	songs.splice( songs.indexOf( setSong ), 1, {
		...setSong,
		key
	} );

	yield put( setCurrentSet( { ...currentSet, songs } ) );

	const set = yield db.get( currentSet._id );
	set.songs = songs;
	yield db.put( set );
}
