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

	/*
	<section class="section">
		<div class="container">
			<h1 class="title">
				Hello World
			</h1>
			<p class="subtitle">
				My first website with <strong>Bulma</strong>!
			</p>
		</div>
	</section>

	*/

	render( { songs }, { searchText } ) {

		return (
			<div class="columns">

				<div class="column is-three-quarters">

					<div class="table">
						<div class="tbody">

							<div class="tr">
								<div class="td">
									<div class="control">
										<input
											type="text"
											class="input"
											onInput={this.handleSearchInput}
											placeholder="Search titles and words"
											value={searchText}/>
									</div>
								</div>
								<div class="td">
									<a href="/new" class="button is-primary">
										New song
									</a>
								</div>
							</div>


							{ songs.filter( this.filterSongs ).map( ( song, i ) => (
										<div class="tr">
											<div class="td">
												<a href={`/songs/${song.slug}`}>
													{song.title}
												</a>
											</div>
										</div>
							) ) }

						</div>
				</div>


				<div class="column">

				</div>
			</div>

			</div>
		);

	}
}

export default SongList;
