import {find, findIndex, remove, sortBy} from 'lodash';
import {Link, Route} from 'react-router-dom';

import {db} from '../common/database';
import SongContainer from '../songs/SongContainer';
import transposeChord from '../common/transpose-chord';

import SetViewer from './SetViewer';

class SetContainer extends PreactComponent {
	state = {
		set:   null,
		songs: []
	};

	componentDidMount() {
		this.handleProps( this.props );
	}

	componentWillReceiveProps( nextProps ) {
		this.handleProps( nextProps );
	}

	handleChangeKey = ( songId, amount ) => {

		const set = Object.assign( {}, this.state.set );

		const setSongs = set.songs.slice();
		const setSong = find( setSongs, s => s._id === songId );

		if ( setSong ) {

			setSong.key = transposeChord( setSong.key, amount );

			set.songs = setSongs;

			this.setState( { set } );

			if ( set ) {

				this._saveSet( set );

			}

		}

	};

	handleSongMove = ( songId, targetIndex = 0 ) => {

		const set = Object.assign( {}, this.state.set );
		const setSongs = set.songs.slice();
		const index = findIndex( setSongs, { _id: songId } );
		const song = setSongs[ index ];
		const newIndex = Math.max( Math.min( targetIndex, setSongs.length ), 0 );

		setSongs.splice( index, 1 );
		setSongs.splice( newIndex, 0, song );

		set.songs = setSongs;

		this.setState( { set } );

		if ( set ) {

			this._saveSet( set );

		}

	};

	handleProps = props => {

		this._getSet( props.id );

	};

	handleRemoveSet = () => {

		if ( confirm( 'Are you very sure you want to delete this set?' ) ) {

			const set = this.state.set;

			//1 delete from pouchDb
			db.remove( set._id, set._rev )
				.then( () => {

					if ( this.props.history ) {

						const location = {
							pathname: '/sets'
						};

						this.props.history.replace( location );

					}

				} )
				.catch( err => {

					alert( 'Unable to delete set' );
					console.warn( err );

				} );

		}

	};

	handleRemoveSong = songId => {

		const set = Object.assign( {}, this.state.set );
		const setSongs = set.songs.slice();
		const songs = this.state.songs.slice();

		remove( setSongs, { _id: songId } );
		remove( songs, { _id: songId } );

		set.songs = setSongs;

		this.setState( { set, songs } );

		if ( set ) {

			this._saveSet( set );

		}

	};

	render( props, { set, songs } ) {

		const orderedSongs = sortBy( songs, song => findIndex( set.songs, { _id: song._id } ) );

		return (
			<div>
				<Route exact path="/sets/:id" render={props => (
					<SetViewer
						onChangeKey={this.handleChangeKey}
						onSongMove={this.handleSongMove}
						onRemoveSet={this.handleRemoveSet}
						onRemoveSong={this.handleRemoveSong}
						set={set}
						songs={orderedSongs}
						{...props}/>
				)}/>
				<Route exact path="/sets/:setId/songs/:songId" render={( { match } ) => {

					const songId = match.params.songId;

					const index = findIndex( songs, { _id: songId } );
					const currentKey = set && set.songs[ index ] ?
						set.songs[ index ].key : null;

					return (
						<div>
							<SongContainer
								currentKey={currentKey}
								id={songId}/>
						</div>
					);

				}}/>
			</div>

		);
	}

	_getSet = id => {

		// This gets all sets
		return db.get( id ).then( doc => {

			const set = doc;

			this.setState( { set } );
			this._getSongs( set );

		} ).catch( err => {

			console.warn( 'SetContainer._getSet - fetching set', err );

		} );

	};

	_getSongs = set => {

		const keys = set.songs.map( s => typeof s === 'string' ? s : s._id );

		db.allDocs( {
			include_docs: true,
			keys:         keys
		} ).then( result => {

			this.setState( {
				songs: result.rows.map( r => r.doc ).filter( r => !!r ) || []
			} );

		} ).catch( err => {

			console.warn( 'SetContainer._getSongs - fetching songs', err );

		} );

	};

	_saveSet = ( set ) => {

		db.get( set._id ).then( doc => {

			set._rev = doc._rev;

			return db.put( set ).catch( err => {

				if ( err.name === 'conflict' ) {

					console.error( 'SetContainer._saveSet: conflict -', err );

				} else {

					console.error( 'SetContainer._saveSet -', err );

				}

			} );

		} );

	};
}

export default SetContainer;
