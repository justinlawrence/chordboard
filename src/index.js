import './bootstrap'

import React from 'react';
import RenderDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import firebase from 'firebase';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import defaultTheme from './themes/default-theme.js';
import configureStore from 'configureStore';
import App from './App';

import './styles/main.scss';

import * as Sentry from '@sentry/browser';

// const noSleep = new NoSleep();
const store = configureStore();

// Initialize Firebase.
firebase.initializeApp({
  apiKey: "AIzaSyAjZmRaQ30-wo5J6kAiSuMn9_8r-63xxlA",
  authDomain: "chordboard-209821.firebaseapp.com",
  projectId: "chordboard-209821",
});

const db = firebase.firestore();

// Disable deprecated features
db.settings({
  timestampsInSnapshots: true
});

if ( process.env.NODE_ENV === 'production' ) {
	window.Sentry = Sentry;
	const state = store.getState();
	Sentry.init({ dsn: 'https://2c14c1a4ae774cdd9c80545e7a34c2e7@sentry.io/1246393' });
	Sentry.configureScope((scope) => {
	 	scope.setUser({
			id: state.user.id,
			username: state.user.name
		});
	});
}

//noSleep.enable();

// db.collection( 'songs' ).get().then( querySnapshot => {
//     querySnapshot.forEach((doc) => {
//         console.log(doc.data());
//     });
// });

db.collection( 'songs' ).onSnapshot( querySnapshot => {
    querySnapshot.forEach(doc => {
        //const timestamp = doc.get('created_at');
        //const date = timestamp.toDate();
        console.log(doc.data());
    });
})

const theme = createMuiTheme( defaultTheme );

const render = _App => {

	RenderDOM.render(
		<Provider store={store}>
			<BrowserRouter>
				<MuiThemeProvider theme={theme}>
					<_App/>
				</MuiThemeProvider>
			</BrowserRouter>
		</Provider>,
		document.querySelector( 'main' )
	);

}

render( App )

if ( module.hot ) {
	module.hot.accept( './App', () => {
		const NextApp = require( './App' ).default
		render( NextApp )
	} )
}


store.dispatch( { type: 'FETCH_CURRENT_SET', setId: '1f251e1a-209b-4070-b994-270bf6aeaafb' } );
