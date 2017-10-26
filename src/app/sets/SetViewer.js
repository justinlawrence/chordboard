import {find, findIndex} from 'lodash'
import {Link} from 'react-router-dom';
import SetLink from './SetLink';
import SongKey from 'app/common/SongKey';



import {db, sync} from '../common/database';

import './SetViewer.scss';

class SetViewer extends PreactComponent {
	state = {
		isLoading: false,
		mode:      ''
	};

	editModeOff = () => this.setState( { mode: '' } );
	editModeOn = () => this.setState( { mode: 'edit' } );

	onDeleteSet = () => {

		if ( this.props.onRemoveSet ) {
			this.props.onRemoveSet();
		}

	};

	onMoveSongDown = songId => {

		const index = findIndex( this.props.songs, { _id: songId } );

		if ( index > -1 ) {
			if ( this.props.onSongMove ) {
				this.props.onSongMove( songId, index + 1 );
			}
		}

	};

	onMoveSongUp = songId => {

		const index = findIndex( this.props.songs, { _id: songId } );

		if ( index > -1 ) {
			if ( this.props.onSongMove ) {
				this.props.onSongMove( songId, index - 1 );
			}
		}

	};

	changeKey = ( songId, amount ) => {

		if ( this.props.onChangeKey ) {
			this.props.onChangeKey( songId, amount );
		}

	};

	removeSong = songId => {

		if ( this.props.onRemoveSong ) {
			this.props.onRemoveSong( songId );
		}

	};

	transposeDown = song => { this.changeKey( song._id, -1 ); };
	transposeUp = song => { this.changeKey( song._id, 1 ); };

	render( { set, songs }, { mode } ) {

		return set && (
			<section class="section set-viewer">
				<div class="container">
					<div class="columns">
						<div class="column is-three-quarters">

							<nav class="level">

								<div class="level-left">
									<div class="level-item">
										<p class="subtitle">
											<strong>{set.title}</strong>
										</p>
									</div>
								</div>

								<div class="level-right">
									{mode === 'edit' ? [
										<div class="level-item">
											<a class="button is-outlined"
											   onClick={this.onDeleteSet}>
												<span class="icon is-small is-left"><i class="fa fa-trash"></i></span>
											</a>
										</div>,
										<div class="level-item">
											<a class="button is-primary"
											   href={`/songs/add-to-set/${set._id}`}>
												Add songs
											</a>
										</div>,
										<div class="level-item">
											<a class="button is-primary" onClick={this.editModeOff}>
												<span class="icon is-small">
													<i class="fa fa-pencil"></i>
												</span>
											</a>
										</div>
									] : (
										<a class="button" onClick={this.editModeOn}>
											<span class="icon is-small">
												<i class="fa fa-pencil"></i>
											</span>
										</a>
									)}
								</div>
							</nav>

							<table class="table is-bordered is-striped is-fullwidth">

								<tbody>
								{songs.length ?
									songs.map( this._createRow )
									:
									<div>
										<p class="subtitle">This set has no songs</p>

										<a class="button is-primary"
										   href={`/songs/add-to-set/${set._id}`}>
											Add songs
										</a>


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
					<Link to={`/sets/${set._id}/songs/${song._id}`}>
						{song.title}
					</Link>
				</td>
				<td>
					<div class="field is-grouped">

						{mode === 'edit' && [
							<a class="button is-small is-white" title="transpose down"
							   onClick={() => this.transposeDown( song )}>
								<span class="icon is-small"><i class="fa fa-minus"></i></span>
							</a>
						]}

						<SongKey value={key}></SongKey>

						{mode === 'edit' && [

							<a class="button is-small is-white" title="transpose up"
							   onClick={() => this.transposeUp( song )}>

								<span class="icon is-small"><i class="fa fa-plus"></i></span>
							</a>
						]}


					</div>

				</td>

				{mode === 'edit' && (
					<td>
						<a
							onClick={() => this.onMoveSongUp( song._id )}
							title="move this song up the list">
							<span class="icon is-small is-left"><i class="fa fa-arrow-up"></i></span>
						</a>
						<a
							onClick={() => this.removeSong( song._id )}
							title="remove this song from the list">
							<span class="icon is-small is-left"><i class="fa fa-trash"></i></span>
						</a>
					</td>
				)}
			</tr>
		);

	};
}

export default SetViewer;
