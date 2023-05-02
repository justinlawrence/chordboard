import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import map from 'lodash/map'
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore'

import { styled } from '@mui/material/styles'
import { IconButton, Tabs, Tab, Toolbar, Typography } from '@mui/material'

import { firestore } from '../firebase'
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
	const [songs, setSongs] = useState([])

	const currentSetId = currentSet?.id

	useEffect(() => {
		const songDocs = currentSet.songs.map(song =>
			getDoc(doc(firestore, 'songs', song.id))
		)
		Promise.all(songDocs).then(docs => {
			setSongs(docs.map(doc => ({ id: doc.id, ...doc.data() })))
		})
	}, [currentSet.songs])

	useEffect(() => {
		if (isSyncOn && songId) {
			setDoc(
				doc(firestore, 'set-sync', currentSetId),
				{ song: doc(firestore, 'songs', songId) },
				{ merge: true }
			)
			return onSnapshot(doc(firestore, 'set-sync', currentSetId), doc => {
				getDoc(doc.data().song).then(doc => {
					if (songId !== doc.id && doc.id != null) {
						history.push(`/sets/${currentSetId}/songs/${doc.id}`)
					}
				})
			})
		}
	}, [currentSetId, history, isSyncOn, songId])

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
