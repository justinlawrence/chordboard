import slugify from 'slugify';
import './SongList.scss';

const SongList = ( { songs } ) => (
	<div class="SongList">
		{ songs.map( ( song, i ) => (
			<div class="songTitle">
				<a href={`/songs/${slugify(song.title)}-${i}`}>
					{song.title}
				</a>
			</div>
		) ) }
	</div>
);

export default SongList;
