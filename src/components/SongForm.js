import Textarea from 'react-textarea-autosize'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'

import { Box, Button, MenuItem, TextField } from '@mui/material'
import { styled } from '@mui/material/styles'

import { keyOptions } from './KeySelector'

import { mapRefToInputRef } from '../utils/forms'

const PREFIX = 'SongForm'

const classes = {
	textEditor: `${PREFIX}-textEditor`,
	textEditorWrapper: `${PREFIX}-textEditorWrapper`,
}

const StyledForm = styled('form', { name: PREFIX })(({ theme }) => ({
	flexGrow: 1,

	[`& .${classes.textEditor}`]: {
		border: 'none',
		fontFamily: 'monospace',
		fontSize: theme.typography.h6.fontSize,
		minHeight: '80vh',
		padding: '24px',
		resize: 'none',
		width: '100%',
		backgroundColor: theme.palette.backgroundColor, //TODO: JL: not sure why these don't work
		color: theme.palette.color,
	},

	[`& .${classes.textEditorWrapper}`]: {
		display: 'flex',
		overflow: 'hidden',
		width: '100%',
		marginBottom: theme.spacing(4),
	},
}))

const useSongForm = songId => {
	const song = useSelector(state => state.songs.byId[songId]) || {}
	const { handleSubmit, register, ...rest } = useForm({
		defaultValues: {
			title: song.title || 'Title',
			author: song.author || 'Author',
			key: song.key || keyOptions[0],
			content: song.content || '',
			parserType: 'chords-above-words',
		},
	})

	const onSubmit = data => {
		console.log('submit form', data)
	}

	return {
		fields: {
			title: mapRefToInputRef(register('title')),
			author: mapRefToInputRef(register('author')),
			key: mapRefToInputRef(register('key')),
			content: mapRefToInputRef(register('content')),
			parserType: mapRefToInputRef(register('parserType')),
		},
		handleSubmit: handleSubmit(onSubmit),
		...rest,
	}
}

const SongForm = ({ onCancel, songId }) => {
	const { fields, formState, handleSubmit, reset } = useSongForm(songId)

	const handleCancel = () => {
		onCancel && onCancel()
	}

	console.log(fields['key'])

	return (
		<StyledForm onSubmit={handleSubmit}>
			<TextField
				id={'title'}
				label={'Song title'}
				fullWidth
				margin={'dense'}
				{...fields['title']}
			/>
			<TextField
				id={'author'}
				label={'Authors (comma separated)'}
				fullWidth
				margin={'dense'}
				{...fields['author']}
			/>
			<TextField
				select
				label={'Song Key'}
				margin={'dense'}
				sx={{ width: '15ch' }}
				//defaultValue={keyOptions.find(option => option.key === 'C')}
				//defaultValue={keyOptions[0]}
				{...fields['key']}
			>
				{keyOptions.map(option => (
					<MenuItem key={option.key} value={option}>
						{option.label}
					</MenuItem>
				))}
			</TextField>

			{/* <Grid item sm={12}>
                <Grid container>
                    <Grid item>
                        <select
                            onChange={this.handleParserChange}
                            value={parserType}
                            {...fields['parserType']}
                        >
                            <option value={'chords-above-words'}>
                                Chords above words
                            </option>
                            <option value={'chordpro'}>Onsong</option>
                        </select>
                    </Grid>
                </Grid>

                <Paper className={classes.textEditorWrapper}>
                    <Textarea
                        className={classes.textEditor}
                        placeholder={
                            'Type words and chords here. Add colons after section headings eg. Verse 1:'
                        }
                        {...fields['content']}
                    />
                </Paper>
            </Grid> */}

			<Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2 }}>
				<Button onClick={() => reset(formState.defaultValues)}>
					Reset
				</Button>
				<Button onClick={handleCancel}>Cancel</Button>

				<Button color={'primary'} variant={'contained'} type={'submit'}>
					Save
				</Button>
			</Box>
		</StyledForm>
	)
}

export default SongForm
