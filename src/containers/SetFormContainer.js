import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { format } from 'date-fns'
import { InlineDatePicker } from 'material-ui-pickers'

import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import {
	Calendar as CalendarIcon,
	ChevronLeft as ChevronLeftIcon,
	ChevronRight as ChevronRightIcon
} from 'mdi-material-ui'

const datePickerIcons = {
	leftArrowIcon: <ChevronLeftIcon />,
	rightArrowIcon: <ChevronRightIcon />
}

const modes = {
	NEW: 'new',
	EDIT: 'edit'
}

const styles = theme => ({
	deleteButton: {
		color: theme.palette.error.main
	}
})

class SetFormContainer extends Component {
	static propTypes = {
		initialValues: PropTypes.shape({
			author: PropTypes.string,
			date: PropTypes.string,
			title: PropTypes.string
		}),
		isEdit: PropTypes.bool,
		onCancel: PropTypes.func.isRequired,
		onDelete: PropTypes.func,
		onSubmit: PropTypes.func.isRequired
	}

	state = {
		mode: this.props.isEdit ? modes.EDIT : modes.NEW,
		newSet: {
			author: this.props.initialValues.author || '',
			date: this.props.initialValues.date || null,
			title: this.props.initialValues.title || ''
		}
	}

	handleChange = event => {
		const value = event.target.value
		const name = event.target.name
		this.setState(prevState => ({
			newSet: { ...prevState.newSet, [name]: value }
		}))
	}

	handleDateChange = date =>
		this.setState(prevState => ({
			newSet: { ...prevState.newSet, date }
		}))

	handleClearForm = event => {
		event.preventDefault()
		this.setState({
			newSet: {
				author: '',
				date: '',
				title: ''
			}
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
				<TextField
					name="title"
					label="Set title"
					fullWidth
					margin="normal"
					onChange={this.handleChange}
					value={newSet.title}
				/>

				{mode === modes.EDIT && (
					<TextField
						name="author"
						label="Set author"
						fullWidth
						margin="normal"
						onChange={this.handleChange}
						value={newSet.author}
					/>
				)}

				<InlineDatePicker
					label="Set date"
					format="d MMM yyyy"
					fullWidth
					invalidDateMessage={`Invalid Date Format (eg. ${currentDate})`}
					keyboard
					keyboardIcon={<CalendarIcon />}
					margin="normal"
					value={newSet.date}
					onChange={this.handleDateChange}
					{...datePickerIcons}
				/>

				<Grid container justify="flex-end" spacing={8}>
					{mode === modes.EDIT && (
						<Grid item>
							<Button
								className={classes.deleteButton}
								onClick={this.handleFormDelete}
							>
								Delete this set
							</Button>
						</Grid>
					)}

					<Grid item>
						<Button onClick={this.handleFormCancel}>Cancel</Button>
					</Grid>

					<Grid item>
						<Button color="primary" type="submit" variant="contained">
							Save
						</Button>
					</Grid>
				</Grid>
			</form>
		)
	}
}

export default withStyles(styles)(SetFormContainer)
