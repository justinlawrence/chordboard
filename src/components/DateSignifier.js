import React from 'react'
import { styled } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import { format, isBefore, isValid } from 'date-fns'
import cx from 'classnames'

import withStyles from '@mui/styles/withStyles'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'

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
		backgroundColor: theme.palette.primary.main,
		color: theme.palette.common.white,
		fontWeight: 800,
		height: theme.spacing(1),
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

const DateSignifier = ({ date }) =>
	isValid(date) ? (
		<StyledPaper className={classes.root}>
			<Grid container direction={'column'}>
				<Grid item>
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
				</Grid>
				<Grid item>
					<Typography
						className={classes.date}
						align={'center'}
						display={'block'}
						variant={'h5'}
					>
						{format(date, 'd')}
					</Typography>
				</Grid>
				<Grid item className={classes.divider} />
				<Grid item>
					<Typography
						className={classes.day}
						align={'center'}
						display={'block'}
						variant={'caption'}
					>
						{format(date, 'EEE')}
					</Typography>
				</Grid>
			</Grid>
		</StyledPaper>
	) : null

DateSignifier.propTypes = {
	classes: PropTypes.object,
	date: PropTypes.object,
}

export default DateSignifier
