import './SongList.scss';

class SongList extends PreactComponent {
	state = {
		searchText: ''
	};

	filterSongs = song => {

		// TODO: filter the song list
		// return false to remove song from list
		return song.title.toLowerCase().includes( this.state.searchText );

	};

	handleSearchInput = event => {

		this.setState( {
			searchText: event.target.value
		} );

	};

	render( { songs }, { searchText } ) {

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
									placeholder="Search titles or words"
									value={searchText}/>

								<span class="icon is-small is-left">
					                <i class="fa fa-search"></i>
					            </span>
							</p>
							<p class="control">
								&nbsp;
							</p>

							<p class="control">
								<a href="/new" class="button is-primary">
									New song
								</a>
							</p>

						</div>

						<table class="table is-bordered is-striped is-fullwidth">

							<tbody>

								{ songs.filter( this.filterSongs ).map( ( song, i ) => (
											<tr>
												<td>
													<a href={`/songs/${song.slug}`}>
														{song.title}
													</a>
												</td>
											</tr>
								) ) }

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
