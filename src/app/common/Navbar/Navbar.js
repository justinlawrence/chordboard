import {find} from 'lodash';
import {Link, withRouter} from 'react-router-dom';
import {connect} from 'preact-redux'

import {db} from 'app/common/database';
import SongKey from 'app/common/SongKey';
import SyncStatus from 'app/common/SyncStatus';

import './navbar.scss';

class Navbar extends PreactComponent {
	state = {
		nextSongKey:       '',
		nextSongTitle:     '',
		previousSongKey:   '',
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

			const setSongs = focusedSet.songs;
			const index = this.context.getCurrentSongIndex();
			const keys = [ null, null ];

			const nextSetSong = setSongs && setSongs[ index + 1 ];
			const prevSetSong = setSongs && setSongs[ index - 1 ];

			if ( index > -1 ) {
				if ( prevSetSong ) {
					keys[ 0 ] = prevSetSong._id;
				}
				if ( nextSetSong ) {
					keys[ 1 ] = nextSetSong._id;
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

				if ( nextSetSong ) {
					nextSong.key = nextSetSong.key;
				}
				if ( prevSetSong ) {
					previousSong.key = prevSetSong.key;
				}

				this.setState( {
					nextSongKey:       nextSong ? nextSong.key : '',
					nextSongTitle:     nextSong ? nextSong.title : '',
					previousSongKey:   previousSong ? previousSong.key : '',
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
			nextSongKey,
			nextSongTitle,
			previousSongKey,
			previousSongTitle
		} = this.state;

		return (
			<nav className="navbar is-light">
				{focusedSet ? (
					<div className="level navbar-live">
						<a className="navbar-item navbar-item-stacked"
						   onClick={onGoToPreviousSong}>
							<span className="icon">
								<i className="fa fa-angle-left fa-lg"/>
							</span>
							{previousSongTitle && (
								<p className="is-size-7">
									<SongKey value={previousSongKey}/>
									{previousSongTitle}
								</p>
							)}
						</a>
						<div className="level-item">
							<a className="navbar-item" onClick={onExitLiveMode}>
								<span className="icon">
									<i className="fa fa-close"/>
								</span>
							</a>
						</div>
						<a className="navbar-item navbar-item-stacked"
						   onClick={onGoToNextSong}>
							<span className="icon">
								<i className="fa fa-angle-right fa-lg"/>
							</span>
							{nextSongTitle && (
								<p className="is-size-7">
									<SongKey value={nextSongKey}/>
									{nextSongTitle}
								</p>
							)}
						</a>
					</div>
				) : (
					<div className="container">
						<div className="navbar-brand">
							<Link class="navbar-item" to='/'>
								<img src="/assets/chordboard-logo-long.png"
								     alt="Chordboard: a chord manager for live musicians"
								     width="142"/>
							</Link>
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
				)}
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
