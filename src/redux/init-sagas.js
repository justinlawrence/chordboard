import * as sagas from './sagas'

export const initSagas = sagaMiddleware => {
	Object.keys(sagas)
		.map(key => sagas[key])
		.forEach(sagaMiddleware.run.bind(sagaMiddleware))
}
