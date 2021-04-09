import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import * as Sentry from '@sentry/react'

import * as serviceWorker from './serviceWorker'
import App from './App'
import configureStore from './redux/configureStore'

const store = configureStore()

if (process.env.NODE_ENV === 'production') {
	const state = store.getState()
	Sentry.init({
		dsn:
			'https://2c14c1a4ae774cdd9c80545e7a34c2e7@o55905.ingest.sentry.io/1246393',
	})

	Sentry.configureScope(scope => {
		scope.setUser({
			id: state.user.id,
			username: state.user.name,
		})
	})
}

ReactDOM.render(
	<Provider store={store}>
		<Router>
			<App />
		</Router>
	</Provider>,
	document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register()
