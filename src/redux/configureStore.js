import * as Sentry from '@sentry/react'
import { applyMiddleware, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import createSagaMiddleware from 'redux-saga'

import { initSagas } from './init-sagas'
import rootReducer from './reducers'

const configureStore = () => {
	const sagaMiddleware = createSagaMiddleware()
	const sentryReduxEnhancer = Sentry.createReduxEnhancer({})

	const middlewareChain = [sagaMiddleware]
	const store = createStore(
		rootReducer,
		composeWithDevTools(
			applyMiddleware(...middlewareChain),
			sentryReduxEnhancer
		)
	)
	initSagas(sagaMiddleware)

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
