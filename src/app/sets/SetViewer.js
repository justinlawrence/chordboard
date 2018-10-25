import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { find, findIndex } from 'lodash'
import { Link } from 'react-router-dom';
import PouchDB from 'pouchdb';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import DateSignifier from '../../components/DateSignifier';
import Grid from '@material-ui/core/Grid';
import Hero from '../../components/Hero';
import IconButton from '@material-ui/core/IconButton';
import KeySelector from 'app/common/KeySelector';
import Paper from '@material-ui/core/Paper';
import SongKey from '../common/SongKey';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

// JL: why oh why doesn't my consolidated import work???
// import {
// 	Pencil as PencilIcon,
// 	Minus as MinusIcon,
// 	Plus as PlusIcon,
// 	Up as UpIcon,
// 	Down as DownIcon,
// 	Delete as DeleteIcon
// } from 'mdi-material-ui';

import PencilIcon from 'mdi-material-ui/Pencil';
import MinusIcon from 'mdi-material-ui/Minus';
import PlusIcon from 'mdi-material-ui/Plus';
import UpIcon from 'mdi-material-ui/ArrowUp';
import DownIcon from 'mdi-material-ui/ArrowDown';
import DeleteIcon from 'mdi-material-ui/Delete';


const styles = theme => ({
	container: {
		display: 'flex',
		flexWrap: 'wrap'
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


const db = new PouchDB( 'chordboard' );

class SetViewer extends Component {
	static propTypes = {
		history: PropTypes.object,
		onChangeKey: PropTypes.func,
		onRemoveSet: PropTypes.func,
		onRemoveSong: PropTypes.func,
		onSongMove: PropTypes.func,
		set: PropTypes.object.isRequired,
		user: PropTypes.object
	};

	state = {
		isLoading: false,
		mode: '',
		title: '',
		author: '',
		setDate: ''
	};

	componentDidMount() {
		this.handleProps( this.props );
	}

	componentWillReceiveProps( nextProps ) {
		this.handleProps( nextProps );
	}

	handleProps = props => {
		const { set } = props;
		console.log( set );
		this.setState( {
			title: set.title,
			author: set.author,
			setDate: set.setDate
		} );
	};

	handleDateChange = event => {
		this.setState( { setDate: event.target.value } );
	};
	onTitleInput = event => {
		this.setState( { title: event.target.value } );
	};
	onAuthorInput = event => {
		this.setState( { author: event.target.value } );
	};

	handleSaveSet = () => {

		const { title, author, setDate } = this.state;

		db.get( this.props.set._id ).then( doc => {

			db.put( {
				...doc,
				title: title,
				author: author,
				setDate: setDate
			} ).catch( err => {

				if ( err.name === 'conflict' ) {

					console.error( 'SetViewer.handleSaveSet: conflict -', err );

				} else {

					console.error( 'SetViewer.handleSaveSet-', err );

				}

			} );

		} );

	};

	handleDeleteSet = () => {

		if ( this.props.onRemoveSet ) {
			this.props.onRemoveSet();
		}

	};

	onMoveSongDown = songId => {

		const index = findIndex( this.props.set.songs, { _id: songId } );

		if ( index > -1 ) {
			if ( this.props.onSongMove ) {
				this.props.onSongMove( songId, index + 1 );
			}
		}

	};

	onMoveSongUp = songId => {
		const index = findIndex( this.props.set.songs, { _id: songId } );

		if ( index > -1 ) {
			if ( this.props.onSongMove ) {
				this.props.onSongMove( songId, index - 1 );
			}
		}

	};

	changeKey = ( songId, amount ) => {

		if ( this.props.onChangeKey ) {
			this.props.onChangeKey( songId, amount );
		}

	};

	removeSong = songId => {

		if ( this.props.onRemoveSong ) {
			this.props.onRemoveSong( songId );
		}

	};

	toggleEditMode = value => () => this.setState( { mode: value ? 'edit' : '' } );

	transposeDown = song => this.changeKey( song._id, -1 );
	transposeUp = song => this.changeKey( song._id, 1 );

	render() {

		const { set, classes } = this.props;
		const { mode, songCount, setDate, title, author } = this.state;

		return set && (
			<div className="set-viewer">
				<Hero>
					<Grid container justify="space-between">
						<Grid item>
							{mode === 'edit' ? (
								<Paper className={classes.form} component="form">
									<TextField
										id="title"
										label="Set title"
										className={classes.textField}
										fullWidth
										value={title}
										onChange={this.onTitleInput}
										margin="normal"
									/>

									<TextField
										id="author"
										label="Set author"
										className={classes.textField}
										fullWidth
										value={author}
										onChange={this.onAuthorInput}
										margin="normal"
									/>

									<TextField
										id="date"
										label="Set date"
										type="date"
										className={classes.textField}
										fullWidth
										onChange={this.handleDateChange}
										InputLabelProps={{
											shrink: true
										}}
										value={setDate}
									/>

									<Grid
										container
										className={classes.formFooter}
										justify="flex-end"
									>
										<Grid item>
											<Button
												className={classes.deleteButton}
												onClick={this.handleDeleteSet}
											>
												Delete this set
											</Button>
											<Button
												onClick={this.toggleEditMode( false )}
											>
												Cancel
											</Button>
											<Button
												color="primary"
												onClick={this.handleSaveSet}
											>
												Save
											</Button>
										</Grid>
									</Grid>
								</Paper>
							) : (
								<Grid container spacing={24}>
									<Grid item className="is-hidden-mobile">
										<DateSignifier date={set.setDate}/>
									</Grid>
									<Grid item>
										<Typography variant="title" gutterBottom>
											{set.title}
										</Typography>
										<Typography gutterBottom>
											{set.author}
										</Typography>
									</Grid>
								</Grid>
							)}

						</Grid>
						<Grid item>
							<Button
								onClick={this.toggleEditMode( mode !== 'edit' )}
								variant="raised"
							>
								Edit set
							</Button>

							<Button
								href={`/songs/add-to-set/${set._id}`}
								onClick={this.handleSaveSet}
								variant="raised"
							>
								Add a song
							</Button>
						</Grid>


					</Grid>
				</Hero>

				<section className="section">
					<div className="container">

						<Table className={classes.table} aria-labelledby="tableTitle">

							<TableHead>
								<TableRow>
									<TableCell>Song</TableCell>
									<TableCell>Key</TableCell>
								</TableRow>
							</TableHead>

							<TableBody>
								{set.songs.length ?
									set.songs.map( this._createRow )
									:
									<TableRow key="id-none">
										<TableCell/>

										<TableCell>
											<Typography variant="title">
												This set has no songs
											</Typography>



										</TableCell>

										<TableCell>
											<Button
												href={`/songs/add-to-set/${set._id}`}
												onClick={this.handleSaveSet}
												variant="raised"
											>
												Add a song
											</Button>

										</TableCell>

										<TableCell/>

									</TableRow>
								}
							</TableBody>
						</Table>

					</div>

				</section>

			</div>
		);
	}

	_createRow = song => {

		const { set } = this.props;
		const { mode } = this.state;
		const setSong = find( set.songs, s => s._id === song._id );
		const songCount = findIndex( set.songs, s => s._id === song._id );
		const key = setSong ? setSong.key : song.key;

		return (
			<TableRow key={song._id}>


				<TableCell>

					<Link to={`/sets/${set._id}/songs/${song._id}`}>

						<Typography variant="title" gutterBottom>
							{songCount + 1}. {song.title}
						</Typography>
					</Link>

				</TableCell>

				<TableCell>
					<Grid container>

						<Grid item>
							<KeySelector
								onSelect={( key, amount ) => this.changeKey( song._id, amount )}
								songKey={key}
							/>
						</Grid>

						{mode === 'edit' &&

						<Grid item>

							<IconButton
								aria-label="Transpose down"
								onClick={() => this.transposeDown( song )}
								>
							    <MinusIcon />
							</IconButton>

							<IconButton
								aria-label="Transpose up"
								onClick={() => this.transposeUp( song )}
								>
							    <PlusIcon />
							</IconButton>

						</Grid>

					}

					</Grid>
				</TableCell>

				{mode === 'edit' &&

				<TableCell>

					<IconButton
						aria-label="Move song up"
						onClick={() => this.onMoveSongUp( song._id )}
						>
							<UpIcon />
					</IconButton>

					<IconButton
						aria-label="Move song down"
						onClick={() => this.onMoveSongDown( song._id )}
						>
							<DownIcon />
					</IconButton>

					<IconButton
						aria-label="Remove song"
						onClick={() => this.removeSong( song._id )}
						>
							<DeleteIcon />
					</IconButton>

					<a
						onClick={() => this.onMoveSongUp( song._id )}
						title="move this song up the list">
								<span className="icon is-small is-left"><i
									className="fa fa-arrow-up"/></span>
					</a>
					<a
						onClick={() => this.onMoveSongDown( song._id )}
						title="move this song down the list">
							<span className="icon is-small is-left"><i
								className="fa fa-arrow-down"/></span>
					</a>
					<a
						onClick={() => this.removeSong( song._id )}
						title="remove this song from the list">
							<span className="icon is-small is-left"><i
								className="fa fa-trash"/></span>
					</a>
				</TableCell>
				}

			</TableRow>
		);

	};
}

export default withStyles( styles )( SetViewer );
