import React from 'react'
import { useSelector } from 'react-redux'
import { isAfter } from 'date-fns'
import filter from 'lodash/filter'
import identity from 'lodash/identity'
import map from 'lodash/map'

import {
	Avatar,
	Button,
	Dialog,
	DialogActions,
	DialogTitle,
	List,
	ListItem,
	ListItemText,
} from '@mui/material'
import { ImageOutlined as ImageIcon } from '@mui/icons-material'

const SetListDialog = ({ onClose, ...other }) => {
	const setList = useSelector(state => map(state.sets.byId, identity))

	const setListActive = filter(setList, set =>
		isAfter(set.setDate, new Date())
	)

	const addToSet = set => {
		// TODO: refactor to use firebase api
		// db.get(set.id)
		// 	.then(doc => {
		// 		const data = {
		// 			...doc
		// 		}
		//
		// 		data.songs = data.songs || []
		// 		data.songs.push({ id: song.id, key: song.key })
		// 		data.songs = uniqBy(data.songs, 'id')
		//
		// 		db.put(data)
		// 			.then(() => {
		// 				if (this.props.history) {
		// 					const location = {
		// 						pathname: `/sets/${doc.id}`
		// 					}
		//
		// 					this.props.history.push(location)
		// 				}
		// 			})
		// 			.catch(err => {
		// 				if (err.name === 'conflict') {
		// 					console.error('SongList.addToSet: conflict -', err)
		// 				} else {
		// 					console.error('SongList.addToSet -', err)
		// 				}
		// 			})
		// 	})
		// 	.catch(err => {
		// 		console.error(err)
		// 	})
	}

	const createSelectSetHandler = set => () => {
		onClose()
		addToSet(set)
	}

	return (
		<Dialog aria-labelledby={'add-to-set-title'} dividers {...other}>
			<DialogTitle id={'add-to-set-title'}>Add to Set</DialogTitle>
			<List>
				{setListActive.map(set => (
					<ListItem
						button
						key={set.id}
						onClick={createSelectSetHandler(set)}
						value={set.id}
					>
						<Avatar>
							<ImageIcon />
						</Avatar>

						<ListItemText
							primary={set.author + ' • ' + set.title}
							secondary={set.setDate}
						/>
					</ListItem>
				))}
			</List>
			<DialogActions>
				<Button onClick={onClose}>Close</Button>
			</DialogActions>
		</Dialog>
	)
}

export default SetListDialog
