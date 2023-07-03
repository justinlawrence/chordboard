import { useCallback, useState } from 'react'
import { useHistory } from 'react-router-dom'

import { Box, Container, Grid } from '@mui/material'
import { styled } from '@mui/material/styles'

import SongForm from './SongForm'
import SongViewer from './SongViewer'
import Parser from '../parsers/song-parser'
import chordproParser from '../parsers/chordpro-parser'
import { useUpdateSong } from '../data/hooks'

const PREFIX = 'SongEditPage'

const classes = {
	preview: `${PREFIX}-preview`,
}

const StyledContainer = styled(Container, { name: PREFIX })(({ theme }) => ({
	display: 'flex',
	height: '100%',

	[`& .${classes.preview}`]: {
		zoom: '0.6',
	},
}))

const parser = new Parser()

const SongEditPage = ({ songId }) => {
	const history = useHistory()
	const { isLoading: isSaving, updateSong } = useUpdateSong()
	const [songPreview, setSongPreview] = useState(null)

	const handleCancel = useCallback(() => {
		history.goBack()
	}, [history])

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

	const handleSubmit = useCallback(
		data => {
			updateSong(songId, data)
		},
		[songId, updateSong]
	)

	return (
		<StyledContainer>
			<Grid container spacing={2}>
				<Grid item xs={12} md={8}>
					<SongForm
						onCancel={handleCancel}
						onChange={handleChange}
						onSubmit={handleSubmit}
						isSaving={isSaving}
						songId={songId}
					/>
				</Grid>
				<Grid item xs={12} md={4}>
					{songPreview ? (
						<Box sx={{ py: 2 }}>
							<SongViewer
								className={classes.preview}
								isPreview
								song={songPreview}
							/>
						</Box>
					) : null}
				</Grid>
			</Grid>
		</StyledContainer>
	)
}

export default SongEditPage
