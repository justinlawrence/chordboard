import { call, put, select, take, takeEvery } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga'

import { db } from '../firebase';
import {
	FETCH_SONGS_REQUEST,
	fetchSongsSuccess
} from 'actions'

const songsCollection = db.collection( 'songs' );

//const songsChannel = type => eventChannel( emit => {
	//sync.on( type, emit );
	// db.collection( 'songs' ).onSnapshot( querySnapshot => {
	// 	querySnapshot.forEach(doc => {
	// 		//const timestamp = doc.get('created_at');
	// 		//const date = timestamp.toDate();
	// 		console.log(doc.data());
	// 	});
	// })
	//return () => {};
//} );

export function* songsSaga() {
	yield takeEvery( FETCH_SONGS_REQUEST, fetchSongs );
}

function* fetchSongs(  ) {

	const querySnapshot = yield songsCollection.get();

	const songs = [];
    querySnapshot.forEach((doc) => {
        songs.push(doc.data());
    });

	yield put( fetchSongsSuccess( songs ) );
}
