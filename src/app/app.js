import url from 'url';
import {findIndex} from 'lodash';
import Router from 'preact-router';

import Navbar from './common/Navbar/Navbar.js';
import SetEditor from './SetEditor/SetEditor.js';
import SongList from './SongList/SongList.js';
import SongEditor from './SongEditor/SongEditor.js';
import SetList from './SetList/SetList.js';
import SetViewer from './SetViewer/SetViewer.js';
import SongViewer from './SongViewer/SongViewer.js';

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
		focusedSet: '',
		mode:       '',
		slug:       '',
		setList:    [],
		songList:   []
	};

	componentDidMount() {

		const currentUrl = new URL( location.origin + Router.getCurrentUrl() );

		this.setState( { mode: currentUrl.searchParams.get( 'mode' ) || '' } );

		this._getListOfSongs().then( songList => {
			this.setState( { songList } );
		} );
		this._getListOfSets().then( setList => {
			this.setState( { setList } );
		} );

		this.setSongFromUrl( Router.getCurrentUrl() );

		Router.subscribers.push( url => {

			this.updateModeInUrl();

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

	getChildContext = () => {

		return {
			setFocusedSet: this.setFocusedSet,
			setMode:       this.setMode
		};

	};

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

	setFocusedSet = focusedSet => {

		this.setState( { focusedSet } );

	};

	setMode = mode => {

		this.setState( { mode } );

	};

	setSongFromUrl = url => {

		const slugMatch = url.match( /\/songs\/(.+)$/ );

		if ( slugMatch ) {

			this.setState( {
				slug: slugMatch[ 1 ]
			} );

		}

	};

	updateModeInUrl = () => {

		const url = location.origin + Router.getCurrentUrl();
		const mode = this.state.mode;
		const currentUrl = new URL( url );

		const newUrl = new URL( url );
		newUrl.searchParams.delete( 'mode' );

		if ( mode ) {

			newUrl.searchParams.set( 'mode', mode );

		}

		if ( currentUrl.href !== newUrl.href ) {

			setTimeout( () => {
				Router.route( newUrl.pathname + newUrl.search );
			} );

		}

	};

	render( {}, { focusedSet, mode, slug, setList, songList } ) {

		return (
			<div class="container">
				<Navbar
					focusedSet={focusedSet}
					goToNextSong={this.goToNextSong}
					goToPreviousSong={this.goToPreviousSong}
					mode={mode}/>
				<Router>
					<SongList path="/songs" songs={songList}/>
					<SongList path="/songs/add-to-set/:slug" songs={songList}/>
					<SongEditor path="/songs/new"/>
					<SongEditor path="/songs/:slug/edit" slug={slug}/>

					<SetList default path="/sets" sets={setList}/>
					<SetViewer path="/sets/:slug" slug={slug}/>
					<SetEditor path="/sets/new"/>
					<SongViewer path="/sets/:slug/songs/:id" mode={mode}/>

					<SongViewer path="/songs/:slug" mode={mode}/>
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
