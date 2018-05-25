import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { includes, uniqBy } from 'lodash';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import cx from 'classnames';

import * as actions from '../../actions';
import { Sets, db, sync } from 'database';
import KeySelector from 'app/common/KeySelector';
import getKeyDiff from 'app/common/getKeyDiff';
import ChordLine from "./lines/ChordLine.js";
import ChordPair from "./lines/ChordPair.js";
import Line from "./lines/Line.js";
import Parser from 'app/parsers/song-parser.js';
import transposeChord from '../common/transpose-chord';
import transposeLines from '../common/transpose-lines';

import Grid from '@material-ui/core/Grid';
import Hero from '../../components/Hero';
import Typography from '@material-ui/core/Typography';


import './SongViewer.scss';

const convertToNashville = ( key, lines ) => {

	const newLines = [];

	console.log( lines );

	lines.forEach( line => {

		const newLine = { ...line };

		if ( line.chords ) {

			const newChords = { ...line.chords };
			delete newChords._sort;

			Object.keys( newChords ).forEach( k => {

				if ( line.chords[ k ] ) {

					newChords[ k ] = getKeyDiff( key, line.chords[ k ] ) + 1;
					if ( includes( [ 2, 3, 7 ], newChords[ k ] ) ) {
						newChords[ k ] += 'm';
					}

				}

			} );

			newLine.chords = { ...newChords, _sort: line.chords._sort };

		}

		newLines.push( newLine );

	} );

	return newLines;

};

class SongViewer extends Component {
	static propTypes = {
		setKey: PropTypes.string
	};

	state = {
		capoAmount: 0,
		isNashville: false, // ### jl
		isSetListDropdownVisible: false,
		key: '',
		lines: [],
		setList: []
	};

	componentDidMount() {

		// Update an initial list when the component mounts.
		this.updateListOfSets();

		//Set the page title to the song title
		document.title = this.props.song.title;

		// Listen for any changes on the database.
		sync.on( "change", this.updateListOfSets.bind( this ) );

		this.handleProps( this.props );

		const songId = this.props.song._id;
		const setId = this.props.currentSet._id;
		console.log( 'songId', songId );
		console.log( 'setId', setId );

	}

	componentWillReceiveProps( nextProps ) {
		this.handleProps( nextProps );
	}

	componentWillUnmount() {
		sync.cancel();
	}

	addToSet = set => {

		const { song } = this.props;

		db.get( set._id ).then( doc => {

			const data = { ...doc };

			data.songs = data.songs || [];
			data.songs.push( {
				_id: song._id,
				key: song.key
			} );
			data.songs = uniqBy( data.songs, '_id' );

			db.put( data ).then( () => {

				if ( this.props.history ) {

					const location = {
						pathname: `/sets/${doc._id}`
					};

					this.props.history.push( location );
				}

			} ).catch( err => {

				if ( err.name === 'conflict' ) {

					console.error( 'SongList.addToSet: conflict -', err );

				} else {

					console.error( 'SongList.addToSet -', err );

				}

			} );

		} ).catch( err => {
			console.error( err );
		} );

	};

	handleProps = props => {

		const songUser = props.song.users && props.song.users.find( u => u.id === props.user.id ) || {};

		console.log( 'song key', props.song.key );
		console.log( 'set key', props.setKey );
		console.log( 'user key', songUser.key );

		const key = songUser.key || props.setKey || props.song.key;

		const parser = new Parser();
		const lines = parser.parse( props.song.content );

		this.setState( { key, lines } );

	};

	scrollToSection( section ) {

		let totalVertPadding = 32;
		let headerHeight = 92;

		location.href = '#';
		location.href = '#section-' + section.index;

		let scrollBottom = window.innerHeight - document.body.scrollTop + totalVertPadding;

		if ( headerHeight < scrollBottom ) {

			// Go back 92 pixels to offset the header.
			window.scrollBy( 0, -headerHeight );

		}

	}

	changeKey = amount => {
		const key = transposeChord( this.state.key, amount );
		this.props.setCurrentSongUserKey( key );
	};

	setListDropdownHide = () => this.setState( { isSetListDropdownVisible: false } );
	setListDropdownShow = () => this.setState( { isSetListDropdownVisible: true } );
	setListDropdownToggle = () => this.state.isSetListDropdownVisible ?
		this.setListDropdownHide() : this.setListDropdownShow();

	transposeDown = () => this.changeKey( 1 );
	transposeUp = () => this.changeKey( -1 );

	updateListOfSets = () => Sets.getAll().then( setList => this.setState( { setList } ) );

	render() {

		const {
			isNashville,
			isSetListDropdownVisible,
			key,
			lines: linesState,
			setList
		} = this.state;

		const song = { ...this.props.song };
		const setKey = this.props.setKey || song.key;

		const capo = getKeyDiff( key, setKey ); //this is only for display purposes, telling the user where to put the capo
		const transposeAmount = getKeyDiff( song.key, key ); //this is how much to transpose by

		let lines = linesState;
		if ( isNashville ) {
			lines = convertToNashville( setKey, lines );
		} else {
			lines = transposeLines( linesState, transposeAmount );
		}


		let sections = [];

		return (
			song ?
				<div className="song-viewer">
					<Hero>
						<Grid container justify="space-between">
							<Grid item>
								<Typography variant="display2">
									{song.title}
								</Typography>
								<Typography variant="title">
									{song.author}
								</Typography>
								<Typography>
									Set key: {this.props.setKey} • Capo: {capo}
								</Typography>

							</Grid>

							<Grid item className="column no-print">

								{/*<a className="button">Key of {song.key}</a>*/}

								<div className="field has-addons">


									<div className="control">

										<a className="button" onClick={this.transposeDown}
										   title="transpose down">
														<span className="icon is-small">
															 <i className="fa fa-minus"/>
														</span>
										</a>

									</div>
									<div className="control">
										<KeySelector
											onSelect={( key, amount ) => this.changeKey( amount )}
											value={key}/>
									</div>

									<div className="control">
										<a className="button" onClick={this.transposeUp}
										   title="transpose up">
														<span className="icon is-small">
														 <i className="fa fa-plus"/>
														</span>
											+
										</a>
									</div>


									<div className="control">
										<Link className="button"
										      to={`/songs/${song._id}/edit`}>
													<span className="icon is-small"><i
														className="fa fa-pencil"/></span>
											<span>Edit Song</span>
										</Link>
									</div>

									<div className="control">
										<div className={cx(
											'dropdown',
											{ 'is-active': isSetListDropdownVisible }
										)}>
											<div className="dropdown-trigger"
											     onClick={this.setListDropdownToggle}>
												<button className="button"
												        aria-haspopup="true"
												        aria-controls="dropdown-menu">
															<span className="icon is-small">
																<i className="fa fa-plus-square-o"/>
															</span>
													<span>Add to set</span>
													<span className="icon is-small">
													            <i className="fa fa-angle-down"
													               aria-hidden="true"/>
													        </span>
												</button>
											</div>
											<div className="dropdown-menu"
											     id="set-list-dropdown-menu"
											     onClick={this.setListDropdownHide}
											     role="menu"
											>
												<div className="dropdown-content">
													{setList.map( set => (
														<a className="dropdown-item"
														   key={set._id}
														   onClick={() => this.addToSet( set )}>
															{set.title}
														</a>
													) )}
												</div>

											</div>
										</div>
									</div>

								</div>

							</Grid>
						</Grid>

					</Hero>

					<section className="section">
						<div className="container">
							<div className="song-viewer__song">
								{parseSong( lines, sections )}
							</div>
						</div>
					</section>
				</div>
				: null
		);

	}
}

const mapStateToProps = state => ( {
	currentSet: state.currentSet,
	song: state.currentSong,
	user: state.user
} );

export default connect( mapStateToProps, actions )( SongViewer );

//-----------------------------------------------------

export function parseSong( lines, sections ) {

	let children = [];
	let result = [];
	let section = '';
	let sectionIndex = 0;

	for ( let i = 0; i < lines.length; i++ ) {

		let line = lines[ i ];

		switch ( lines[ i ].type ) {

			case 'chord-line':
				children.push(
					<ChordLine key={i} chords={line.chords}/> );
				break;

			case 'chord-pair':
				children.push(
					<ChordPair key={i} chords={line.chords} text={line.text}/> );
				break;

			case 'empty':
				children.push(
					<div key={i} className="empty-line"/> );
				break;

			case 'line':
				children.push(
					<Line key={i} text={line.text}/> );
				break;

			case 'section':

				if ( section ) {

					// Finish off last section
					result.push(
						<section
							id={`section-${sectionIndex}`}
							key={`section-${sectionIndex}`}
							className="song-viewer__section"
							data-section={section}
						>{children}</section>
					);
					children = [];

				} else {

					result = result.concat( children );

				}

				section = line.text;
				sections.push( {
					title: line.text,
					index: sectionIndex
				} );

				sectionIndex++;

				break;

		}

	} //end of loop through lines

	if ( section ) {

		result.push( <section id={`section-${sectionIndex}`}
		                      key={`section-${sectionIndex}`}
		                      className="song-viewer__section"
		                      data-section={section}>{children}</section> );

	}

	if ( children.length && !section ) {

		result = result.concat( children );

	}

	return result;

}
