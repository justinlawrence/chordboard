import {render} from 'preact';
import {BrowserRouter} from 'react-router-dom';

import App from './app/app.js';
import './styles/main.scss';

render(
	<BrowserRouter>
		<App/>
	</BrowserRouter>,
	document.querySelector( 'main' ) );

