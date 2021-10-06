import React, { useEffect, useState } from 'react'
import { styled } from '@material-ui/core/styles'
import { find, noop, toLower } from 'lodash'

import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'

import getKeyDiff from '../utils/getKeyDiff'

const PREFIX = 'KeySelector'

const classes = {
	root: `${PREFIX}-root`,
}

const StyledTextField = styled(TextField)(({ theme }) => ({
	[`&.${classes.root}`]: {
		minWidth: theme.spacing(9),
	},
}))

const options = [
	{ key: 'C', label: 'C', value: 'c' },
	{ key: 'C#', label: 'C#', value: 'c#' },
	{ key: 'D', label: 'D', value: 'd' },
	{ key: 'Eb', label: 'Eb', value: 'eb' },
	{ key: 'E', label: 'E', value: 'e' },
	{ key: 'F', label: 'F', value: 'f' },
	{ key: 'F#', label: 'F#', value: 'f#' },
	{ key: 'G', label: 'G', value: 'g' },
	{ key: 'Ab', label: 'Ab', value: 'ab' },
	{ key: 'A', label: 'A', value: 'a' },
	{ key: 'Bb', label: 'Bb', value: 'bb' },
	{ key: 'B', label: 'B', value: 'b' },
]

const KeySelector = ({
	label,
	onSelect = noop,
	size = 'small',
	songKey = 'c',
	...other
}) => {
	const [key, setKey] = useState(songKey)

	useEffect(() => {
		const newKey = find(options, { value: toLower(songKey) })
		if (!newKey) {
			return
		}

		setKey(newKey.value)
	}, [songKey])

	const handleChange = event => {
		const value = event.target.value
		const option = find(options, { value })

		setKey(value)

		onSelect(option, getKeyDiff(songKey, option.key))
	}

	return (
		<StyledTextField
			className={classes.root}
			select
			size={size}
			label={label}
			value={key}
			onChange={handleChange}
			{...other}
		>
			{options.map(option => (
				<MenuItem key={option.value} value={option.value}>
					{option.label}
				</MenuItem>
			))}
		</StyledTextField>
	)
}

export default KeySelector
