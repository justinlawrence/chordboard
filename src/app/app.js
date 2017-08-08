import slugify from 'slugify';
import Router from 'preact-router';

import Navbar from './common/Navbar/Navbar.js';
import Song from './common/Song.js';
import SongList from './common/SongList.js';
import SongEditor from './common/SongEditor.js';
import Sheet from './sheet/Sheet.js';

const rawSongs = requireAll(
	require.context( '../songs', false, /(\.txt)$/ )
);

class App extends PreactComponent {
	songList = [];
	songMap = {
		_sort: []
	};
	state = {
		index: 0,
		song:  null
	};

	constructor( props ) {
		super( props );

		this.songList = rawSongs.map( s => new Song( s ) );

		this.songList.forEach( song => {

			const id = slugify( song.title );

			this.songMap[ id ] = song;
			this.songMap._sort.push( id );

		} );

		this.setSongFromUrl( Router.getCurrentUrl() );

		Router.subscribers.push( url => {

			this.setSongFromUrl( url );

		} );

	}

	goToNextSong = () => {

		this.goToSongIndex( this.state.index + 1 );


	};

	goToPreviousSong = () => {

		this.goToSongIndex( this.state.index - 1 );

	};

	goToSongIndex = index => {

		const len = this.songList.length;

		// Set index range to between 0 and list length.
		index = Math.min( Math.max( index, 0 ), len - 1 );

		// OR

		// Set index to wrap around at the ends.
		//index = index < 0 ? len - 1 : index >= len ? 0 : index;

		const song = this.songList[ index ];

		Router.route( `/songs/${slugify( song.title )}-${index}` );

	};

	setSongFromUrl = url => {

		const id = url.replace( /\/songs\/(.+)-.+?$/, "$1" );
		const song = this.songMap[ id ];
		const index = this.songMap._sort.indexOf( id );

		this.setState( {
			index: index,
			song:  song
		} );

	};

	render( {}, { song } ) {

		return (
			<div>
				<Navbar goToNextSong={this.goToNextSong}
				        goToPreviousSong={this.goToPreviousSong}/>
				<Router>
					<SongList default path="/songs" songs={this.songList}/>
					<SongEditor path="/new"/>
					<Sheet path="/songs/:id" song={song}/>
				</Router>
			</div>
		);

	}
}

export default App;

function requireAll( requireContext ) {

	return requireContext.keys().map( requireContext );

}