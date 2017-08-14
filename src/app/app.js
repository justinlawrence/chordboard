import Router from 'preact-router';

import Navbar from './common/Navbar/Navbar.js';
import SongList from './common/SongList.js';
import SongEditor from './common/SongEditor.js';
import Sheet from './sheet/Sheet.js';
import PouchDB from 'pouchdb';
import PouchDBFindPlugin from 'pouchdb-find';

PouchDB.plugin( PouchDBFindPlugin );

const db = new PouchDB( 'chordboard' );

// Does nothing if the index already exists
db.createIndex( {
	index: { fields: [ 'type', 'users' ] }
} );

//PouchDB.sync( 'chordboard', 'http://localhost:5984/chordboard' );

class App extends PreactComponent {
	state = {
		slug:     "",
		songList: []
	};

	constructor( props ) {
		super( props );

		// This gets docs linked to the user: justin
		db.find( {
			selector: {
				type:  'song',
				users: {
					$in: [ 'justin' ]
				}
			}
		} ).then( result => {

			this.setState( {
				songList: result.docs
			} );

		} ).catch( err => {

			console.warn( 'App.constructor - pouchdb query failed', err );

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

		Router.route( `/songs/${song.slug}` );

	};

	setSongFromUrl = url => {

		const slugMatch = url.match( /\/songs\/(.+)$/ );

		if ( slugMatch ) {

			this.setState( {
				slug: slugMatch[ 1 ]
			} );

		}

	};

	render( {}, { slug, songList } ) {

		return (
			<div>
				<Navbar goToNextSong={this.goToNextSong}
				        goToPreviousSong={this.goToPreviousSong}/>
				<Router>
					<SongList default path="/songs" songs={songList}/>
					<SongEditor path="/new"/>
					<Sheet path="/songs/:slug" slug={slug}/>
				</Router>
			</div>
		);

	}
}

export default App;

function requireAll( requireContext ) {

	return requireContext.keys().map( requireContext );

}
