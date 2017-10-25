import {composeWithDevTools} from 'redux-devtools-extension';
import {createStore} from 'redux';
import {persistentStore} from 'redux-pouchdb';
import PouchDB from 'pouchdb';

import * as types from './constants/action-types.js'
import rootReducer from './reducers'

const syncEvents = [
	'active',
	'change',
	'complete',
	'denied',
	'error',
	'paused'
];

const initialState = {};

const configureStore = () => {

	const remoteDbSettings = {
		adapter: 'http',
		auth:    {
			username: 'justinlawrence',
			password: 'cXcmbbLFO8'
		}
	};

	/*if ( process.env.REMOTE_DB_USERNAME && process.env.REMOTE_DB_PASSWORD ) {
		remoteDbSettings.auth = {
			username: process.env.REMOTE_DB_USERNAME,
			password: process.env.REMOTE_DB_PASSWORD
		}
	}*/

	const localDB = new PouchDB( 'chordboard' );
	const remoteDB = new PouchDB( 'https://couchdb.cloudno.de/chordboard', remoteDbSettings );

	const sync = localDB.sync( remoteDB, {
		live:  true,
		retry: true
	} );
	const store = createStore( rootReducer, initialState, composeWithDevTools(
		persistentStore( localDB )
	) );

	syncEvents.forEach( syncEvent => {

		sync.on( syncEvent, () => {

			store.dispatch( { type: types.SET_SYNC_STATE, text: syncEvent } );

		} );

	} );

	if ( module.hot ) {

		// Enable Webpack hot module replacement for reducers
		module.hot.accept( './reducers', () => {

			const nextReducer = require( './reducers' );
			store.replaceReducer( nextReducer );

		} );

	}

	return store;

};

export default configureStore;