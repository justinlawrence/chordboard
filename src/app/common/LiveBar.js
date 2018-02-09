import React, {Component} from 'react';
import {find, findIndex} from 'lodash';
import {Link, matchPath, withRouter} from 'react-router-dom';

import {db} from 'app/common/database';
import SongKey from 'app/common/SongKey';
import Song from 'app/common/Song.js';

import './live-bar.scss';

class LiveBar extends Component {
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

		const { location } = props;
		const match = matchPath( location.pathname, {
			path: '/sets/:setId/songs/:songId'
		} );

		if ( match ) {

			db.get( match.params.setId ).then( set => {

				const setSongs = set.songs;
				const index = findIndex( set.songs, { _id: match.params.songId } );
				const keys = [ null, null, null ];

				const nextSetSong = setSongs && setSongs[ index + 1 ];
				const prevSetSong = setSongs && setSongs[ index - 1 ];

				if ( match && match.params.songId ) {
					keys[ 1 ] = match.params.songId;
				}

				if ( index > -1 ) {
					if ( prevSetSong ) {
						keys[ 0 ] = prevSetSong._id;
					}
					if ( nextSetSong ) {
						keys[ 2 ] = nextSetSong._id;
					}
				}

				db.allDocs( {
					include_docs: true,
					keys:         keys.filter( k => k )
				} ).then( result => {

					const songs = result.rows
						.map( r => r.doc )
						.filter( r => !!r );

					const currentSong = find( songs, { _id: keys[ 1 ] } );
					const nextSong = find( songs, { _id: keys[ 2 ] } );
					const previousSong = find( songs, { _id: keys[ 0 ] } );

					if ( nextSong && nextSetSong ) {
						nextSong.key = nextSetSong.key;
					}
					if ( previousSong && prevSetSong ) {
						previousSong.key = prevSetSong.key;
					}

					this.setState( {
						currentSong:       currentSong ? new Song( currentSong ) : null,
						nextSongKey:       nextSong ? nextSong.key : '',
						nextSongTitle:     nextSong ? nextSong.title : '',
						previousSongKey:   previousSong ? previousSong.key : '',
						previousSongTitle: previousSong ? previousSong.title : ''
					} );

				} );

			} );

		}

	};

	render() {

		const {
			onExitLiveMode,
			onGoToNextSong,
			onGoToPreviousSong
		} = this.props;

		const {
			currentSong,
			nextSongKey,
			nextSongTitle,
			previousSongKey,
			previousSongTitle
		} = this.state;

		const sections = [];
		let sectionIndex = 0;

		if ( currentSong && currentSong.lines ) {

			currentSong.lines.forEach( line => {

				if ( line.type === 'section' ) {

					sections.push( {
						index: ++sectionIndex,
						text:  line.text
					} );

				}

			} );

		}

		const routes = [
			//'/songs/:id',
			'/sets/:setId/songs/:songsId'
		];
		const { location } = this.props;
		let show = false;

		routes.forEach( path => {

			const match = matchPath( location.pathname, { path } );

			if ( match ) {
				show = true;
			}

		} );

		const match = matchPath( location.pathname, { path: '/sets/:setId/songs/:songsId' } );

		return show ? (
			<nav className="live-bar no-print">

				<div className="live-bar__sections">

					{sections.map( section => (
						<a
							href={`#section-${section.index}`}
							className="live-bar__section-link song-viewer__section"
							data-section={section.text}
						/>
					) )}
					{/* JL: hide the close icon to make room for more song structure.
							<a className="navbar-item" onClick={onExitLiveMode}>
							<span className="icon"><i className="fa fa-close"/></span>
						</a> */}

				</div>

				<Link
					className="navbar-item"
					to={`/sets/${this.props.match.params.setId}`}
				    title="Setlist">
					<span className="icon"><i className="fa fa-list-ul"/></span>
				</Link>

				<div className="live-bar__navigation-actions">
					<a className="live-bar__navigation-actions__item"
					   onClick={onGoToPreviousSong}>

						<span className="icon"><i className="fa fa-angle-left fa-lg"/></span>

						{previousSongTitle && (
							<p className="is-size-7 is-hidden-touch">
								<SongKey value={previousSongKey}/>
								{previousSongTitle}
							</p>
						)}

					</a>
					<a className="live-bar__navigation-actions__item" onClick={onGoToNextSong}>

						<span className="icon"><i className="fa fa-angle-right fa-lg"/></span>

						{nextSongTitle && (
							<p className="is-size-7 is-hidden-touch">
								<SongKey value={nextSongKey}/>
								{nextSongTitle}
							</p>
						)}
					</a>
				</div>

			</nav>
		) : null;
	}
}

export default withRouter( LiveBar );
