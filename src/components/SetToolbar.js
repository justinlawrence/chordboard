import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import map from 'lodash/map'

import { styled } from '@mui/material/styles'
import { IconButton, Tabs, Tab, Toolbar, Typography } from '@mui/material'

import { firestore } from '../firebase'
import { setCurrentSetId } from '../redux/actions'
import { CloseIcon, SyncOffIcon, SyncOnIcon } from '../icons'

const syncCollection = firestore.collection('set-sync')

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
	[`& .${classes.miniButton}`]: {
		zoom: 0.8,
	},

	[`& .${classes.tabs}`]: {
		flexGrow: 1,
		width: '100%',
	},
}))

const SetToolbar = ({ currentSet, songId, songs }) => {
	const dispatch = useDispatch()
	const history = useHistory()
	const [isSyncOn, setIsSyncOn] = useState(false)

	const currentSetId = currentSet?.id

	useEffect(() => {
		if (isSyncOn && songId) {
			syncCollection
				.doc(currentSetId)
				.set(
					{ song: firestore.collection('songs').doc(songId) },
					{ merge: true }
				)
			return syncCollection.doc(currentSetId).onSnapshot(doc => {
				doc.data()
					.song.get()
					.then(doc => {
						if (songId !== doc.id && doc.id != null) {
							history.push(
								`/sets/${currentSetId}/songs/${doc.id}`
							)
						}
					})
			})
		}
	}, [currentSetId, history, isSyncOn, songId])

	const handleBackClick = () => {
		dispatch(setCurrentSetId(null))
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
				<CloseIcon />
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
					label={'Cancioneros'}
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
