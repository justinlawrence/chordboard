import React, { useState } from 'react'
import { useAtom } from 'jotai'

import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	IconButton,
	Switch,
	Typography,
} from '@mui/material'
import {
	AddOutlined as AddIcon,
	RemoveOutlined as RemoveIcon,
} from '@mui/icons-material'

import { isNashvilleAtom, wordSizeAtom } from './SongViewer'

const SongKeyDialog = ({ onClose, ...other }) => {
	const [isNashville, setIsNashville] = useAtom(isNashvilleAtom)
	const [setWordSize] = useAtom(wordSizeAtom)

	const handleToggleNashville = event => setIsNashville(event.target.checked)

	const handleWordSizeDown = () => setWordSize(prevState => prevState - 1)

	const handleWordSizeUp = () => setWordSize(prevState => prevState + 1)

	return (
		<Dialog aria-labelledby={'songkey-dialog-title'} dividers {...other}>
			<DialogTitle id={'songkey-dialog-title'}>Song Settings</DialogTitle>

			<DialogContent
				dividers
				sx={{
					width: theme => theme.spacing(8 * 7),
				}}
			>
				<Box
					sx={{
						alignItems: 'center',
						display: 'flex',
						justifyContent: 'space-between',
					}}
				>
					<Typography>Word and Chord Size</Typography>

					<Box>
						<IconButton
							aria-label={'Word size down'}
							onClick={handleWordSizeDown}
							size={'large'}
						>
							<RemoveIcon />
						</IconButton>

						<IconButton
							aria-label={'Word size up'}
							onClick={handleWordSizeUp}
							size={'large'}
						>
							<AddIcon />
						</IconButton>
					</Box>
				</Box>
				<Box
					sx={{
						alignItems: 'center',
						display: 'flex',
						justifyContent: 'space-between',
						mt: 2,
					}}
				>
					<Box>
						<Typography>Nashville Numbering</Typography>
						<Typography color={'textSecondary'} variant={'body2'}>
							Show numbers instead of chords
						</Typography>
					</Box>
					<Switch
						aria-label={'Toggle Nashville Numbering'}
						checked={isNashville}
						onClick={handleToggleNashville}
					>
						Toggle
					</Switch>
				</Box>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Close</Button>
			</DialogActions>
		</Dialog>
	)
}

export default SongKeyDialog
