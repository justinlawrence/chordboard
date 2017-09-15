import Router from 'preact-router';
import PouchDB from 'pouchdb';
import PouchDBFindPlugin from 'pouchdb-find';
import './SongList.scss';

PouchDB.plugin( PouchDBFindPlugin );

const db = new PouchDB( 'chordboard' );

db.createIndex( {
	index: { fields: [ 'type', 'slug' ] }
} );

class SongList extends PreactComponent {
	state = {
		searchText: ''
	};

	addToSet = song => {

		const slug = this.props.slug;

		// First check to see if the slug already exists.
		db.find( {
			selector: {
				type: 'set',
				slug: slug
			}
		} ).then( result => {

			if ( result.docs.length ) {

				const set = result.docs[ 0 ];
				const data = Object.assign( {}, set );

				data.songs = data.songs || [];
				data.songs.push( song._id );

				db.put( data ).then( () => {

					PouchDB.sync( 'chordboard',
						'https://justinlawrence:cXcmbbLFO8@couchdb.cloudno.de/chordboard' )
						.catch( err => {

							console.warn( 'Could not sync to remote database',
								err );

						} );

					Router.route( `/sets/${set.slug}` );

				} ).catch( err => {
					console.error( err );
				} );

			}

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

	render( { path, slug, songs }, { searchText } ) {

		const isAddToSet = /\/add-to-set\//.test( path );

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
												<a href={`/songs/${song.slug}`}>
													{song.title}
												</a>
											</td>
											<td>
												{song.author}
											</td>
											{isAddToSet &&
											<td>
												<button class="button is-primary is-outlined"
												        onClick={() => this.addToSet(
													        song )}>
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
