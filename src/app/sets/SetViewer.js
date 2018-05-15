import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { find, findIndex } from 'lodash'
import { Link } from 'react-router-dom';
import PouchDB from 'pouchdb';

import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import TextField from 'material-ui/TextField';
import Typography from '@material-ui/core/Typography';
import PencilIcon from 'mdi-material-ui/Pencil';

import DateSignifier from '../../components/DateSignifier';
import Hero from '../../components/Hero';
import KeySelector from 'app/common/KeySelector';



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


const db = new PouchDB( 'chordboard' );

class SetViewer extends Component {
	static propTypes = {
		history: PropTypes.object,
		onChangeKey: PropTypes.func,
		onRemoveSet: PropTypes.func,
		onRemoveSong: PropTypes.func,
		onSongMove: PropTypes.func,
		set: PropTypes.object.isRequired,
		songs: PropTypes.array,
		user: PropTypes.object
	}

	state = {
		isLoading: false,
		mode: '',
		title: '',
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
			setDate: set.setDate
		} );
	};

	handleDateChange = event => {
		this.setState( { setDate: event.target.value } );
	};

	onTitleInput = event => {
		this.setState( { title: event.target.value } );
	};

	handleSaveSet = () => {

		const { title, setDate } = this.state;

		db.get( this.props.set._id ).then( doc => {

			db.put( {
				...doc,
				title: title,
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

		const index = findIndex( this.props.songs, { _id: songId } );

		if ( index > -1 ) {
			if ( this.props.onSongMove ) {
				this.props.onSongMove( songId, index + 1 );
			}
		}

	};

	onMoveSongUp = songId => {

		const index = findIndex( this.props.songs, { _id: songId } );

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
		const { mode, songCount, setDate, title } = this.state;

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
										id="date"
										label="Set date"
										type="date"
										className={classes.textField}
										fullWidth
										onChange={this.handleDateChange}
										InputLabelProps={{
											shrink: true,
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
									<Grid item>
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
								color="primary"
								onClick={this.toggleEditMode( mode !== 'edit' )}
								variant="fab"
							>
								<PencilIcon/>
							</Button>
						</Grid>
					</Grid>
				</Hero>

				<section className="section">
					<div className="container">

						<Grid container justify="flex-end">
							<Grid item>
								<Button
									href={`/songs/add-to-set/${set._id}`}
									onClick={this.handleSaveSet}
									variant="raised"
								>
									Add a song
								</Button>
							</Grid>
						</Grid>

						<Table className={classes.table} aria-labelledby="tableTitle">

							<TableHead>
								<TableRow>
									<TableCell>#</TableCell>
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
										<p className="subtitle">This set has no songs</p>

										<a className="button is-primary"
										   href={`/songs/add-to-set/${set._id}`}>
											Add songs
										</a>
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
					<Typography variant="title" gutterBottom>
						{songCount + 1}.
					</Typography>
				</TableCell>

				<TableCell>
					<Link to={`/sets/${set._id}/songs/${song._id}`}>
							<Typography variant="title" gutterBottom>
								{song.title}
							</Typography>
					</Link>
				</TableCell>

				<TableCell>
					<div className="field is-grouped">

						{mode === 'edit' &&
						<a className="button is-small is-white" title="transpose down"
						   onClick={() => this.transposeDown( song )}>
							<span className="icon is-small"><i className="fa fa-minus"/></span>
						</a>}

						<KeySelector
							onSelect={( key, amount ) => this.changeKey( song._id, amount )}
							value={key}
						/>

						{mode === 'edit' &&
						<a className="button is-small is-white" title="transpose up"
						   onClick={() => this.transposeUp( song )}>

							<span className="icon is-small"><i className="fa fa-plus"/></span>
						</a>}

					</div>
				</TableCell>

				{mode === 'edit' &&
					<TableCell>
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
//export default SetViewer;
