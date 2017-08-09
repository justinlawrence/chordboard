import slugify from 'slugify';
import './SongList.scss';

const SongList = ( { songs } ) => (
	<div class="song-list">

		<div class="song-list__left-column">

				<div class="song-list__search">
					<input type="text"
								 class="song-list__title"
								 placeholder="Search titles and words"
								 value={""}/>
			 </div>

				<div class="song-list__add">
					<a href={`/new`}>
						-- Add a song --
					</a>
				</div>

				{ songs.map( ( song, i ) => (
					<div class="song-list__title">
						<a href={`/songs/${slugify(song.title)}-${i}`}>
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

export default SongList;
