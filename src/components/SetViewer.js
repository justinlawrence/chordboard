import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { find, findIndex } from 'lodash'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import PouchDB from 'pouchdb'

import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Grow from '@material-ui/core/Grow'
import IconButton from '@material-ui/core/IconButton'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Typography from '@material-ui/core/Typography'
import {
	ArrowUp as ArrowUpIcon,
	ArrowDown as ArrowDownIcon,
	Delete as DeleteIcon,
	Minus as MinusIcon,
	Plus as PlusIcon
} from 'mdi-material-ui'

import * as actions from '../redux/actions'
import DateSignifier from './DateSignifier'
import Hero from './Hero'
import KeySelector from './KeySelector'
import SetFormContainer from '../containers/SetFormContainer'
import SongSelectorDialog from '../containers/SongSelectorDialog'

const styles = theme => ({
	container: {
		display: 'flex',
		flexWrap: 'wrap'
	},
	form: theme.mixins.gutters({
		paddingBottom: theme.spacing.unit * 2,
		paddingTop: theme.spacing.unit * 2,
		width: 500
	}),
	formFooter: {
		marginTop: theme.spacing.unit * 2
	},
	deleteButton: {
		color: theme.palette.error.main
	}
})

const db = new PouchDB('chordboard')

class SetViewer extends Component {
	static propTypes = {
		classes: PropTypes.object,
		history: PropTypes.object,
		onChangeKey: PropTypes.func,
		onRemoveSet: PropTypes.func,
		onRemoveSong: PropTypes.func,
		onSongMove: PropTypes.func,
		set: PropTypes.object.isRequired,
		user: PropTypes.object,
		// Redux props
		updateSet: PropTypes.func.isRequired
	}

	state = {
		isLoading: false,
		isSongSelectorVisible: false,
		mode: ''
	}

	componentDidMount() {
		this.handleProps(this.props)
	}

	componentWillReceiveProps(nextProps) {
		this.handleProps(nextProps)
	}

	handleProps = props => {
		const { set } = props
		console.log('SetViewer.handleProps - set', set)
		document.title = 'Set: ' + set.title
	}

	handleAddASong = () => this.setState({ isSongSelectorVisible: true })

	handleSaveSet = data => {
		data.id = this.props.set.id
		this.props.updateSet(data)
	}

	handleDeleteSet = () => {
		if (this.props.onRemoveSet) {
			this.props.onRemoveSet()
		}
	}

	handleSongSelectorClose = value => {
		this.setState({ isSongSelectorVisible: false })
		const set = { ...this.props.set }
		set.songs = set.songs || []
		set.songs.push(value)
		this.handleSaveSet(set)
	}

	onMoveSongDown = songId => {
		const index = findIndex(this.props.set.songs, { _id: songId })

		if (index > -1) {
			if (this.props.onSongMove) {
				this.props.onSongMove(songId, index + 1)
			}
		}
	}

	onMoveSongUp = songId => {
		const index = findIndex(this.props.set.songs, { _id: songId })

		if (index > -1) {
			if (this.props.onSongMove) {
				this.props.onSongMove(songId, index - 1)
			}
		}
	}

	changeKey = (songId, amount) => {
		if (this.props.onChangeKey) {
			this.props.onChangeKey(songId, amount)
		}
	}

	removeSong = songId => {
		if (this.props.onRemoveSong) {
			this.props.onRemoveSong(songId)
		}
	}

	toggleEditMode = value => () => this.setState({ mode: value ? 'edit' : '' })

	transposeDown = song => this.changeKey(song._id, -1)
	transposeUp = song => this.changeKey(song._id, 1)

	render() {
		const { set, classes } = this.props
		const { mode, isSongSelectorVisible } = this.state
		return (
			set && (
				<div className="set-viewer">
					<Hero>
						<Grid container spacing={8}>
							<Grid item xs>
								{mode === 'edit' ? (
									<SetFormContainer
										initialValues={{
											author: set.author,
											date: set.setDate,
											title: set.title
										}}
										onCancel={this.toggleEditMode(false)}
										onDelete={this.handleDeleteSet}
										onSubmit={this.handleSaveSet}
										isEdit
									/>
								) : (
									<Grid container spacing={24}>
										<Grid item className="is-hidden-mobile">
											<Grow in={Boolean(set.setDate)} mountOnEnter>
												<div>
													<DateSignifier date={set.setDate} />
												</div>
											</Grow>
										</Grid>
										<Grid item>
											<Typography variant="h6" gutterBottom>
												{set.title}
											</Typography>
											<Typography gutterBottom>{set.author}</Typography>
										</Grid>
									</Grid>
								)}
							</Grid>
							<Grid item>
								<Button
									onClick={this.toggleEditMode(mode !== 'edit')}
									variant="contained"
								>
									Edit set
								</Button>
							</Grid>
							<Grid item>
								<Button
									color="primary"
									onClick={this.handleAddASong}
									variant="contained"
								>
									Add a song
								</Button>
								<SongSelectorDialog
									onClose={this.handleSongSelectorClose}
									open={isSongSelectorVisible}
								/>
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
									{set.songs.length ? (
										set.songs.map(this._createRow)
									) : (
										<TableRow key="id-none">
											<TableCell />

											<TableCell>
												<Typography variant="h6">
													This set has no songs
												</Typography>
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</div>
					</section>
				</div>
			)
		)
	}

	_createRow = song => {
		const { set } = this.props
		const { mode } = this.state
		const setSong = find(set.songs, s => s._id === song._id)
		const songCount = findIndex(set.songs, s => s._id === song._id)
		const key = setSong ? setSong.key : song.key

		return (
			<TableRow key={song._id}>
				<TableCell>
					<Link to={`/sets/${set._id}/songs/${song._id}`}>
						<Typography variant="h6" gutterBottom>
							{songCount + 1}. {song.title}
						</Typography>
					</Link>
				</TableCell>

				<TableCell>
					<Grid container>
						<Grid item>
							<KeySelector
								onSelect={(key, amount) => this.changeKey(song._id, amount)}
								songKey={key}
							/>
						</Grid>

						{mode === 'edit' && (
							<Grid item>
								<IconButton
									aria-label="Transpose down"
									onClick={() => this.transposeDown(song)}
								>
									<MinusIcon />
								</IconButton>

								<IconButton
									aria-label="Transpose up"
									onClick={() => this.transposeUp(song)}
								>
									<PlusIcon />
								</IconButton>
							</Grid>
						)}
					</Grid>
				</TableCell>

				{mode === 'edit' && (
					<TableCell>
						<IconButton
							aria-label="Move song up"
							onClick={() => this.onMoveSongUp(song._id)}
						>
							<ArrowUpIcon />
						</IconButton>

						<IconButton
							aria-label="Move song down"
							onClick={() => this.onMoveSongDown(song._id)}
						>
							<ArrowDownIcon />
						</IconButton>

						<IconButton
							aria-label="Remove song"
							onClick={() => this.removeSong(song._id)}
						>
							<DeleteIcon />
						</IconButton>

						<a
							onClick={() => this.onMoveSongUp(song._id)}
							title="move this song up the list"
						>
							<span className="icon is-small is-left">
								<i className="fa fa-arrow-up" />
							</span>
						</a>
						<a
							onClick={() => this.onMoveSongDown(song._id)}
							title="move this song down the list"
						>
							<span className="icon is-small is-left">
								<i className="fa fa-arrow-down" />
							</span>
						</a>
						<a
							onClick={() => this.removeSong(song._id)}
							title="remove this song from the list"
						>
							<span className="icon is-small is-left">
								<i className="fa fa-trash" />
							</span>
						</a>
					</TableCell>
				)}
			</TableRow>
		)
	}
}

export default connect(
	null,
	actions
)(withStyles(styles)(SetViewer))
