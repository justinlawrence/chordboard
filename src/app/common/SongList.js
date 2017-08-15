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
			<div class="song-list">

				<div class="song-list__left-column">

					<div class="song-list__search">
						<input
							type="text"
							class="song-list__title"
							onInput={this.handleSearchInput}
							placeholder="Search titles and words"
							value={searchText}/>
					</div>

					<div class="song-list__add">
						<a href="/new">
							-- Add a song --
						</a>
					</div>

					{ songs.filter( this.filterSongs ).map( ( song, i ) => (
						<div class="song-list__title">
							<a href={`/songs/${song.slug}`}>
								{song.title}
							</a>
						</div>
					) ) }

				</div>
				<div class="song-list__right-column">
					…
				</div>

			</div>
		);

	}
}

export default SongList;
