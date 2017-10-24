import {uniqBy} from 'lodash';
import PouchDB from 'pouchdb';
import PouchDBFindPlugin from 'pouchdb-find';

import './SongList.scss';

PouchDB.plugin( PouchDBFindPlugin );

const db = new PouchDB( 'chordboard' );

db.createIndex( {
	index: { fields: [ 'type', 'slug' ] }
} );
db.createIndex( {
	index: { fields: [ 'type', 'title' ] }
} );

class SongList extends PreactComponent {
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

				PouchDB.sync( 'chordboard',
					'https://justinlawrence:cXcmbbLFO8@couchdb.cloudno.de/chordboard' )
					.catch( err => {

						console.warn( 'Could not sync to remote database',
							err );

					} );

				if ( this.props.history ) {

					const location = {
						pathname: `/sets/${doc._id}`
					};

					this.props.history.push( location );
				}

			} ).catch( err => {
				console.error( err );
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
			<section class="section">
				<div class="container">
					<div class="columns">

						<div class="column is-three-quarters">


							<div class="field has-addons has-addons-right">

								<p class="control has-icons-left">
									<input
										type="text"
										class="input"
										onInput={this.handleSearchInput}
										placeholder="Titles, words, authors"
										value={searchText}/>

									<span class="icon is-small is-left">
					                <i class="fa fa-search"></i>
					            </span>
								</p>
								<p class="control">
									&nbsp;
								</p>

								<p class="control">
									<a href="/songs/new" class="button is-primary">
										New song
									</a>
								</p>

							</div>

							<table class="table is-bordered is-striped is-fullwidth">

								<tbody>

								{songs.filter( this.filterSongs ).map(
									( song, i ) => (
										<tr>

											<td>

												<a href={`/songs/${song._id}`}>{song.title}</a>
												<span class="help">
														{song.author}
													</span>

											</td>

											<td>
												<span class="help">
													{song.key}
												</span>
											</td>

											{isAddToSet &&
											<td>
												<button class="button is-primary is-outlined"
												        onClick={() => this.addToSet( song )}>
													<span>Add to set</span>
													<span class="icon is-small">
														<i class="fa fa-chevron-right"></i>
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
