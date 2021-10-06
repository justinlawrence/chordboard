import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
	bindMenu,
	bindTrigger,
	usePopupState,
} from 'material-ui-popup-state/hooks'

import {
	IconButton,
	ListItemIcon,
	ListItemText,
	Menu,
	MenuItem,
	Tooltip,
	Typography,
} from '@mui/material'
import {
	MoreVertOutlined as DotsVerticalIcon,
	CreateOutlined as PencilIcon,
	SettingsOutlined as SettingsIcon,
} from '@mui/icons-material'

import SongKeyDialog from './SongKeyDialog'

const SongViewerMenu = ({ isPreview, song }) => {
	const [isDialogOpen, setIsDialogOpen] = useState(false)
	const popupState = usePopupState({
		popupId: 'SongViewerMenu',
		variant: 'popover',
	})

	const handleDialogClose = () => setIsDialogOpen(false)

	const handleDialogOpen = () => setIsDialogOpen(true)

	return (
		<>
			<Tooltip title={'Song menu'}>
				<IconButton {...bindTrigger(popupState)}>
					<DotsVerticalIcon />
				</IconButton>
			</Tooltip>

			<Menu {...bindMenu(popupState)}>
				<MenuItem component={Link} to={`/songs/${song.id}/edit`}>
					<ListItemIcon>
						<PencilIcon />
					</ListItemIcon>
					<ListItemText>Edit song</ListItemText>
					<Typography
						variant={'body2'}
						color={'text.secondary'}
						ml={2}
					>
						⌘X
					</Typography>
				</MenuItem>
				<MenuItem onClick={handleDialogOpen}>
					<ListItemIcon>
						<SettingsIcon />
					</ListItemIcon>
					<ListItemText>Song Settings</ListItemText>
					<Typography
						variant={'body2'}
						color={'text.secondary'}
						ml={2}
					>
						⌘S
					</Typography>
				</MenuItem>
			</Menu>

			{!isPreview ? (
				<SongKeyDialog
					onClose={handleDialogClose}
					open={isDialogOpen}
				/>
			) : null}
		</>
	)
}

export default SongViewerMenu
