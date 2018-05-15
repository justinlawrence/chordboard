import React, {Component} from 'react';
import {find, findIndex} from 'lodash';
import {Link, matchPath, withRouter} from 'react-router-dom';

import {db} from 'database';
import SongKey from 'app/common/SongKey';
import Song from 'app/common/Song.js';

import './live-bar.scss';


import { withStyles } from 'material-ui/styles';


const styles = theme => ({
	container: {
		display: 'flex',
		flexWrap: 'wrap',
	},
	form: theme.mixins.gutters( {
		paddingBottom: theme.spacing.unit * 2,
		paddingTop: theme.spacing.unit * 2,
		width: 500
	} ),
	formFooter: {
		marginTop: theme.spacing.unit * 2
	},
	deleteButton: {
		color: theme.palette.error.main
	}
});


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
			onGoToPreviousSong,
			classes
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
							key={`section-${section.index}`}
							href={`#section-${section.index}`}
							className="live-bar__section-link song-viewer__section"
							data-section={section.text}
						/>
					) )}

				</div>


				<div className="live-bar__navigation-actions">

					<Link
						className="live-bar__navigation-actions__item"
						to={`/sets/${this.props.match.params.setId}`}
					    title="Setlist">
							<span className="icon"><i className="fa fa-list-ul"/></span>
							Setlist
					</Link>

					<a className="live-bar__navigation-actions__item"
					   onClick={onGoToPreviousSong}>

						<span className="icon"><i className="fa fa-angle-left fa-lg"/></span>

						{previousSongTitle && (
							<React.Fragment>
								<SongKey value={previousSongKey}/>
								{previousSongTitle}
							</React.Fragment>
						)}

					</a>
					<a className="live-bar__navigation-actions__item" onClick={onGoToNextSong}>


						{nextSongTitle && (
							<React.Fragment>
								<SongKey value={nextSongKey}/>
								{nextSongTitle}
							</React.Fragment>
						)}

						<span className="icon"><i className="fa fa-angle-right fa-lg"/></span>

					</a>
				</div>

			</nav>
		) : null;
	}
}

export default withStyles( styles )(withRouter( LiveBar ));
//export default withRouter( LiveBar );

/*

TODO: delete me once you're happy

<a className="live-bar__navigation-actions__item"
	 onClick={onGoToPreviousSong}>

	<span className="icon"><i className="fa fa-angle-left fa-lg"/></span>

	{previousSongTitle && (
		<div className="is-size-7 is-hidden-touch">
			<SongKey value={previousSongKey}/>
			{previousSongTitle}
		</div>
	)}

</a>
<a className="live-bar__navigation-actions__item" onClick={onGoToNextSong}>

	<span className="icon"><i className="fa fa-angle-right fa-lg"/></span>

	{nextSongTitle && (
		<div className="is-size-7 is-hidden-touch">
			<SongKey value={nextSongKey}/>
			{nextSongTitle}
		</div>
	)}
</a>


*/
