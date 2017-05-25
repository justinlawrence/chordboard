import slugify from 'slugify';
import './SongList.scss';


class SongList extends PreactComponent {
	render( { songs } ) {

		return (
			<div class="SongList">
				{ songs.map( song => (
					<div class="songTitle">

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
