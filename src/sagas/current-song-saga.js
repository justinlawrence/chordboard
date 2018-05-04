import { put, select, takeEvery } from 'redux-saga/effects';

import { db } from 'database';
import {
	SET_CURRENT_SONG_USER_KEY,
	setCurrentSong
} from 'actions'

export function* currentSongSaga() {
	yield takeEvery( SET_CURRENT_SONG_USER_KEY, updateCurrentSongUserKey );
}

function* updateCurrentSongUserKey( { key } ) {
	const { currentSong, user: currentUser } = yield select();

	const users = [ ...currentSong.users ].filter( u => typeof u === 'object' );
	const user = users.find( u => u.id === currentUser.id )
	if ( user ) {
		user.key = key;
	} else {
		users.push( { id: currentUser.id, key } );
	}

	yield put( setCurrentSong( { users } ) );

	const song = yield db.get( currentSong._id );
	song.users = users;
	yield db.put( song );

}