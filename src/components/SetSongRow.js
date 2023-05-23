import React from 'react'
import { useHistory } from 'react-router-dom'

import { Box, IconButton, ListItem, Typography, Tooltip } from '@mui/material'
import { Delete as DeleteIcon, Drag as DragIcon } from 'mdi-material-ui'

import KeySelector from './KeySelector'
import { useDeleteSetSong, useSong } from '../data/hooks'

const SetSongRow = ({
	mode,
	onChangeKey,
	setId,
	setKey,
	songIndex,
	songId,
}) => {
	const history = useHistory()
	const { data: song } = useSong(songId)
	const { deleteSetSong } = useDeleteSetSong()

	const handleKeySelect = (key, amount) =>
		onChangeKey && onChangeKey(songId, amount, song.key)

	const handleTableRowClick = () =>
		history.push(`/sets/${setId}/songs/${songId}`)

	const removeSong = event => {
		deleteSetSong(setId, songId)
		event.stopPropagation()
	}

	const stopPropagation = event => event.stopPropagation()

	//FYI the header for this table is in SetViewer.js

	const title = song?.title && song?.content ? song?.title : '** Not found **'

	return (
		<ListItem button dense onClick={handleTableRowClick}>
			{mode === 'edit' && (
				<Tooltip title={'Drag to reorder song'}>
					<DragIcon />
				</Tooltip>
			)}

			<Typography variant={'h6'} sx={{ mr: 3 }}>
				{songIndex + 1}
			</Typography>
			<Typography noWrap variant={'h6'} sx={{ flexGrow: 1 }}>
				{title}
			</Typography>

			<Box onClick={stopPropagation}>
				<KeySelector
					onSelect={handleKeySelect}
					songKey={setKey || song?.key}
				/>
			</Box>

			{/*mode === 'edit' && (
								<Grid item>
									<IconButton
										aria-label="Transpose down"
										onClick={() => transposeDown(song)}
									>
										<MinusIcon />
									</IconButton>

									<IconButton
										aria-label="Transpose up"
										onClick={() => transposeUp(song)}
									>
										<PlusIcon />
									</IconButton>
								</Grid>
							)*/}

			{mode === 'edit' && (
				<Tooltip title={'Remove song from set'}>
					<IconButton
						aria-label={'Remove song'}
						onClick={removeSong}
						size={'large'}
					>
						<DeleteIcon />
					</IconButton>
				</Tooltip>
			)}
		</ListItem>
	)
}

export default SetSongRow
