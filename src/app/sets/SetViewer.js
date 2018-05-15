import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { find, findIndex } from 'lodash'
import { Link } from 'react-router-dom';

import Grid from 'material-ui/Grid';

import DateSignifier from '../../components/DateSignifier';
import KeySelector from 'app/common/KeySelector';

import PouchDB from 'pouchdb';


import TextField from '@material-ui/core/TextField';
import { withStyles } from 'material-ui/styles';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 500,
		stroke: 'red'
  },
  menu: {
    width: 500,
  },
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

	onTitleInput = event => {
		this.setState( { title: event.target.value } );
	};

	onSetDateInput = event => {
		this.setState( { setDate: event.target.value } );
	};

	onSaveSet = () => {

		const { title, setDate } = this.state;

		db.get( this.props.set._id ).then( doc => {

			db.put( {
				...doc,
				title: title,
				setDate: setDate
			} ).catch( err => {

				if ( err.name === 'conflict' ) {

					console.error( 'SetViewer.onSaveSet: conflict -', err );

				} else {

					console.error( 'SetViewer.onSaveSet-', err );

				}

			} );

		} );

	};


	editModeOff = () => this.setState( { mode: '' } );
	editModeOn = () => this.setState( { mode: 'edit' } );

	onDeleteSet = () => {

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

	transposeDown = song => this.changeKey( song._id, -1 );
	transposeUp = song => this.changeKey( song._id, 1 );

	render() {

		const { set, classes } = this.props;
		const { mode, songCount, setDate, title } = this.state;

		return set && (
			<div className="set-viewer">
				<section className="hero is-small is-light">
					<div className="hero-body">
						<div className="container">
							<div className="columns is-vcentered">

								<div className="column is-three-quarters">

									{mode === 'edit' ? (


										<div>
											<div className="field">

												<TextField
																	id="title"
																	label="Set title"
																	className={classes.textField}
																	value={title}
																	onChange={this.onTitleInput}
																	margin="normal"
																/>

												<TextField
												        id="date"
												        label="Set date"
												        type="date"
												        defaultValue="2017-05-24"
												        className={classes.textField}
												        InputLabelProps={{
												          shrink: true,
												        }}
												      />


												<p className="control has-icons-left">

													<input
														type="text"
														className="input"
														onChange={this.onTitleInput}
														placeholder="Title"
														value={title}/>

													<span className="icon is-small is-left">
														<i className="fa fa-chevron-right"/>
													</span>

												</p>

											</div>

											<div className="field">
												<p className="control has-icons-left">

													<input
														type="date"
														className="input"
														onChange={this.onSetDateInput}
														placeholder="Set Date"
														value={setDate}/>

													<span className="icon is-small is-left">
														 <i className="fa fa-chevron-right"/>
													</span>

												</p>

											</div>


											<div className="field">
												<p className="control">

													{mode === 'edit' ? (

															<a className="button is-outlined"
															   onClick={this.onDeleteSet}>
																<span className="icon is-small is-left"><i
																	className="fa fa-trash"/></span>
															</a>


													) : (
														<span></span>
													)}

													<a className="button is-primary" onClick={this.onSaveSet}>Save</a>

												</p>

												</div>

										</div>

									) : (
										<Grid container spacing={24}>
											<Grid item>
												<DateSignifier date={set.setDate}/>
											</Grid>
											<Grid item>
												<p className="title">
													{set.title}
												</p>
												<h2 className="subtitle">
													{set.author}
												</h2>
											</Grid>
										</Grid>
									)}

								</div>

								<div className="column">

									<div className="field has-addons">
										<p className="control">
											{mode === 'edit' ? (
												<a className="button is-primary"
												   onClick={this.editModeOff}>
													<span className="icon is-small">
														<i className="fa fa-sliders"/>
													</span>
												</a>
											) : (
												<a className="button" onClick={this.editModeOn}>
														<span className="icon is-small">
															<i className="fa fa-sliders"/>
														</span>
												</a>
											)}
										</p>
										<p className="control">
											<a className="button"
											   href={`/songs/add-to-set/${set._id}`}>
												Add songs
											</a>
										</p>

									</div>
								</div>
							</div>

						</div>

					</div>
				</section>


				<section className="section">
					<div className="container">

						<table className="table is-bordered is-striped is-fullwidth">

							<tbody>
							{set.songs.length ?
								set.songs.map( this._createRow )
								:
								<tr>
									<td>
										<p className="subtitle">This set has no songs</p>

										<a className="button is-primary"
										   href={`/songs/add-to-set/${set._id}`}>
											Add songs
										</a>
									</td>

								</tr>
							}
							</tbody>

						</table>

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
			<tr key={song._id}>

				<td className="title is-4">
					{songCount + 1}
				</td>

				<td className="title is-4">
					<Link to={`/sets/${set._id}/songs/${song._id}`}>
						{song.title}
					</Link>
				</td>

				<td>
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
				</td>

				{mode === 'edit' &&
				<React.Fragment>
					<td>
						<a
							onClick={() => this.onMoveSongUp( song._id )}
							title="move this song up the list">
								<span className="icon is-small is-left"><i
									className="fa fa-arrow-up"/></span>
						</a>
					</td>
					<td>
						<a
							onClick={() => this.onMoveSongDown( song._id )}
							title="move this song down the list">
							<span className="icon is-small is-left"><i
								className="fa fa-arrow-down"/></span>
						</a>
					</td>
					<td>
						<a
							onClick={() => this.removeSong( song._id )}
							title="remove this song from the list">
							<span className="icon is-small is-left"><i
								className="fa fa-trash"/></span>
						</a>
					</td>
				</React.Fragment>}

			</tr>
		);

	};
}

export default withStyles(styles)(SetViewer);
//export default SetViewer;
