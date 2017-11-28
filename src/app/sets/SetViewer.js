import {find, findIndex} from 'lodash'
import {Link} from 'react-router-dom';

import KeySelector from 'app/common/KeySelector';

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
			<div className="set-viewer">

				<section className="hero is-small is-light">

					<div className="hero-body">

							<div className="container">

								<div className="columns is-vcentered">

									<div className="column is-three-quarters">

										<nav className="level">

											<div className="level-left">
												<div className="level-item">
													<p className="subtitle">
														<strong>{set.title}</strong>
													</p>
												</div>
											</div>

											<div className="level-right">
												{mode === 'edit' ? [
													<div className="level-item">
														<a className="button is-outlined"
											   				onClick={this.onDeleteSet}>
															<span className="icon is-small is-left"><i className="fa fa-trash"/></span>
														</a>
													</div>,
													<div className="level-item">
														<a className="button is-primary"
											   			href={`/songs/add-to-set/${set._id}`}>
															Add songs
														</a>
													</div>,
													<div className="level-item">
														<a className="button is-primary" onClick={this.editModeOff}>
															<span className="icon is-small">
																<i className="fa fa-pencil"/>
															</span>
														</a>
													</div>
											] : (
												<a className="button" onClick={this.editModeOn}>
													<span className="icon is-small">
														<i className="fa fa-pencil"/>
													</span>
												</a>
											)}
										</div>

									</nav>
								</div>
							</div>
						</div>

					</div>
				</section>




				<section className="section">
					<div className="container">

						<table className="table is-bordered is-striped is-fullwidth">

							<tbody>
							{songs.length ?
								songs.map( this._createRow )
								:
								<div>
									<p className="subtitle">This set has no songs</p>

									<a className="button is-primary"
									   href={`/songs/add-to-set/${set._id}`}>
										Add songs
									</a>


								</div>
							}
							</tbody>

						</table>

					</div>

				</section>

			</div>
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
					<p className="title is-4">
					<Link to={`/sets/${set._id}/songs/${song._id}`}>
						{song.title}
					</Link>
				</p>
				</td>
				<td>
					<div className="field is-grouped">

						{mode === 'edit' && [
							<a className="button is-small is-white" title="transpose down"
							   onClick={() => this.transposeDown( song )}>
								<span className="icon is-small"><i className="fa fa-minus"/></span>
							</a>
						]}

						<KeySelector
							onSelect={( key, amount ) => this.changeKey( song._id, amount )}
							value={key}
						/>

						{mode === 'edit' && [

							<a className="button is-small is-white" title="transpose up"
							   onClick={() => this.transposeUp( song )}>

								<span className="icon is-small"><i className="fa fa-plus"/></span>
							</a>
						]}


					</div>

				</td>

				{mode === 'edit' && (
					<td>
						<a
							onClick={() => this.onMoveSongUp( song._id )}
							title="move this song up the list">
							<span className="icon is-small is-left"><i className="fa fa-arrow-up"/></span>
						</a>
						<a
							onClick={() => this.removeSong( song._id )}
							title="remove this song from the list">
							<span className="icon is-small is-left"><i className="fa fa-trash"/></span>
						</a>
					</td>
				)}
			</tr>
		);

	};
}

export default SetViewer;
