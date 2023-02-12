import React, { Component } from 'react'
import { styled } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import uniqBy from 'lodash/fp/uniqBy'

import { parseISO } from 'date-fns'

import {
	Button,
	Container,
	Grid,
	Grow,
	Hidden,
	IconButton,
	List,
	ListItem,
	Stack,
	Typography,
} from '@mui/material'

import * as actions from '../redux/actions'
import DateSignifier from './DateSignifier'
import Hero from './Hero'
import SetSongRow from './SetSongRow'
import SetFormContainer from '../containers/SetFormContainer'
import SongSelectorDialog from '../containers/SongSelectorDialog'
import { Pencil as PencilIcon } from 'mdi-material-ui'

const PREFIX = 'SetViewer'

const classes = {
	form: `${PREFIX}-form`,
	formFooter: `${PREFIX}-formFooter`,
	deleteButton: `${PREFIX}-deleteButton`,
}

const Root = styled('div')(({ theme }) => ({
	[`& .${classes.form}`]: theme.mixins.gutters({
		paddingBottom: theme.spacing(2),
		paddingTop: theme.spacing(2),
		width: 500,
	}),

	[`& .${classes.formFooter}`]: {
		marginTop: theme.spacing(2),
	},

	[`& .${classes.deleteButton}`]: {
		color: theme.palette.error.main,
	},
}))

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
		this.toggleEditMode(false)()
	}

	handleDeleteSet = () => this.props.onRemoveSet && this.props.onRemoveSet()

	handleDragEnd = ({ destination, source }) => {
		const set = { ...this.props.set }
		const setSongs = Array.from(set.songs)

		const [song] = setSongs.splice(source.index, 1)
		setSongs.splice(destination.index, 0, song)

		set.songs = setSongs

		if (set) {
			this.props.setCurrentSetId(set.id)
			this.props.updateSet(set)
		}
	}

	handleSongSelectorClose = setSongs => {
		this.setState({ isSongSelectorVisible: false })
		const set = { ...this.props.set }
		set.songs = uniqBy('id')([...set.songs, ...setSongs])
		this.handleSaveSet(set)
	}

	changeKey = (...args) =>
		this.props.onChangeKey && this.props.onChangeKey(...args)

	toggleEditMode = value => () => this.setState({ mode: value ? 'edit' : '' })

	transposeDown = song => this.changeKey(song.id, -1)
	transposeUp = song => this.changeKey(song.id, 1)

	renderTableContent = (dropProvided = {}) => {
		const { set } = this.props
		const { mode } = this.state
		return (
			<div ref={dropProvided.innerRef} {...dropProvided.droppableProps}>
				{set.songs.length ? (
					set.songs.map((song, index) => (
						<Draggable
							draggableId={song.id}
							index={index}
							isDragDisabled={mode !== 'edit'}
							key={song.id}
						>
							{dragProvided => (
								<div
									ref={dragProvided.innerRef}
									{...dragProvided.draggableProps}
									{...dragProvided.dragHandleProps}
								>
									<SetSongRow
										mode={mode}
										onChangeKey={this.changeKey}
										setId={set.id}
										setKey={song.key}
										songIndex={index}
										songId={song.id}
									/>
								</div>
							)}
						</Draggable>
					))
				) : (
					<ListItem key={'id-none'}>
						<Typography variant={'h6'}>
							Este cancionero no tiene canciones
						</Typography>
					</ListItem>
				)}
				{dropProvided.placeholder}
			</div>
		)
	}

	render() {
		const { set } = this.props
		const { mode, isSongSelectorVisible } = this.state
		if (!(set.setDate instanceof Date) && !isNaN(set.setDate)) {
			console.log(
				'TODO: setviewer needs work - setDate is not a javascript date'
			)
			set.setDate = parseISO(set.setDate)
		}

		return set ? (
			<Root className={'set-viewer'}>
				<Hero>
					<Grid container spacing={1}>
						<Grid item xs>
							{mode === 'edit' ? (
								<SetFormContainer
									initialValues={{
										author: set.author,
										setDate: set.setDate,
										title: set.title,
										venue: set.venue,
									}}
									onCancel={this.toggleEditMode(false)}
									onDelete={this.handleDeleteSet}
									onSubmit={this.handleSaveSet}
									isEdit
								/>
							) : (
								<Grid container spacing={3}>
									<Hidden mdDown>
										<Grid item>
											<Grow
												in={Boolean(set.setDate)}
												mountOnEnter
											>
												<div>
													{set.setDate && (
														<DateSignifier
															date={set.setDate}
														/>
													)}
												</div>
											</Grow>
										</Grid>
									</Hidden>
									<Grid item>
										<Typography
											variant={'h4'}
											sx={{ fontWeight: 700 }}
										>
											{set.title}
										</Typography>
										<Typography variant={'caption'}>
											{set.author}
											{set.venue ? ' @ ' + set.venue : ''}
										</Typography>
									</Grid>
								</Grid>
							)}
						</Grid>

						{mode !== 'edit' && (
							<Grid item>
								<Stack direction={'row'} spacing={2}>
									<Hidden smUp>
										<IconButton
											size={'small'}
											variant={'contained'}
											aria-label={'Edit'}
											onClick={this.toggleEditMode(
												mode !== 'edit'
											)}
										>
											<PencilIcon />
										</IconButton>
									</Hidden>
									<Hidden only={'xs'}>
										<Button
											onClick={this.toggleEditMode(
												mode !== 'edit'
											)}
											variant={'outlined'}
										>
											Editar Cancionero
										</Button>
									</Hidden>
									<Button
										color={'primary'}
										onClick={this.handleAddASong}
										variant={'contained'}
									>
										<Hidden only={'xs'}>Agregar cancion</Hidden>
										<Hidden smUp>Add</Hidden>
									</Button>
								</Stack>
							</Grid>
						)}

						<Grid item>
							<SongSelectorDialog
								onClose={this.handleSongSelectorClose}
								open={isSongSelectorVisible}
							/>
						</Grid>
					</Grid>
				</Hero>

				<section className={'section'}>
					<Container maxWidth={'xl'}>
						<List className={classes.table}>
							<DragDropContext onDragEnd={this.handleDragEnd}>
								<Droppable droppableId={'droppable'}>
									{provided => (
										<>{this.renderTableContent(provided)}</>
									)}
								</Droppable>
							</DragDropContext>
						</List>
					</Container>
				</section>
			</Root>
		) : null
	}
}

const mapStateToProps = (state, ownProps) => ({
	set: state.sets.byId[ownProps.setId],
})

export default connect(mapStateToProps, actions)(SetViewer)
