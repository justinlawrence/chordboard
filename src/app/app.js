import {findIndex} from 'lodash';
import {Redirect, Route, Switch} from 'react-router-dom';

import Navbar from './common/Navbar/Navbar';
import SongList from './SongList/SongList';
import SongEditor from './SongEditor/SongEditor';
import SongContainer from './songs/SongContainer';
import SetListContainer from './sets/SetListContainer';

import {db, sync} from './common/database';

class App extends PreactComponent {
	state = {
		focusedSet: {},
		slug:       '',
		setList:    [],
		songList:   []
	};

	componentDidMount() {

		this._getListOfSongs().then( songList => {
			this.setState( { songList } );
		} );

		const focusedSetSlug = localStorage.getItem( 'focusedSetSlug' );

		if ( focusedSetSlug ) {

			db.createIndex( {
				index: { fields: [ 'type', 'slug' ] }
			} );

			return db.find( {
				selector: {
					type: 'set',
					slug: focusedSetSlug
				}
			} ).then( result => {

				if ( result.docs[ 0 ] ) {

					this.setState( {
						focusedSet: result.docs[ 0 ]
					} );

				}

			} );

		}

		sync.on( "change", () => {

			this._getListOfSongs().then( songList => {
				this.setState( { songList } );
			} );

		} );

	}

	getChildContext = () => {

		return {
			setFocusedSet: this.setFocusedSet
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

		//Router.route( `/songs/${song.slug}` );

	};

	setFocusedSet = focusedSet => {

		localStorage.setItem( 'focusedSetSlug', focusedSet.slug );
		this.setState( { focusedSet } );

	};

	render( {}, { focusedSet, songList } ) {

		return (
			<div class="container">
				<Navbar
					focusedSet={focusedSet}
					goToNextSong={this.goToNextSong}
					goToPreviousSong={this.goToPreviousSong}/>

				<Switch>

					<Route exact path="/songs" render={props => (
						<SongList songs={songList} {...props}/>
					)}/>

					<Route exact path="/songs/add-to-set/:id" render={props => (
						<SongList id={props.match.params.id} songs={songList} {...props}/>
					)}/>

					<Route exact path="/songs/new" component={SongEditor}/>

					<Route exact path="/songs/:id/edit" render={props => (
						<SongEditor id={props.match.params.id} {...props}/>
					)}/>

					<Route exact path="/songs/:id" render={( { match } ) => (
						<SongContainer id={match.params.id}/>
					)}/>

					<Route path="/sets" component={SetListContainer}/>

					<Redirect to="/sets"/>

				</Switch>
			</div>
		);

	}

	_getListOfSongs = () => {

		// This gets docs linked to the user: justin
		return db.find( {
			selector: {
				type: 'song'
			}
		} )
			.then( result => result.docs )
			.catch( err => {

				console.warn( 'App.constructor - pouchdb query failed: _getListOfSongs', err );

			} );

	};

}

export default App;
