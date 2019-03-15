import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { findIndex } from 'lodash'
import uniqBy from 'lodash/fp/uniqBy'

import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Grow from '@material-ui/core/Grow'
import RootRef from '@material-ui/core/RootRef'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Typography from '@material-ui/core/Typography'

import * as actions from '../redux/actions'
import DateSignifier from './DateSignifier'
import Hero from './Hero'
import SetSong from '../components/SetSong'
import SetFormContainer from '../containers/SetFormContainer'
import SongSelectorDialog from '../containers/SongSelectorDialog'

const styles = theme => ({
	container: {
		display: 'flex',
		flexWrap: 'wrap',
	},
	form: theme.mixins.gutters({
		paddingBottom: theme.spacing.unit * 2,
		paddingTop: theme.spacing.unit * 2,
		width: 500,
	}),
	formFooter: {
		marginTop: theme.spacing.unit * 2,
	},
	deleteButton: {
		color: theme.palette.error.main,
	},
})

class SetViewer extends Component {
	static propTypes = {
		classes: PropTypes.object,
		history: PropTypes.object,
		onChangeKey: PropTypes.func,
		onRemoveSet: PropTypes.func,
		onSongMove: PropTypes.func,
		user: PropTypes.object,
		// Redux props
		set: PropTypes.object,
		updateSet: PropTypes.func.isRequired,
	}

	state = {
		isLoading: false,
		isSongSelectorVisible: false,
		mode: '',
	}

	componentDidMount() {
		this.handleProps({})
	}

	componentDidUpdate(prevProps) {
		this.handleProps(prevProps)
	}

	handleProps = prevProps => {
		const { set } = this.props
		if (set && prevProps.set && prevProps.set.title !== set.title) {
			document.title = 'Set: ' + set.title
		}
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

	handleDragEnd = ({ destination, source }) => {}

	handleSongSelectorClose = setSongs => {
		this.setState({ isSongSelectorVisible: false })
		const set = { ...this.props.set }
		set.songs = uniqBy('id')([...set.songs, ...setSongs])
		this.handleSaveSet(set)
	}

	onMoveSongDown = songId => {
		const index = findIndex(this.props.set.songs, { id: songId })

		if (index > -1) {
			if (this.props.onSongMove) {
				this.props.onSongMove(songId, index + 1)
			}
		}
	}

	onMoveSongUp = songId => {
		const index = findIndex(this.props.set.songs, { id: songId })

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

	toggleEditMode = value => () => this.setState({ mode: value ? 'edit' : '' })

	transposeDown = song => this.changeKey(song.id, -1)
	transposeUp = song => this.changeKey(song.id, 1)

	render() {
		const { set, classes } = this.props
		const { mode, isSongSelectorVisible } = this.state
		return set ? (
			<div className="set-viewer">
				<Hero>
					<Grid container spacing={8}>
						<Grid item xs>
							{mode === 'edit' ? (
								<SetFormContainer
									initialValues={{
										author: set.author,
										date: set.setDate,
										title: set.title,
									}}
									onCancel={this.toggleEditMode(false)}
									onDelete={this.handleDeleteSet}
									onSubmit={this.handleSaveSet}
									isEdit
								/>
							) : (
								<Grid container spacing={24}>
									<Grid item className="is-hidden-mobile">
										<Grow
											in={Boolean(set.setDate)}
											mountOnEnter
										>
											<div>
												<DateSignifier
													date={set.setDate}
												/>
											</div>
										</Grow>
									</Grid>
									<Grid item>
										<Typography variant="h4">
											{set.title}
										</Typography>
										<Typography variant="caption">
											{set.author}
										</Typography>
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
						<Table
							className={classes.table}
							aria-labelledby="tableTitle"
						>
							<TableHead>
								<TableRow>
									<TableCell>Song</TableCell>
									<TableCell>Key</TableCell>
								</TableRow>
							</TableHead>

							<DragDropContext onDragEnd={this.handleDragEnd}>
								<Droppable droppableId="droppable">
									{provided => (
										<RootRef rootRef={provided.innerRef}>
											<TableBody
												{...provided.droppableProps}
											>
												{set.songs.length ? (
													set.songs.map(
														(song, index) => (
															<Draggable
																draggableId={
																	song.id
																}
																index={index}
																key={song.id}
															>
																{provided => (
																	<SetSong
																		mode={
																			mode
																		}
																		onChangeKey={
																			this
																				.changeKey
																		}
																		provided={
																			provided
																		}
																		setId={
																			set.id
																		}
																		setKey={
																			song.key
																		}
																		songIndex={
																			index
																		}
																		songId={
																			song.id
																		}
																	/>
																)}
															</Draggable>
														)
													)
												) : (
													<TableRow key="id-none">
														<TableCell />

														<TableCell>
															<Typography variant="h6">
																This set has no
																songs
															</Typography>
														</TableCell>
													</TableRow>
												)}
											</TableBody>
										</RootRef>
									)}
								</Droppable>
							</DragDropContext>
						</Table>
					</div>
				</section>
			</div>
		) : null
	}
}

const mapStateToProps = (state, ownProps) => ({
	set: state.sets.byId[ownProps.setId],
})

export default connect(
	mapStateToProps,
	actions
)(withStyles(styles)(SetViewer))
