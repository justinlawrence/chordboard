import {find} from 'lodash'
import {route} from 'preact-router';
import PouchDB from 'pouchdb';
import PouchDBFindPlugin from 'pouchdb-find';

import transposeChord from '../common/transpose-chord';
import './SetViewer.scss';

PouchDB.plugin( PouchDBFindPlugin );

const db = new PouchDB( 'chordboard' );

db.createIndex( {
	index: { fields: [ 'type', 'slug' ] }
} );

class SetViewer extends PreactComponent {
	state = {
		isLoading: false,
		set:       null,
		songs:     []
	};

	componentDidMount() {
		this.handleProps( this.props );
	}

	componentWillReceiveProps( nextProps ) {
		this.handleProps( nextProps );
	}

	handleProps = props => {

		if ( props.slug ) {

			this.setState( {
				isLoading: true
			} );

			db.find( {
				selector: {
					type: 'set',
					slug: props.slug
				}
			} ).then( result => {

				const set = result.docs[ 0 ];

				if ( set.songs && set.songs.length ) {

					this.setState( {
						isLoading: true
					} );

					const keys = set.songs.map(
						s => typeof s === 'string' ? s : s._id );

					db.allDocs( {
						include_docs: true,
						keys:         keys
					} ).then( result => {

						this.setState( {
							isLoading: false,
							songs:     result.rows.map( r => r.doc ) || []
						} );

					} ).catch( err => {

						console.error( 'SetViewer.handleProps - fetching songs',
							err );

						this.setState( {
							isLoading: false,
							set:       null
						} );

					} );

				}

				this.setState( {
					isLoading: false,
					set:       set
				} );

			} ).catch( err => {

				console.error( 'SetViewer.handleProps -', err );

				this.setState( {
					isLoading: false,
					set:       null
				} );

			} );

		}

	};

	onDeleteSet = () => {

		const set = this.state.set;

		if ( confirm( 'Are you very sure you want to delete this set?' ) ) {

			//1 delete from pouchDb
			db.remove( set._id, set._rev )
				.then( () => {

					//2. redirect to /sets
					route( '/sets' );

				} )
				.catch( err => {

					alert( 'Failed to delete' );
					console.warn( err );

				} );

		}

	};

	onMoveSongUp = song => {

		const songs = this.state.songs.slice();
		const setSongs = this.state.set.songs.slice();

		const currentIndex = songs.indexOf( song );
		const targetIndex = currentIndex - 1;

		if ( currentIndex !== -1 ) {

			setSongs.splice( currentIndex, 1 );
			songs.splice( currentIndex, 1 );

			setSongs.splice( targetIndex, 0, { _id: song._id, key: song.key } );
			songs.splice( targetIndex, 0, song );

			const set = Object.assign( {}, this.state.set, {
				songs: setSongs
			} );

			this.saveSet( set );
			this.setState( { set, songs } );


		}

	};

	saveSet = set => {

		db.put( set )
			.then( () => {

				console.log( 'Saved set!', set._id );

			} )
			.catch( err => {

				console.warn( 'saveSet error', err );

			} );

	};

	changeKey = ( song, amount ) => {

		const songs = this.state.songs.slice();
		const setSongs = this.state.set.songs.slice();
		const setSong = find( setSongs, s => s._id === song._id );

		const index = songs.indexOf( song );
		const key = setSong ? setSong.key : song.key;

		if ( index !== -1 ) {

			const newKey = transposeChord( key, amount );

			song.key = newKey;

			setSongs.splice( index, 1 );
			songs.splice( index, 1 );

			setSongs.splice( index, 0, { _id: song._id, key: newKey } );
			songs.splice( index, 0, song );

			const set = Object.assign( {}, this.state.set, {
				songs: setSongs
			} );
			this.saveSet( set );
			this.setState( { set, songs } );

		}

	};

	transposeDown = song => { this.changeKey( song, -1 ); };
	transposeUp = song => { this.changeKey( song, 1 ); };

	render( {}, { songs, set } ) {

		const createRow = song => {

			const setSong = find( set.songs, s => s._id === song._id );
			const key = setSong ? setSong.key : song.key;

			return (
				<tr>
					<td>
						<a href={`/songs/${song.slug}`}>
							{song.title}
						</a>
					</td>
					<td>
						{key}
						<a class="button"
						   onClick={() => this.transposeDown( song )}
						>
							<span class="icon is-small"><i class="fa fa-minus"></i></span>
						</a>
						<a class="button"
						   onClick={() => this.transposeUp( song )}
						>
							<span class="icon is-small"><i class="fa fa-plus"></i></span>
						</a>

					</td>
					<td>
						<a onClick={() => this.onMoveSongUp(
							song )}>
													<span class="icon is-small is-left">
			                                            <i class="fa fa-arrow-up"></i>
			                                        </span>
						</a>
					</td>
				</tr>
			);

		}

		return (
			<section class="set-viewer section">
				<div class="container">
					<div class="columns">
						<div class="column is-three-quarters">

							<nav class="level">

								<div class="level-left">

									<div class="level-item">
										<p class="subtitle is-5">
											<strong>{set && set.title}</strong>
										</p>
									</div>
								</div>

								<div class="level-right">
									<p class="level-item">
										{set &&
										<a class="button is-primary"
										   href={`/songs/add-to-set/${set.slug}`}>Add songs</a>}
									</p>
									<p class="level-item">
										{set &&
										<a class="button is-outlined" onClick={this.onDeleteSet}>
											 <span class="icon is-small is-left">
		 						                <i class="fa fa-trash"></i>
		 						      </span>

										</a>}
									</p>
								</div>
							</nav>

							<table class="table is-bordered is-striped is-fullwidth">

								<tbody>
								{songs.length ?
									songs.map( createRow )
									:
									<div>
										<h1>This set has no songs</h1>
										<p>Add some by clicking Add Songs above</p>
									</div>
								}
								</tbody>

							</table>

						</div>

					</div>
				</div>
			</section>
		);
	}
}

export default SetViewer;
