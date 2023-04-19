import { Dialog, DialogContent, DialogTitle } from '@mui/material'

import SongForm from './SongForm'

const AddSongDialog = props => {
	const handleSubmit = data => {
		// TODO: send data to firebase
		console.log('AddSongDialog', data)
	}

	return (
		<Dialog fullWidth {...props}>
			<DialogTitle>Add song</DialogTitle>
			<DialogContent>
				<SongForm onCancel={props?.onClose} onSubmit={handleSubmit} />
			</DialogContent>
		</Dialog>
	)
}

export default AddSongDialog
