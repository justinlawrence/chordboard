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

const PREFIX = 'SetToolbar'

const classes = {
	miniButton: `${PREFIX}-miniButton`,
	tabs: `${PREFIX}-tabs`,
	tab: `${PREFIX}-tab`,
}

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
	[`& .${classes.miniButton}`]: {
		zoom: 0.8,
	},

	[`& .${classes.tabs}`]: {
		flexGrow: 1,
		width: '100%',
	},

	[`& .${classes.tab}`]: {
		root: {
			padding: 0,
		},
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
					component={Link}
					to={`/sets/${currentSet.id}`}
					label={
						<Typography variant={'button'} noWrap>
							Setlist
						</Typography>
					}
					className={classes.tab}
					color={'inherit'}
					value={0}
				/>

				{map(songs, song => (
					<Tab
						key={`tabs-${song.id}`}
						component={Link}
						to={`/sets/${currentSet.id}/songs/${song.id}`}
						label={
							<Typography variant={'button'} noWrap>
								{song.title}
							</Typography>
						}
						className={classes.tab}
						color={'inherit'}
						value={song.id}
					/>
				))}
			</Tabs>
			<IconButton
				color={'inherit'}
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
