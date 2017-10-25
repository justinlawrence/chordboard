import {find} from 'lodash';
import {Link, withRouter} from 'react-router-dom';
import {connect} from 'preact-redux'

import {db} from 'app/common/database';
import SyncStatus from 'app/common/SyncStatus';

import './navbar.scss';

class Navbar extends PreactComponent {
	state = {
		nextSongTitle:     '',
		previousSongTitle: ''
	};

	componentDidMount() {
		this.handleProps( this.props );
	}

	componentWillReceiveProps( nextProps ) {
		this.handleProps( nextProps );
	}

	handleProps = props => {

		const { focusedSet } = props;

		if ( focusedSet ) {

			const songs = focusedSet.songs;
			const index = this.context.getCurrentSongIndex();
			const keys = [ null, null ];

			if ( index > -1 ) {
				if ( songs[ index - 1 ] ) {
					keys[ 0 ] = songs[ index - 1 ]._id;
				}
				if ( songs[ index + 1 ] ) {
					keys[ 1 ] = songs[ index + 1 ]._id;
				}
			}

			db.allDocs( {
				include_docs: true,
				keys:         keys.filter( k => k )
			} ).then( result => {

				const songs = result.rows
					.map( r => r.doc )
					.filter( r => !!r );

				const nextSong = find( songs, { _id: keys[ 1 ] } );
				const previousSong = find( songs, { _id: keys[ 0 ] } );

				this.setState( {
					nextSongTitle:     nextSong ? nextSong.title : '',
					previousSongTitle: previousSong ? previousSong.title : ''
				} );

			} );

		}

	};

	render() {

		const {
			focusedSet,
			onExitLiveMode,
			onGoToNextSong,
			onGoToPreviousSong,
			syncState
		} = this.props;

		const {
			nextSongTitle,
			previousSongTitle
		} = this.state;

		return (
			<nav className="navbar is-light">
				<div className="container">
					<div className="navbar-brand">

						{focusedSet ? [
							<Link class="navbar-item" to='/'>
								<img src="/assets/chordboard-logo-short.png"
								     alt="Chordboard: a chord manager for live musicians"
								     width="33"/>
							</Link>,
							<p className="navbar-item">{focusedSet.title}</p>,
							previousSongTitle && (
								<a className="navbar-item navbar-item-stacked"
								   onClick={onGoToPreviousSong}>
									<span className="icon">
										<i className="fa fa-angle-left fa-lg"/>
									</span>
									<p className="is-size-7">
										{previousSongTitle}
									</p>
								</a>
							),
							nextSongTitle && (
								<a className="navbar-item navbar-item-stacked"
								   onClick={onGoToNextSong}>
									<span className="icon">
										<i className="fa fa-angle-right fa-lg"/>
									</span>
									<p className="is-size-7">
										{nextSongTitle}
									</p>
								</a>
							),
							<a className="navbar-item" onClick={onExitLiveMode}>
							<span className="icon">
							<i className="fa fa-close"/>
							</span>
							</a>
						] : (
							<Link class="navbar-item" to='/'>
								<img src="/assets/chordboard-logo-long.png"
								     alt="Chordboard: a chord manager for live musicians"
								     width="142"/>
							</Link>
						)}

						<div className="navbar-burger">
							<span></span><span></span><span></span>
						</div>

					</div>

					<div className="navbar-menu is-active">
						<div className="navbar-start">

							<Link class="navbar-item" to="/sets">Sets</Link>
							<Link class="navbar-item" to="/songs">Songs</Link>

							{focusedSet && (
								<Link
									class="navbar-item"
									to={`/sets/${focusedSet._id}`}
								>Live</Link>
							)}
						</div>
						<div className="navbar-end">
							<p className="navbar-item">
								<SyncStatus
									className="is-size-7 has-text-grey-light"
									status={syncState}/>
							</p>
						</div>
					</div>
				</div>
			</nav>
		);

	}
}

const mapStateToProps = state => {
	return {
		syncState: state.syncState
	};
};

const mapDispatchToProps = dispatch => {
	return {};
};

export default withRouter( connect( mapStateToProps, mapDispatchToProps )( Navbar ) );
