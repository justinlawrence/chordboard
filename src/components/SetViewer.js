import React, { useEffect, useState } from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import uniqBy from 'lodash/fp/uniqBy'
import { useHistory } from 'react-router-dom'

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
import { styled } from '@mui/material/styles'

import { useUpdateSet } from '../data/hooks'
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
	[`& .${classes.form}`]: {
		padding: theme.spacing(2),
		width: 500,

		[theme.breakpoints.up('sm')]: {
			paddingLeft: theme.spacing(3),
			paddingRight: theme.spacing(3),
		},
	},

	[`& .${classes.formFooter}`]: {
		marginTop: theme.spacing(2),
	},

	[`& .${classes.deleteButton}`]: {
		color: theme.palette.error.main,
	},
}))

const SetViewer = ({ currentSet, onChangeKey, onRemoveSet }) => {
	const [mode, setMode] = useState('')
	const [isSongSelectorVisible, setIsSongSelectorVisible] = useState(false)
	const { updateSet } = useUpdateSet()
	const history = useHistory()

	useEffect(() => {
		if (currentSet?.title) {
			document.title = 'Set: ' + currentSet.title
		}
	}, [currentSet?.title])

	const handleAddASong = () => setIsSongSelectorVisible(true)

	const handleSaveSet = data => {
		updateSet(currentSet.id, data)
		toggleEditMode(false)()
	}

	const handleDeleteSet = () => onRemoveSet && onRemoveSet()

	const handleDragEnd = ({ destination, source }) => {
		const set = { ...currentSet }
		const setSongs = Array.from(set.songs)

		const [song] = setSongs.splice(source.index, 1)
		setSongs.splice(destination.index, 0, song)

		set.songs = setSongs

		if (set) {
			history.push('/set/' + set.id)
			updateSet(set)
		}
	}

	const handleSongSelectorClose = setSongs => {
		setIsSongSelectorVisible(false)
		const set = { ...currentSet }
		set.songs = uniqBy('id')([...set.songs, ...setSongs])
		handleSaveSet(set)
	}

	const changeKey = (...args) => onChangeKey && onChangeKey(...args)

	const toggleEditMode = value => () => setMode(value ? 'edit' : '')

	// const transposeDown = song => changeKey(song.id, -1)
	// const transposeUp = song => changeKey(song.id, 1)

	const renderTableContent = (dropProvided = {}) => {
		return (
			<div ref={dropProvided.innerRef} {...dropProvided.droppableProps}>
				{currentSet?.songs?.length ? (
					currentSet.songs.map((song, index) => (
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
										onChangeKey={changeKey}
										setId={currentSet.id}
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
							This set has no songs
						</Typography>
					</ListItem>
				)}
				{dropProvided.placeholder}
			</div>
		)
	}

	/* if (!(currentSet?.setDate instanceof Date) && !isNaN(currentSet?.setDate)) {
		console.log(
			'TODO: setviewer needs work - setDate is not a javascript date'
		)
		currentSet.setDate = parseISO(currentSet.setDate)
	} */

	return currentSet ? (
		<Root className={'set-viewer'}>
			<Hero>
				<Grid container spacing={1}>
					<Grid item xs>
						{mode === 'edit' ? (
							<SetFormContainer
								initialValues={{
									author: currentSet.author,
									setDate: currentSet.setDate,
									title: currentSet.title,
									venue: currentSet.venue,
								}}
								onCancel={toggleEditMode(false)}
								onDelete={handleDeleteSet}
								onSubmit={handleSaveSet}
								isEdit
							/>
						) : (
							<Grid container spacing={3}>
								<Hidden mdDown>
									<Grid item>
										<Grow
											in={Boolean(currentSet.setDate)}
											mountOnEnter
										>
											<div>
												{currentSet.setDate && (
													<DateSignifier
														date={
															currentSet.setDate
														}
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
										{currentSet.title}
									</Typography>
									<Typography variant={'caption'}>
										{currentSet.author}
										{currentSet.venue
											? ' @ ' + currentSet.venue
											: ''}
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
										onClick={toggleEditMode(
											mode !== 'edit'
										)}
									>
										<PencilIcon />
									</IconButton>
								</Hidden>
								<Hidden only={'xs'}>
									<Button
										onClick={toggleEditMode(
											mode !== 'edit'
										)}
										variant={'outlined'}
									>
										Edit set
									</Button>
								</Hidden>
								<Button
									color={'primary'}
									onClick={handleAddASong}
									variant={'contained'}
								>
									<Hidden only={'xs'}>Add a song</Hidden>
									<Hidden smUp>Add</Hidden>
								</Button>
							</Stack>
						</Grid>
					)}

					<Grid item>
						<SongSelectorDialog
							onClose={handleSongSelectorClose}
							open={isSongSelectorVisible}
						/>
					</Grid>
				</Grid>
			</Hero>

			<section className={'section'}>
				<Container maxWidth={'xl'}>
					<List className={classes.table}>
						<DragDropContext onDragEnd={handleDragEnd}>
							<Droppable droppableId={'droppable'}>
								{renderTableContent}
							</Droppable>
						</DragDropContext>
					</List>
				</Container>
			</section>
		</Root>
	) : null
}

export default SetViewer
