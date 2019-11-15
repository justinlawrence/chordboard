import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { format } from 'date-fns'
import { DatePicker  } from '@material-ui/pickers'

import { withStyles } from '@material-ui/styles'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import {
	Calendar as CalendarIcon,
	ChevronLeft as ChevronLeftIcon,
	ChevronRight as ChevronRightIcon,
} from 'mdi-material-ui'

const datePickerIcons = {
	leftArrowIcon: <ChevronLeftIcon />,
	rightArrowIcon: <ChevronRightIcon />,
}

const modes = {
	NEW: 'new',
	EDIT: 'edit',
}

const styles = theme => ({
	deleteButton: {
		color: theme.palette.error.main,
	},
})

class SetFormContainer extends Component {
	static defaultProps = {
		initialValues: {
			author: '',
			setDate: null,
			title: '',
			venue: '',
		},
	}

	static propTypes = {
		initialValues: PropTypes.shape({
			author: PropTypes.string,
			setDate: PropTypes.object,
			title: PropTypes.string,
			venue: PropTypes.string,
		}),
		isEdit: PropTypes.bool,
		onCancel: PropTypes.func.isRequired,
		onDelete: PropTypes.func,
		onSubmit: PropTypes.func.isRequired,
	}

	state = {
		mode: this.props.isEdit ? modes.EDIT : modes.NEW,
		newSet: {
			author: this.props.initialValues.author,
			setDate: this.props.initialValues.setDate || new Date(),
			title: this.props.initialValues.title,
			venue: this.props.initialValues.venue,
		},
	}

	handleChange = event => {
		const value = event.target.value
		const name = event.target.name
		this.setState(prevState => ({
			newSet: { ...prevState.newSet, [name]: value },
		}))
	}

	handleDateChange = date =>
		this.setState(prevState => ({
			newSet: { ...prevState.newSet, setDate: date },
		}))

	handleClearForm = event => {
		event.preventDefault()
		this.setState({
			newSet: {
				author: '',
				setDate: '',
				title: '',
				venue: '',
			},
		})
	}

	handleFormCancel = event => {
		this.handleClearForm(event)
		this.props.onCancel()
	}

	handleFormDelete = event => {
		this.handleClearForm(event)
		this.props.onDelete()
	}

	handleFormSubmit = event => {
		event.preventDefault()
		const setData = this.state.newSet
		// TODO: set validation
		this.props.onSubmit(setData)
	}

	render() {
		const { classes } = this.props
		const { mode, newSet } = this.state
		const currentDate = format(new Date(), 'd MMM yyyy')

		return (
			<form onSubmit={this.handleFormSubmit}>
				<Grid container spacing={1}>
					<Grid item xs={12} lg={6}>
						<TextField
							name="title"
							label="Set title"
							fullWidth
							margin="normal"
							onChange={this.handleChange}
							value={newSet.title}
						/>
					</Grid>

					<Grid item xs={12} lg={6}>
						<DatePicker
							label="Set date"
							format="d MMM yyyy"
							fullWidth
							invalidDateMessage={`Invalid Date Format (eg. ${currentDate})`}
							margin="normal"
							value={newSet.setDate}
							onChange={this.handleDateChange}
							variant="inline"
							{...datePickerIcons}
						/>
					</Grid>

					<Grid item xs={12} lg={6}>
						<TextField
							name="author"
							label="Set author"
							fullWidth
							margin="normal"
							onChange={this.handleChange}
							value={newSet.author}
						/>
					</Grid>

					<Grid item xs={12} lg={6}>
						<TextField
							name="venue"
							label="Venue"
							fullWidth
							margin="normal"
							onChange={this.handleChange}
							value={newSet.venue}
						/>
					</Grid>
					{this.props.isEdit && (
						<Grid item xs={6} lg={10}>
							<Button
								className={classes.deleteButton}
								onClick={this.handleFormDelete}
							>
								Delete set
							</Button>
						</Grid>
					)}

					<Grid item xs={6} lg={2}>
						<Button onClick={this.handleFormCancel}>Cancel</Button>

						<Button
							color="primary"
							type="submit"
							variant="contained"
						>
							Save
						</Button>
					</Grid>
				</Grid>
			</form>
		)
	}
}

export default withStyles(styles)(SetFormContainer)
