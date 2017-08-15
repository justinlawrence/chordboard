import Router from 'preact-router';
import FaAngleLeft from 'preact-icons/lib/fa/angle-left';
import FaAngleRight from 'preact-icons/lib/fa/angle-right';
import './Navbar.scss';

class Navbar extends PreactComponent {
	state = {
		isViewingSong: false
	};

	componentDidMount() {

		this.setState( {
			isViewingSong: this._isViewingSong( Router.getCurrentUrl() )
		} );

		Router.subscribers.push( url => {

			this.setState( {
				isViewingSong: this._isViewingSong( url )
			} );

		} );

	}

	editCurrentSong = () => {

		const url = Router.getCurrentUrl();
		Router.route( `${url}/edit` );

	};

	render( { goToNextSong, goToPreviousSong }, { isViewingSong } ) {

		return (
			<nav class="navbar">
				<div class="navbar__title"><a href='/'>Chordboard</a></div>
				<a href="/songs" class="navbar__button">Songs</a>
				<button class="navbar__button navbar__change-song-button"
				        onClick={goToPreviousSong}><FaAngleLeft/></button>
				<button class="navbar__button navbar__change-song-button"
				        onClick={goToNextSong}><FaAngleRight/></button>
				{isViewingSong ?
					<button
						class="navbar__button"
						onClick={this.editCurrentSong}>
						Edit song
					</button>
					: null}
			</nav>
		);

	}

	_isViewingSong = url => {

		return /songs\/[^/]+$/.test( url );

	};
}

export default Navbar;
