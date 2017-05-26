import slugify from 'slugify';
import Router from 'preact-router';

import Navbar from './common/Navbar/Navbar.js';
import Song from './common/Song.js';
import SongList from './common/SongList.js';
import SongViewer from './common/SongViewer.js';

const rawSongs = requireAll(
	require.context( '../songs', false, /(\.txt)$/ )
);

class App extends PreactComponent {
	songList = [];
	songMap = {};
	state = {
		index: 0
	};

	constructor( props ) {
		super( props );

		this.songList = rawSongs.map( s => new Song( s ) );

		this.songList.forEach( song => {

			const id = slugify( song.title );

			this.songMap[ id ] = song;

		} );

	}

	render( props, {index} ) {

		return (
			<div>
				<Navbar index={index} songList={this.songList}/>
				<Router>
					<SongList default path="/songs" songs={this.songList}/>
					<SongViewer path="/songs/:id" songMap={this.songMap}/>
				</Router>
			</div>
		);

	}
}

export default App;

function requireAll( requireContext ) {

	return requireContext.keys().map( requireContext );

}