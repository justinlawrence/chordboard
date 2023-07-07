import React from 'react'
import { styled } from '@mui/material/styles'
import { format, isBefore, isValid } from 'date-fns'
import cx from 'classnames'

import { Stack, Paper, Typography } from '@mui/material'

const PREFIX = 'DateSignifier'

const classes = {
	root: `${PREFIX}-root`,
	month: `${PREFIX}-month`,
	monthPast: `${PREFIX}-monthPast`,
	divider: `${PREFIX}-divider`,
	date: `${PREFIX}-date`,
	day: `${PREFIX}-day`,
}

const StyledPaper = styled(Paper)(({ theme }) => ({
	[`&.${classes.root}`]: {
		borderRadius: 4,
		overflow: 'hidden',
		width: theme.spacing(8),
	},

	[`& .${classes.month}`]: {
		backgroundColor: '#007FFF', //TODO: connect this to the theme primary (it wasn't visible from here)
		color: theme.palette.common.white,
		fontWeight: 800,
		height: theme.spacing(2.5),
		lineHeight: theme.spacing(2.5),
	},

	[`& .${classes.monthPast}`]: {
		backgroundColor: theme.palette.grey[400],
	},

	[`& .${classes.divider}`]: {
		borderBottom: `1px dotted ${theme.palette.divider}`,
		margin: `0 ${theme.spacing()}`,
	},

	[`& .${classes.date}`]: {
		fontWeight: 800,
	},

	[`& .${classes.day}`]: {
		fontWeight: 600,
	},
}))

const DateSignifier = ({ date }) => {
	return isValid(date) ? (
		<StyledPaper className={classes.root}>
			<Stack>
				<Typography
					className={cx(classes.month, {
						[classes.monthPast]: isBefore(date, new Date()),
					})}
					align={'center'}
					display={'block'}
					variant={'caption'}
				>
					{format(date, 'MMM')}
				</Typography>
				<Typography
					className={classes.date}
					align={'center'}
					display={'block'}
					variant={'h5'}
				>
					{format(date, 'd')}
				</Typography>

				<div className={classes.divider} />

				<Typography
					className={classes.day}
					align={'center'}
					display={'block'}
					variant={'caption'}
				>
					{format(date, 'EEE')}
				</Typography>
			</Stack>
		</StyledPaper>
	) : null
}

export default DateSignifier
