import Router from 'preact-router';

import Navbar from './common/Navbar/Navbar.js';
import Song from './common/Song.js';
import SongList from './common/SongList.js';
import SongViewer from './common/SongViewer.js';

const rawSongs = requireAll(
	require.context( '../songs', false, /(\.txt)$/ )
);

class App extends PreactComponent {
	constructor( props ) {
		super( props );

		this.state = {
			songs: rawSongs.map( s => new Song( s ) )
		};

	}

	render( props, { songs } ) {

		return (
			<div>
				<Navbar/>
				<Router>
					<SongList path="/" songs={songs}/>
					<SongViewer path="/song/:slug" songs={songs}/>
				</Router>
			</div>
		);

	}
}

export default App;

function requireAll( requireContext ) {

	return requireContext.keys().map( requireContext );

}