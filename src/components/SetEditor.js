/*
#
#
#
#
#
#
#
#
#   Most of this functionality has been merged into setviewer
#		
#		Mostly just used when creating a new set now
# 		
#		TODO: move across the song.create
#
#
#
#
#
#
*/

import React from 'react'
import { useHistory } from 'react-router-dom'

import { Paper } from '@mui/material'
import { styled } from '@mui/material/styles'

import ContentLimiter from './ContentLimiter'
import SetFormContainer from '../containers/SetFormContainer'
import { useAddSet } from '../data/hooks'

const PREFIX = 'SetEditor'

const classes = {
	root: `${PREFIX}-root`,
	form: `${PREFIX}-form`,
	formFooter: `${PREFIX}-formFooter`,
	control: `${PREFIX}-control`,
}

const Root = styled('div')(({ theme }) => ({
	[`& .${classes.root}`]: {
		flexGrow: 1,
	},

	[`& .${classes.form}`]: {
		padding: theme.spacing(2),

		[theme.breakpoints.up('sm')]: {
			paddingLeft: theme.spacing(3),
			paddingRight: theme.spacing(3),
		},
	},

	[`& .${classes.formFooter}`]: {
		marginTop: theme.spacing(2),
	},

	[`& .${classes.control}`]: {
		padding: theme.spacing(2),
	},
}))

const SetEditor = () => {
	const history = useHistory()
	const { addSet } = useAddSet()

	const handleFormCancel = () => {
		if (history) {
			history.goBack()
		}
	}

	const handleFormSubmit = setData => {
		addSet(setData)
		history.goBack()

		/*
		if (history) {
			history.push({
				pathname: '/sets',
			})
		}		*/
	}

	return (
		<Root className={'set-editor'}>
			<ContentLimiter>
				<Paper className={classes.form}>
					<SetFormContainer
						onCancel={handleFormCancel}
						onSubmit={handleFormSubmit}
					/>
				</Paper>
			</ContentLimiter>
		</Root>
	)
}

export default SetEditor
