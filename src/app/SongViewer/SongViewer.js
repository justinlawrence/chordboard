import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { find, isEmpty } from 'lodash';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ButtonBase from '@material-ui/core/ButtonBase';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import Fade from '@material-ui/core/Fade';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import { Sets, db, sync } from 'database';
import * as actions from '../../actions';
import ChordLine from "./lines/ChordLine";
import ChordPair from "./lines/ChordPair";
import ContentLimiter from '../../components/ContentLimiter';
import getKeyDiff from 'app/common/getKeyDiff';
import Hero from '../../components/Hero';
import { includes, uniqBy } from 'lodash';
import KeySelector from 'app/common/KeySelector';
import Line from "./lines/Line";
import Paper from '@material-ui/core/Paper';
import Parser from 'app/parsers/song-parser';
import Song from '../../components/Song';
import SongKey from 'app/common/SongKey';
import transposeChord from '../common/transpose-chord';
import transposeLines from '../common/transpose-lines';

import { linesToNashville } from '../../utils/convertToNashville';
import './SongViewer.scss';

import {
	Minus as MinusIcon,
	FilePlus as FilePlusIcon,
	Plus as PlusIcon,
	Pencil as PencilIcon,
	Settings as SettingsIcon
} from 'mdi-material-ui';

const styles = theme => ( {
	capoButton: {
		borderRadius: 3,
		flexDirection: 'column',
		padding: theme.spacing.unit
	},
	root: {
		flexGrow: 1
	},
	paper: {
		padding: theme.spacing.unit * 2,
		height: '100%',
		color: theme.palette.text.secondary
	},
	control: {
		padding: theme.spacing.unit * 2
	},
	select: {
		width: theme.spacing.unit * 7
	}
} );

class SongViewer extends Component {
	static propTypes = {
		setKey: PropTypes.string
	};

	state = {
		capoAmount: 0,
		chordSize: 16,
		isNashville: false,
		isSongKeyDialogOpen: false,
		setListMenuAnchorEl: null,
		displayKey: '',
		lines: [],
		setList: [],
		wordSize: 20
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

			const data = {
				...doc
			};

			data.songs = data.songs || [];
			data.songs.push( { _id: song._id, key: song.key } );
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

	createAddToSetHandler = set => () => this.addToSet( set );

	handleSelectSetKey = ( option, amount ) => {
		const { currentSet, song } = this.props;
		db.get( currentSet._id ).then( doc => {

			const setSong = find( doc.songs, { _id: song._id } );
			setSong.key = option.key;

			db.put( doc ).catch( err => {

				if ( err.name === 'conflict' ) {

					console.error( 'SongList.addToSet: conflict -', err );

				} else {

					console.error( 'SongList.addToSet -', err );

				}

			} );

		} ).catch( console.error );
	};

	handleSelectDisplayKey = ( option ) => {

		this.setState( { displayKey: option.key } );

		if ( option.value === 'nashville' ) {
			this.setState( { isNashville: true } );
		} else {
			this.changeKey( option.key );
			this.setState( { isNashville: false } );
		}

	};

	handleSongKeyDialogClose = () => this.setState( { isSongKeyDialogOpen: false } );
	handleSongKeyDialogOpen = () => this.setState( { isSongKeyDialogOpen: true } );

	handleProps = props => {

		const songUser = props.song.users && props.song.users.find( u => u.id === props.user.id ) || {};

		/*console.log( 'song key', props.song.key );
				console.log( 'set key', props.setKey );
				console.log( 'user key', songUser.key );*/

		const displayKey = songUser.key || props.setKey || props.song.key;

		const parser = new Parser();
		const lines = parser.parse( props.song.content );

		this.setState( { displayKey, lines } );

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

	changeKey = key => {
		if ( key ) {
			this.setState( { displayKey: key } );
			this.props.setCurrentSongUserKey( key );
		}
	};

	chordSizeDown = () => this.setState( prevState => ( { chordSize: prevState.chordSize - 1 } ) );
	chordSizeUp = () => this.setState( prevState => ( { chordSize: prevState.chordSize + 1 } ) );

	showSetListDropdown = isVisible => event => this.setState( {
		setListMenuAnchorEl: isVisible
			? event.currentTarget
			: null
	} );

	transposeDown = () => {
		this.changeKey( transposeChord( this.state.displayKey, -1 ) )
	};
	transposeUp = () => {
		this.changeKey( transposeChord( this.state.displayKey, 1 ) )
	};

	wordSizeDown = () => this.setState( prevState => ( { wordSize: prevState.wordSize - 1 } ) );
	wordSizeUp = () => this.setState( prevState => ( { wordSize: prevState.wordSize + 1 } ) );

	toggleNashville = value => () => this.setState( prevState => ( {
		isNashville: value !== undefined
			? value
			: !prevState.isNashville
	} ) );

	updateListOfSets = () => Sets.getAll().then( setList => this.setState( { setList } ) );

	render() {

		const { classes, setKey, song, onClose } = this.props;
		const {
			chordSize,
			isNashville,
			isSongKeyDialogOpen,
			setListMenuAnchorEl,
			displayKey,
			lines: linesState,
			setList,
			wordSize
		} = this.state;

		const capo = getKeyDiff( displayKey, setKey || song.key ); //this is only for display purposes, telling the user where to put the capo
		const transposeAmount = getKeyDiff( song.key, displayKey ); //this is how much to transpose by

		let lines = transposeLines( linesState, transposeAmount );
		if ( isNashville ) {
			lines = linesToNashville( displayKey, lines );
		}

		let sections = [];

		let capoKeyDescr = '';

		if (capo) {
				capoKeyDescr = 'Capo ' + capo;
		} else {
				capoKeyDescr = 'Capo key';
		}

		return (
			<Fade in={Boolean( song )} appear mountOnEnter unmountOnExit>
				<div className="song-viewer">
					<Hero>
						<ContentLimiter>

							<Grid container className={classes.root} justify="space-between">

								<Grid item xs={12} sm={8}>
									<Typography variant="display1"
									            color="inherit">{song.title}</Typography>
									<Typography variant="subheading">{song.author}</Typography>
								</Grid>


								<Grid item xs={12} sm={4}>


									<form autoComplete="off">



										{	setKey &&

												<Tooltip title="The key everyone will be playing in">
													<KeySelector label="Set key"
												             onSelect={this.handleSelectSetKey}
												             songKey={setKey}/>
												 </Tooltip>
										}

										<Tooltip title="The key you will be playing in">
												<KeySelector label={capoKeyDescr}
												             onSelect={this.handleSelectDisplayKey}
												             songKey={displayKey}
																	 className={classes.select}/>

									 </Tooltip>


										<Tooltip title="Edit song">
											<IconButton className={classes.button} href={`/songs/${song._id}/edit`} >
												<PencilIcon />
											</IconButton>
										</Tooltip>

											<Tooltip title="Song settings">
												<IconButton className={classes.button} onClick={this.handleSongKeyDialogOpen} >
													<SettingsIcon />
												</IconButton>
											</Tooltip>


											<Tooltip title="Add to set">
												<IconButton className={classes.button} onClick={this.showSetListDropdown( true )}>
													<FilePlusIcon />
												</IconButton>
											</Tooltip>

											<Menu anchorEl={setListMenuAnchorEl}
														onClose={this.showSetListDropdown( false )}
														open={Boolean( setListMenuAnchorEl )}>
												{
													setList.map( set => (
														<MenuItem key={set._id}
																			onClick={this.createAddToSetHandler}
																			value={set._id}>
															{set.title}
														</MenuItem> ) )
												}
											</Menu>

									</form>

								</Grid>



							</Grid>
						</ContentLimiter>

					</Hero>

					<ContentLimiter>
						<section className="section">
							<div className="container">
								<Song chordSize={chordSize} lines={lines} wordSize={wordSize}/>
								{/*<div className="song-viewer__song">
									{parseSong( lines, sections, chordSize )}
								</div>*/}
							</div>
						</section>
					</ContentLimiter>

					<Dialog aria-labelledby="songkey-dialog-title"
					        onClose={this.handleSongKeyDialogClose} open={isSongKeyDialogOpen}>

						<DialogTitle id="songkey-dialog-title">Song Settings</DialogTitle>

						<Paper className={classes.control}>

							<Grid container className={classes.root}>


								<Grid item xs={12}>
									<Grid container spacing={16}>

										<Grid item xs={6}>
											<Typography variant="subheading">Capo Key</Typography>
										</Grid>

										<Grid item xs={6}>
											<IconButton aria-label="Transpose down"
																 onClick={this.transposeDown}>
											 <MinusIcon/>
											</IconButton>

											<IconButton aria-label="Transpose up"
																 onClick={this.transposeUp}>
											 <PlusIcon/>
											</IconButton>
											<KeySelector
														 onSelect={this.handleSelectDisplayKey}
														 songKey={displayKey}/>


										 </Grid>
									 </Grid>
								 </Grid>



								<Grid item xs={12}>
									<Grid container spacing={16}>

										<Grid item xs={6}>
											<Typography variant="subheading">Word Size</Typography>
										</Grid>

										<Grid item xs={6}>

											<IconButton aria-label="Word size down"
											            onClick={this.wordSizeDown}>
												<MinusIcon/>
											</IconButton>

											<IconButton aria-label="Word size up"
											            onClick={this.wordSizeUp}>
												<PlusIcon/>
											</IconButton>

										</Grid>
									</Grid>
								</Grid>

								<Grid item xs={12}>
									<Grid container spacing={16}>

										<Grid item xs={6}>
											<Typography variant="subheading">Chord Size</Typography>
										</Grid>

										<Grid item xs={6}>

											<IconButton aria-label="Chord size down"
											            onClick={this.chordSizeDown}>
												<MinusIcon/>
											</IconButton>

											<IconButton aria-label="Chord size up"
											            onClick={this.chordSizeUp}>
												<PlusIcon/>
											</IconButton>

										</Grid>
									</Grid>
								</Grid>

								<Grid item xs={12}>
									<Grid container spacing={16}>

										<Grid item xs={6}>
											<Typography variant="subheading">Nashville
												Numbering</Typography>
										</Grid>

										<Grid item xs={6}>

											<Button variant="contained"
											        aria-label="Toggle Nashville Numbering"
											        onClick={this.toggleNashville()}>
												Toggle
											</Button>

										</Grid>
									</Grid>
								</Grid>

							</Grid>

						</Paper>
					</Dialog>
				</div>

			</Fade> );
	}
}

const mapStateToProps = state => ( {
	currentSet: state.currentSet,
	song: state.currentSong,
	user: state.user
} );

export default connect( mapStateToProps, actions )( withStyles( styles )( SongViewer ) );

export function parseSong( lines, sections, chordSize ) {

	let children = [];
	let result = [];
	let section = '';
	let sectionIndex = 0;

	for ( let i = 0; i < lines.length; i++ ) {

		let line = lines[ i ];

		switch ( lines[ i ].type ) {

			case 'chord-line':
				children.push( <ChordLine key={i} chords={line.chords}/> );
				break;

			case 'chord-pair':
				children.push( <ChordPair key={i} chords={line.chords} text={line.text}/> );
				break;

			case 'empty':
				children.push( <div key={i} className="empty-line"/> );
				break;

			case 'line':
				children.push( <Line key={i} text={line.text}/> );
				break;

			case 'section':

				if ( section ) {

					// Finish off last section
					result.push( <section id={`section-${sectionIndex}`}
					                      key={`section-${sectionIndex}`}
					                      className="song-viewer__section"
					                      data-section={section}>{children}</section> );
					children = [];

				} else {

					result = result.concat( children );

				}

				section = line.text;
				sections.push( { title: line.text, index: sectionIndex } );

				sectionIndex++;

				break;

		}

	} //end of loop through lines

	if ( section ) {

		result.push( <section id={`section-${sectionIndex}`} key={`section-${sectionIndex}`}
		                      className="song-viewer__section"
		                      data-section={section}>{children}</section> );

	}

	if ( children.length && !section ) {

		result = result.concat( children );

	}

	return result;

}
