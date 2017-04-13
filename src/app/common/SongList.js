import slugify from 'slugify';

class SongList extends PreactComponent {
	render( { songs } ) {

		return (
			<div class="SongList">
				{ songs.map( song => (
					<div>
						<a href={`/song/${slugify(song.title)}`}>
							{song.title}
						</a>
					</div>
				) ) }
			</div>
		);

	}
}

export default SongList;