import {Link} from 'react-router-dom';

class Navbar extends PreactComponent {

	render( { focusedSet, goToNextSong, goToPreviousSong, mode } ) {

		return (
			<nav class="navbar is-light">

				<div class="navbar-brand">

					{mode === 'live' && [

						<a class="navbar-item" href='/'>
							<img src="/assets/chordboard-logo-short.png"
							     alt="Chordboard: a chord manager for live musicians"
							     width="33"/>
						</a>,

						<p class="navbar-item">{focusedSet.title}</p>,
						<a class="navbar-item" onClick={goToPreviousSong}>
							<span class="icon"><i class="fa fa-angle-left"></i></span>
						</a>,
						<a class="navbar-item" onClick={goToNextSong}>
							<span class="icon"><i class="fa fa-angle-right"></i></span>
						</a>,
						<a class="navbar-item" onClick={this.setDefaultMode}>
							<span class="icon"><i class="fa fa-close"></i></span>
						</a>
					]}

					<Link class="navbar-item" to='/'>
						<img src="/assets/chordboard-logo-long.png"
						     alt="Chordboard: a chord manager for live musicians"
						     width="142"/>
					</Link>
					<Link class="navbar-item" to="/sets">Sets</Link>
					<Link class="navbar-item" to="/songs">Songs</Link>

					{focusedSet && focusedSet.slug && (
						<Link class="navbar-item" to={`/sets/${focusedSet.slug}`}>Live</Link>
					)}
				</div>

			</nav>
		);

	}
}

export default Navbar;
