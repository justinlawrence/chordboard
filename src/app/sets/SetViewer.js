import {find} from 'lodash'
import {Link} from 'react-router-dom';

import {db, sync} from '../common/database';

import transposeChord from '../common/transpose-chord';
import './SetViewer.scss';

class SetViewer extends PreactComponent {
	state = {
		isLoading: false,
		mode:      '',
		songs:     []
	};

	onDeleteSet = () => {

		console.log( 'TODO: tell the parent that the song has been deleted' );
		return;

		const set = this.props.set;

		if ( confirm( 'Are you very sure you want to delete this set?' ) ) {

			//1 delete from pouchDb
			db.remove( set._id, set._rev )
				.then( () => {

					//2. redirect to /sets
					route( '/sets' );

				} )
				.catch( err => {

					alert( 'Unable to delete set' );
					console.warn( err );

				} );

		}

	};

	onMoveSongUp = song => {

		console.log( 'TODO: tell the parent that the song has moved');
		return;

		const songs = this.props.songs.slice();
		const setSongs = this.props.set.songs.slice();

		const currentIndex = songs.indexOf( song );
		const targetIndex = currentIndex - 1;

		if ( currentIndex !== -1 ) {

			setSongs.splice( currentIndex, 1 );
			songs.splice( currentIndex, 1 );

			setSongs.splice( targetIndex, 0, { _id: song._id, key: song.key } );
			songs.splice( targetIndex, 0, song );

			const set = Object.assign( {}, this.props.set, {
				songs: setSongs
			} );

			this.saveSet( set );
			this.setState( { songs } );


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

		const songs = this.props.songs.slice();
		const setSongs = this.props.set.songs.slice();
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

			const set = Object.assign( {}, this.props.set, {
				songs: setSongs
			} );
			this.saveSet( set );
			this.setState( { songs } );

		}

	};

	transposeDown = song => { this.changeKey( song, -1 ); };
	transposeUp = song => { this.changeKey( song, 1 ); };

	render( { set, songs }, { mode } ) {

		return set && (
			<section class="section set-viewer">
				<div class="container">
					<div class="columns">
						<div class="column is-three-quarters">

							<nav class="level">

								<div class="level-left">
									<div class="level-item">
										<p class="subtitle is-5">
											<strong>{set.title}</strong>
										</p>
									</div>
								</div>

								<div class="level-right">
									<div class="level-item">

										{mode === 'edit' && [
											<div class="control">
												<a class="button is-primary"
												   href={`/songs/add-to-set/${set.slug}`}>
													Add songs
												</a>
											</div>,
											<div class="control">
												<a class="button is-outlined"
												   onClick={this.onDeleteSet}>
													<span class="icon is-small is-left"><i class="fa fa-trash"></i></span>
												</a>
											</div>
										]}

									</div>
								</div>
							</nav>

							<table class="table is-bordered is-striped is-fullwidth">

								<tbody>
								{songs.length ?
									songs.map( this._createRow )
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

	_createRow = song => {

		const { set } = this.props;
		const { mode } = this.state;
		const setSong = find( set.songs, s => s._id === song._id );
		const key = setSong ? setSong.key : song.key;

		return (
			<tr>
				<td>
					<Link to={`/sets/${set.slug}/songs/${song.slug}`}>
						{song.title}
					</Link>
				</td>
				<td>
					<div class="field is-grouped">

						<a class="button is-small is-white">
							{key}
						</a>
						{mode === 'edit' && [
							<a class="button is-small is-white" title="transpose down"
							   onClick={() => this.transposeDown( song )}>
								<span class="icon is-small"><i class="fa fa-minus"></i></span>
							</a>,
							<a class="button is-small is-white" title="transpose up"
							   onClick={() => this.transposeUp( song )}>

								<span class="icon is-small"><i class="fa fa-plus"></i></span>
							</a>
						]}
					</div>

				</td>

				{mode === 'edit' && (
					<td>
						<a onClick={() => this.onMoveSongUp(
							song )} title="move this song up the list">
							<span class="icon is-small is-left"><i class="fa fa-arrow-up"></i></span>
						</a>
					</td>
				)}
			</tr>
		);

	};
}

export default SetViewer;
