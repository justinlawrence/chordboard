import { applyMiddleware, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
//import { routerMiddleware } from 'react-router-redux'
//import { persistentStore } from 'redux-pouchdb'
//import PouchDB from 'pouchdb'
import createSagaMiddleware from 'redux-saga'

//import { setSyncState } from './actions'
import { initSagas } from './init-sagas'
import rootReducer from './reducers'
import history from '../history'
import { CHANGE_ROUTE } from './actions'

//const syncEvents = ['active', 'change', 'complete', 'denied', 'error', 'paused']

const configureStore = () => {
	/*const remoteDbSettings = {
		adapter: 'http',
		auth: {
			username: 'justinlawrence',
			password: 'cXcmbbLFO8'
		}
	}*/

	/*if ( process.env.REMOTE_DB_USERNAME && process.env.REMOTE_DB_PASSWORD ) {
		remoteDbSettings.auth = {
			username: process.env.REMOTE_DB_USERNAME,
			password: process.env.REMOTE_DB_PASSWORD
		}
	}*/

	/*const localDB = new PouchDB('chordboard')
	const remoteDB = new PouchDB(
		'https://couchdb.cloudno.de/chordboard',
		remoteDbSettings
	)

	const sync = localDB.sync(remoteDB, {
		live: true,
		retry: true,
	})*/
	const sagaMiddleware = createSagaMiddleware()
	const changeRouteMiddleware = () => next => action => {
		if (action.type === CHANGE_ROUTE) {
			history.push(action.payload)
		}
		return next(action)
	}
	const middlewareChain = [sagaMiddleware, changeRouteMiddleware]
	const store = createStore(
		rootReducer,
		composeWithDevTools(
			applyMiddleware(...middlewareChain)
			//persistentStore( localDB )
		)
	)
	initSagas(sagaMiddleware)

	/*syncEvents.forEach(syncEvent => {
		sync.on(syncEvent, () => {
			store.dispatch(setSyncState(syncEvent))
		})
	})*/

	if (module.hot) {
		// Enable Webpack hot module replacement for reducers
		module.hot.accept('./reducers', () => {
			const nextReducer = require('./reducers')
			store.replaceReducer(nextReducer)
		})
	}

	return store
}

export default configureStore
