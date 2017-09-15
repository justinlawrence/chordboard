import Router from 'preact-router';
import {findIndex} from 'lodash';
import Navbar from './common/Navbar/Navbar.js';
import SetEditor from 'app/common/SetEditor.js';
import SongList from './common/SongList.js';
import SongEditor from './common/SongEditor.js';
import SetList from './common/SetList.js';
import SetViewer from './common/SetViewer.js';
import Sheet from './sheet/Sheet.js';
import PouchDB from 'pouchdb';
import PouchDBFindPlugin from 'pouchdb-find';

PouchDB.plugin( PouchDBFindPlugin );

const db = new PouchDB( 'chordboard' );
const user = 'justin';

// Does nothing if the index already exists
db.createIndex( {
	index: { fields: [ 'type' ] }
} );
db.createIndex( {
	index: { fields: [ 'type', 'users' ] }
} );

const remoteDbSettings = {
	adapter: 'http',
	auth:    {
		username: 'justinlawrence',
		password: 'cXcmbbLFO8'
	}
};
const localDB = new PouchDB( 'chordboard' );
const remoteDB = new PouchDB( 'https://couchdb.cloudno.de/chordboard',
	remoteDbSettings );

const sync = localDB.sync( remoteDB, {
	live:  true,
	retry: true
} );

class App extends PreactComponent {
	state = {
		slug:     "",
		setList:  [],
		songList: []
	};

	constructor( props ) {
		super( props );

		this._getListOfSongs().then( songList => {
			this.setState( { songList } );
		} );
		this._getListOfSets().then( setList => {
			this.setState( { setList } );
		} );

		this.setSongFromUrl( Router.getCurrentUrl() );

		Router.subscribers.push( url => {

			this.setState( {
				slug: ""
			} );

			this.setSongFromUrl( url );

		} );

		sync.on( "change", info => {

			this._getListOfSongs().then( songList => {
				this.setState( { songList } );
			} );

			this._getListOfSets().then( setList => {
				this.setState( { setList } );
			} );

		} );

	}

	goToNextSong = () => {

		const index = findIndex( this.state.songList,
			s => s.slug === this.state.slug );

		this.goToSongIndex( index + 1 );

	};

	goToPreviousSong = () => {

		const index = findIndex( this.state.songList,
			s => s.slug === this.state.slug );

		this.goToSongIndex( index - 1 );

	};

	goToSongIndex = index => {

		const len = this.state.songList.length;

		// Set index range to between 0 and list length.
		index = Math.min( Math.max( index, 0 ), len - 1 );

		// OR

		// Set index to wrap around at the ends.
		//index = index < 0 ? len - 1 : index >= len ? 0 : index;

		const song = this.state.songList[ index ];

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

	render( {}, { slug, setList, songList } ) {

		return (
			<div>
				<Navbar goToNextSong={this.goToNextSong}
				        goToPreviousSong={this.goToPreviousSong}/>
				<Router>
					<SongList default path="/songs" songs={songList}/>
					<SongList path="/songs/add-to-set/:slug" songs={songList}/>
					<SongEditor path="/songs/new"/>
					<SongEditor path="/songs/:slug/edit" slug={slug}/>

					<SetList path="/sets" sets={setList}/>
					<SetViewer path="/sets/:slug" slug={slug}/>
					<SetEditor path="/sets/new"/>

					<Sheet path="/songs/:slug" slug={slug}/>
				</Router>
			</div>
		);

	}

	_getListOfSongs = () => {

		// This gets docs linked to the user: justin
		return db.find( {
			selector: {
				type:  'song',
				users: {
					$in: [ user ]
				}
			}
		} )
			.then( result => result.docs )
			.catch( err => {

				console.warn(
					'App.constructor - pouchdb query failed: _getListOfSongs',
					err );

			} );

	};

	_getListOfSets = () => {

		// This gets all sets
		return db.find( {
			selector: {
				type: 'set'
			}
		} )
			.then( result => result.docs )
			.catch( err => {

				console.warn(
					'App.constructor - pouchdb query failed: _getListOfSets',
					err );

			} );

	};


}

export default App;
