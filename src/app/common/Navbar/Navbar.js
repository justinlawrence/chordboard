import slugify from 'slugify';
import './Navbar.scss';

const Navbar = ( { goToNextSong, goToPreviousSong } ) => (
	<div class="navbar">
		<div class="nav-title"><a href='/'>Chordboard</a></div>
		<a href="/songs" class="nav-button">Songs</a>
		<button class="nav-button prev-button"
		        onClick={goToPreviousSong}>&lt;</button>
		<button class="nav-button next-button"
		        onClick={goToNextSong}>&gt;</button>
	</div>
);

export default Navbar;
