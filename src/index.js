import './bootstrap'

import React from 'react';
import RenderDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import configureStore from 'configureStore';
import App from './App';

import './styles/main.scss';

// const noSleep = new NoSleep();
const store = configureStore();

//noSleep.enable();

const render = _App => {

	RenderDOM.render(
		<Provider store={store}>
			<BrowserRouter>
				<_App/>
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