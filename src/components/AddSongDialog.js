import { Dialog, DialogContent, DialogTitle } from '@mui/material'

import SongForm from './SongForm'

const AddSongDialog = props => {
	return (
		<Dialog {...props}>
			<DialogTitle>Add song</DialogTitle>
			<DialogContent>
				<SongForm onCancel={props?.onClose} />
			</DialogContent>
		</Dialog>
	)
}

export default AddSongDialog
