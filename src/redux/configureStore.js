import { applyMiddleware, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import createSagaMiddleware from 'redux-saga'

import { initSagas } from './init-sagas'
import rootReducer from './reducers'
import history from '../history'
import { CHANGE_ROUTE } from './actions'

const configureStore = () => {
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
		composeWithDevTools(applyMiddleware(...middlewareChain))
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
