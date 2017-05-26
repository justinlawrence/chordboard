import slugify from 'slugify';
import './Navbar.scss';

class Navbar extends PreactComponent {
	render( { index, songList } ) {

		const prevSong = songList[ index - 1 ];
		const nextSong = songList[ index + 1 ];

		return (
			<div class="navbar">
				<div class="nav-title">Chordboard</div>
				<a href="/songs" class="nav-button">Songs</a>
				{ prevSong ?
					<a href={`/songs/${slugify(prevSong.title)}`}
					   class="nav-button prev-button">&lt;</a>
					: null }
				{ nextSong ?
					<a href={`/songs/${slugify(nextSong.title)}`}
					   class="nav-button next-button">&gt;</a>
					: null }
			</div>
		);

	}
}

export default Navbar;