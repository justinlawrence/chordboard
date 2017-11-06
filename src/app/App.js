import {findIndex} from 'lodash';
import {connect} from 'preact-redux';
import {Redirect, Route, Switch, matchPath, withRouter} from 'react-router-dom';

import Login from './login/Login';
import Navbar from './common/Navbar/Navbar';
import SongList from './SongList/SongList';
import SongEditor from './SongEditor/SongEditor';
import SongContainer from './songs/SongContainer';
import SetListContainer from './sets/SetListContainer';

import {db, sync} from './common/database';
import './app.scss';

class App extends PreactComponent {
	state = {
		focusedSet: null,
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
		setFocusedSet: this.setFocusedSet
	});

	exitLiveMode = () => {
		this.setFocusedSet( null );
	};

	goToNextSong = () => {

		this._getCurrentSongIndex().then( index => {
			this.goToSongIndex( index + 1 );
		} );

	};

	goToPreviousSong = () => {

		this._getCurrentSongIndex().then( index => {
			this.goToSongIndex( index - 1 );
		} );

	};

	goToSongIndex = index => {

		this._getSet().then( set => {

			const len = set.songs.length;

			// Set index range to between 0 and list length.
			index = Math.min( Math.max( index, 0 ), len - 1 );

			// OR

			// Set index to wrap around at the ends.
			//index = index < 0 ? len - 1 : index >= len ? 0 : index;

			const setSong = set.songs[ index ];

			if ( !setSong ) { return; }

			if ( this.props.history ) {
				this.props.history.push( `/sets/${set._id}/songs/${setSong._id}` );
			}

		} );

	};

	setFocusedSet = focusedSet => {

		//localStorage.setItem( 'focusedSetId', focusedSet ? focusedSet._id : '' );
		this.setState( { focusedSet } );

	};

	render( { user }, { focusedSet, songList } ) {

		return (
			<div className="app">
				<Navbar
					onExitLiveMode={this.exitLiveMode}
					onGoToNextSong={this.goToNextSong}
					onGoToPreviousSong={this.goToPreviousSong}
				/>

				<div className="app__content">
					<Switch>
						<Route exact path="/login" component={Login}/>

						{!user.name &&
						<Redirect to="/login"/>}

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

	_getSet = () => {

		if ( this.props.location ) {

			const match = matchPath( this.props.location.pathname, {
				path:  '/sets/:setId/songs/:songId',
				exact: true
			} );

			if ( match ) {

				return db.get( match.params.setId );

			}

		}

	};

	_getCurrentSongIndex = () => {

		return this._getSet().then( set => {

			const match = matchPath( this.props.location.pathname, {
				path:  '/sets/:setId/songs/:songId',
				exact: true
			} );

			return set ? findIndex( set.songs, { _id: match.params.songId } ) : -1;

		} );

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

const mapStateToProps = state => ({
	user: state.user
});

export default withRouter( connect( mapStateToProps, null )( App ) );
