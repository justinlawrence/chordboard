import React from 'react'
import ReactDOM from 'react-dom'
import { Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import * as Sentry from '@sentry/browser'
import DateFnsUtils from '@date-io/date-fns'
import { MuiPickersUtilsProvider } from 'material-ui-pickers'

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'

import * as serviceWorker from './serviceWorker'
import App from './App'
import history from './history'
import configureStore from './redux/configureStore'
import defaultTheme from './themes/default-theme'

const store = configureStore()

if (process.env.NODE_ENV === 'production') {
	window.Sentry = Sentry
	const state = store.getState()
	Sentry.init({
		dsn: 'https://2c14c1a4ae774cdd9c80545e7a34c2e7@sentry.io/1246393'
	})
	Sentry.configureScope(scope => {
		scope.setUser({
			id: state.user.id,
			username: state.user.name
		})
	})
}

const theme = createMuiTheme(defaultTheme)

ReactDOM.render(
	<Provider store={store}>
		<Router history={history}>
			<MuiThemeProvider theme={theme}>
				<MuiPickersUtilsProvider utils={DateFnsUtils}>
					<App />
				</MuiPickersUtilsProvider>
			</MuiThemeProvider>
		</Router>
	</Provider>,
	document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register()
