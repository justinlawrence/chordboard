import React, { useCallback, useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import map from 'lodash/map'

import { styled } from '@mui/material/styles'
import { IconButton, Tabs, Tab, Toolbar, Typography } from '@mui/material'

import { useSongs, useSyncSet } from '../data/hooks'
import { CloseIcon, SyncOffIcon, SyncOnIcon } from '../icons'

const TabLink = ({ children, ...props }) => (
	<Typography component={Link} noWrap {...props}>
		<Typography noWrap sx={{ width: '100%' }}>
			{children}
		</Typography>
	</Typography>
)

const PREFIX = 'SetToolbar'

const classes = {
	miniButton: `${PREFIX}-miniButton`,
	tabs: `${PREFIX}-tabs`,
}

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
	gap: theme.spacing(1),

	[`& .${classes.miniButton}`]: {
		backgroundColor: theme.palette.background.paper,
	},

	[`& .${classes.tabs}`]: {
		flexGrow: 1,
		width: '100%',
	},
}))

const SetToolbar = ({ currentSet, songId }) => {
	const history = useHistory()
	const [isSyncOn, setIsSyncOn] = useState(false)
	const songs = useSongs(currentSet?.songs.map(song => song.id))
	const syncSet = useSyncSet(currentSet?.id, {
		isEnabled: isSyncOn,
		onSync: useCallback(
			({ setId, songId }) => {
				history.push(`/sets/${setId}/songs/${songId}`)
			},
			[history]
		),
	})

	useEffect(() => {
		syncSet(songId)
	}, [songId, syncSet])

	const handleBackClick = () => {
		history.push('/sets')
	}

	const handleSyncClick = () => setIsSyncOn(prevState => !prevState)

	return (
		<StyledToolbar variant={'dense'}>
			<IconButton
				color={'inherit'}
				edge={'start'}
				onClick={handleBackClick}
				className={classes.miniButton}
				size={'large'}
			>
				<CloseIcon fontSize={'small'} />
			</IconButton>
			<Tabs
				className={classes.tabs}
				indicatorColor={'primary'}
				scrollButtons={'auto'}
				value={songId || 0}
				variant={'scrollable'}
			>
				<Tab
					key={'tabs-setlist'}
					component={TabLink}
					to={`/sets/${currentSet.id}`}
					label={'Setlist'}
					color={'inherit'}
					value={0}
					wrapped={false}
				/>

				{map(songs, song => (
					<Tab
						key={`tabs-${song.id}`}
						component={TabLink}
						to={`/sets/${currentSet.id}/songs/${song.id}`}
						label={song.title}
						color={'inherit'}
						value={song.id}
					/>
				))}
			</Tabs>
			<IconButton
				color={'inherit'}
				edge={'end'}
				onClick={handleSyncClick}
				className={classes.miniButton}
				size={'large'}
				sx={{
					color: theme =>
						isSyncOn ? '#ffb300' : theme.palette.text.disabled,
				}}
			>
				{isSyncOn ? <SyncOnIcon /> : <SyncOffIcon />}
			</IconButton>
		</StyledToolbar>
	)
}

export default SetToolbar
