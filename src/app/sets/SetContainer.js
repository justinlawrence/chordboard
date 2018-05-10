import React, { Component } from 'react';
import { find, findIndex, remove, sortBy } from 'lodash';
import { connect } from 'react-redux';
import { Link, Route } from 'react-router-dom';

import * as actions from 'actions';
import { db } from 'database';
import SongContainer from '../songs/SongContainer';
import transposeChord from '../common/transpose-chord';

import SetViewer from './SetViewer';

class SetContainer extends Component {
	state = {
		set: null,
		songs: []
	};

	componentDidMount() {
		this.handleProps( this.props );
	}

	componentWillReceiveProps( nextProps ) {
		this.handleProps( nextProps );
	}

	handleChangeKey = ( songId, amount ) => {

		const set = { ...this.state.set };

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
		/*if ( !this.state.set || this.state.set._id !== props.setId ) {
			props.fetchCurrentSet( props.setId );
		}*/
		if ( this.props.currentSet ) {
			this.setState( { set: this.props.currentSet } );
		}
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

	render() {

		const { set } = this.state;

		return set && (
			<div>
				<Route exact path="/sets/:setId" render={props => (
					<SetViewer
						onChangeKey={this.handleChangeKey}
						onSongMove={this.handleSongMove}
						onRemoveSet={this.handleRemoveSet}
						onRemoveSong={this.handleRemoveSong}
						set={set}
						{...props}/>
				)}/>
				<Route exact path="/sets/:setId/songs/:songId" render={( { match } ) => {

					const songId = match.params.songId;

					const index = findIndex( set.songs, { _id: songId } );
					const currentKey = set && set.songs[ index ] ?
						set.songs[ index ].key : null;

						//TODO: catch errors where the set song key is empty

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

	_saveSet = set => {

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

const mapStateToProps = state => ({
	currentSet: state.currentSet
});

export default connect( mapStateToProps, actions )( SetContainer );
