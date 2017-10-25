import {findIndex} from 'lodash';
import {Redirect, Route, Switch, matchPath, withRouter} from 'react-router-dom';

import Navbar from './common/Navbar/Navbar';
import SongList from './SongList/SongList';
import SongEditor from './SongEditor/SongEditor';
import SongContainer from './songs/SongContainer';
import SetListContainer from './sets/SetListContainer';

import {db, sync} from './common/database';

class App extends PreactComponent {
	state = {
		focusedSet: {},
		setList:    [],
		songList:   []
	};

	componentDidMount() {

		this._getListOfSongs().then( songList => {
			this.setState( { songList } );
		} );

		const setId = localStorage.getItem( 'focusedSetId' );

		if ( setId ) {

			db.get( setId )
				.then( doc => this.setState( { focusedSet: doc } ) );

		}

		sync.on( "change", () => {

			this._getListOfSongs().then( songList => {
				this.setState( { songList } );
			} );

		} );

	}

	getChildContext = () => ({
		getCurrentSongIndex: this._getCurrentSongIndex,
		setFocusedSet: this.setFocusedSet
	});

	exitLiveMode = () => {
		this.setFocusedSet( null );
	};

	goToNextSong = () => {

		if ( this.state.focusedSet ) {

			const index = this._getCurrentSongIndex();
			this.goToSongIndex( index + 1 );

		}

	};

	goToPreviousSong = () => {

		if ( this.state.focusedSet ) {

			const index = this._getCurrentSongIndex();
			this.goToSongIndex( index - 1 );

		}

	};

	goToSongIndex = index => {

		const { focusedSet } = this.state;
		const len = focusedSet.songs.length;

		// Set index range to between 0 and list length.
		index = Math.min( Math.max( index, 0 ), len - 1 );

		// OR

		// Set index to wrap around at the ends.
		//index = index < 0 ? len - 1 : index >= len ? 0 : index;

		const setSong = focusedSet.songs[ index ];

		if ( this.props.history ) {
			this.props.history.push( `/sets/${focusedSet._id}/songs/${setSong._id}` );
		}

	};

	setFocusedSet = focusedSet => {

		localStorage.setItem( 'focusedSetId', focusedSet ? focusedSet._id : '' );
		this.setState( { focusedSet } );

	};

	render( {}, { focusedSet, songList } ) {

		return (
			<div>
				<Navbar
					focusedSet={focusedSet}
					onExitLiveMode={this.exitLiveMode}
					onGoToNextSong={this.goToNextSong}
					onGoToPreviousSong={this.goToPreviousSong}
				/>

				<div className="container">
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
			</div>
		);

	}

	_getCurrentSongIndex = () => {

		if ( this.props.location ) {

			const match = matchPath( location.pathname, {
				path:  '/sets/:setId/songs/:songId',
				exact: true
			} );

			if ( match ) {

				const { focusedSet } = this.state;

				return findIndex( focusedSet.songs, { _id: match.params.songId } );

			}
		}

		return -1;

	};

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

export default withRouter( App );
