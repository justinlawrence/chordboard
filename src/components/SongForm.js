import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import pick from 'lodash/pick'

import {
	Box,
	Button,
	CircularProgress,
	MenuItem,
	Paper,
	Stack,
	TextField,
} from '@mui/material'

import { styled } from '@mui/material/styles'

import { keyOptions } from './KeySelector'

import { mapRefToInputRef } from '../utils/forms'
import { useSong } from '../data/hooks'
import { useEffect } from 'react'

const PREFIX = 'SongForm'

const classes = {
	textEditor: `${PREFIX}-textEditor`,
	textEditorWrapper: `${PREFIX}-textEditorWrapper`,
}

const StyledForm = styled('form', { name: PREFIX })(({ theme }) => ({
	display: 'flex',
	height: '100%',
	padding: theme.spacing(2, 0, 4),

	[`& .${classes.textEditor}`]: {
		border: 'none',
		fontFamily: 'monospace',
		fontSize: theme.typography.h6.fontSize,
		padding: theme.spacing(3),
		resize: 'none',
		height: '100%',
		width: '100%',
		whiteSpace: 'nowrap',

		'&:focus': {
			outline: 'none',
		},
	},

	[`& .${classes.textEditorWrapper}`]: {
		display: 'flex',
		flex: '1 0 50vh',
		overflow: 'auto',
		width: '100%',
	},
}))

const useSongForm = (songId, config) => {
	const { data: song } = useSong(songId)
	const [hasLoaded, setHasLoaded] = useState(false)
	const { getValues, register, reset, ...rest } = useForm({
		defaultValues: {
			title: song?.title || '',
			author: song?.author || '',
			key: song?.key || 'C',
			content: song?.content || '',
			parserType: 'chords-above-words',
		},
		...config,
	})

	useEffect(() => {
		if (song && !hasLoaded) {
			setHasLoaded(true)
			reset({
				title: song.title || '',
				author: song.author || '',
				key: song.key || 'C',
				content: song.content || '',
				parserType: 'chords-above-words',
			})
		}
	}, [hasLoaded, reset, song])

	const addLabelFix = fieldName => ({
		...mapRefToInputRef(register(fieldName)),
		InputLabelProps: { shrink: Boolean(getValues(fieldName)) },
	})

	return {
		fields: {
			title: addLabelFix('title'),
			author: addLabelFix('author'),
			key: addLabelFix('key'),
			content: addLabelFix('content'),
			parserType: addLabelFix('parserType'),
		},
		getValues,
		register,
		...rest,
	}
}

const SongForm = ({ isSaving, onCancel, onChange, onSubmit, songId }) => {
	const { fields, formState, handleSubmit, register, watch } =
		useSongForm(songId)

	const watchAllFields = Boolean(onChange) && watch()

	useEffect(() => {
		if (onChange) {
			onChange(watchAllFields)
		}
	}, [onChange, watchAllFields])

	const handleCancel = () => {
		onCancel && onCancel()
	}

	const submit = data => {
		const dirtyData = pick(data, Object.keys(formState.dirtyFields))
		onSubmit(dirtyData)
	}

	return (
		<StyledForm onSubmit={handleSubmit(submit)}>
			<Stack spacing={2} sx={{ flexGrow: 1 }}>
				<TextField
					id={'title'}
					label={'Song title'}
					fullWidth
					margin={'none'}
					{...fields['title']}
				/>
				<TextField
					id={'author'}
					label={'Authors (comma separated)'}
					fullWidth
					margin={'none'}
					{...fields['author']}
				/>

				<Stack
					direction={'row'}
					spacing={1}
					sx={{ alignItems: 'center' }}
				>
					<TextField
						select
						label={'Song Key'}
						margin={'none'}
						sx={{ width: '10ch' }}
						defaultValue={formState.defaultValues.key}
						{...fields['key']}
					>
						{keyOptions.map(option => (
							<MenuItem key={option.key} value={option.key}>
								{option.label}
							</MenuItem>
						))}
					</TextField>

					<TextField
						select
						label={'Parser Type'}
						margin={'none'}
						sx={{ width: '25ch' }}
						defaultValue={formState.defaultValues.parserType}
						{...fields['parserType']}
					>
						<MenuItem value={'chords-above-words'}>
							Chords above words
						</MenuItem>
						<MenuItem value={'chordpro'}>Onsong</MenuItem>
					</TextField>

					<Box sx={{ flexGrow: 1 }} />

					<Button onClick={handleCancel}>Cancel</Button>

					<Button
						color={'primary'}
						disabled={isSaving}
						variant={'contained'}
						type={'submit'}
					>
						{isSaving ? (
							<CircularProgress color={'inherit'} size={24} />
						) : (
							'Save'
						)}
					</Button>
				</Stack>

				<Paper className={classes.textEditorWrapper}>
					{/* <TextareaAutosize
						className={classes.textEditor}
						placeholder={
							'Type words and chords here. Add colons after section headings eg. Verse 1:'
						}
						{...register('content')}
					/> */}
					<textarea
						className={classes.textEditor}
						{...register('content')}
					/>
				</Paper>
			</Stack>
		</StyledForm>
	)
}

export default React.memo(SongForm)
