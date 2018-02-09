import React, {Component} from 'react';
import {uniqBy} from 'lodash';

import {db} from 'app/common/database';

import './SongList.scss';

class SongList extends Component {
	state = {
		searchText: ''
	};

	addToSet = song => {

		db.get( this.props.id ).then( doc => {

			const data = Object.assign( {}, doc );

			data.songs = data.songs || [];
			data.songs.push( {
				_id: song._id,
				key: song.key
			} );
			console.log( data.songs );
			data.songs = uniqBy( data.songs, '_id' );
			console.log( data.songs );

			db.put( data ).then( () => {

				if ( this.props.history ) {

					const location = {
						pathname: `/sets/${doc._id}`
					};

					this.props.history.push( location );
				}

			} ).catch( err => {

				if ( err.name === 'conflict' ) {

					console.error( 'SongList.addToSet: conflict -', err );

				} else {

					console.error( 'SongList.addToSet -', err );

				}

			} );

		} ).catch( err => {
			console.error( err );
		} );

	};

	filterSongs = song => {

		return song.title.toLowerCase().includes(
			this.state.searchText ) || song.content.toLowerCase().includes(
			this.state.searchText ) || song.author.toLowerCase().includes(
			this.state.searchText );

	};

	handleSearchInput = event => {

		this.setState( {
			searchText: event.target.value
		} );

	};

	render( { songs }, { searchText } ) {

		//const isAddToSet = /\/add-to-set\//.test( path );
		const isAddToSet = /\/add-to-set\//.test( window.location.href );

		return (
			<section className="section">
				<div className="container">
					<div className="columns">

						<div className="column is-three-quarters">


							<div className="field has-addons has-addons-right">

								<p className="control has-icons-left">
									<input
										type="text"
										className="input"
										onInput={this.handleSearchInput}
										placeholder="Titles, words, authors"
										value={searchText}/>

									<span className="icon is-small is-left">
					                <i className="fa fa-search"></i>
					            </span>
								</p>
								<p className="control">
									&nbsp;
								</p>

								<p className="control">
									<a href="/songs/new" className="button is-primary">
										New song
									</a>
								</p>

							</div>

							<table className="table is-bordered is-striped is-fullwidth">

								<tbody>

								{songs.filter( this.filterSongs ).map(
									( song, i ) => (
										<tr>

											<td>

												<a href={`/songs/${song._id}`}>{song.title}</a>
												<span className="help">
														{song.author}
													</span>

											</td>

											<td>
												<span className="help">
													{song.key}
												</span>
											</td>

											{isAddToSet &&
											<td>
												<button className="button is-primary is-outlined"
												        onClick={() => this.addToSet( song )}>
													<span>Add to set</span>
													<span className="icon is-small">
														<i className="fa fa-chevron-right"></i>
												    </span>
												</button>
											</td>
											}
										</tr>
									) )}

								</tbody>

							</table>

						</div>

					</div>
				</div>
			</section>
		);

	}
}

export default SongList;
