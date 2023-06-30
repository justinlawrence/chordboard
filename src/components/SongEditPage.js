import { useCallback, useState } from 'react'

import { Grid } from '@mui/material'

import SongForm from './SongForm'
import SongViewer from './SongViewer'
import Parser from '../parsers/song-parser'
import chordproParser from '../parsers/chordpro-parser'

const parser = new Parser()

const SongEditPage = ({ songId }) => {
	const [songPreview, setSongPreview] = useState(null)

	const handleCancel = useCallback(() => {
		// TODO: navigate back
		console.log('handleCancel')
	}, [])

	const handleChange = useCallback(data => {
		let parsedContent = data.content
		if (data.parserType === 'chordpro') {
			parsedContent = chordproParser(data.content)
		}

		setSongPreview({
			...data,
			content: parsedContent,
			lines: parser.parse(parsedContent),
		})
	}, [])

	const handleSubmit = useCallback(data => {
		// TODO: save song
		console.log('handleSubmit', data)
	}, [])

	return (
		<Grid container>
			<Grid item xs={12} md={6}>
				<SongForm
					onCancel={handleCancel}
					onChange={handleChange}
					onSubmit={handleSubmit}
					songId={songId}
				/>
			</Grid>
			<Grid item xs={12} md={6}>
				{songPreview ? (
					<SongViewer isPreview song={songPreview} />
				) : null}
			</Grid>
		</Grid>
	)
}

export default SongEditPage
