import { Dialog, DialogContent, DialogTitle } from '@mui/material'

import SongForm from './SongForm'
import { useAddSong } from '../data/hooks'

const AddSongDialog = props => {
	const { addSong } = useAddSong()

	const handleSubmit = async data => {
		const song = await addSong(data)
		props.onClose && props.onClose(song, 'addSongSuccess')
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
